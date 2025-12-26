import axios, { AxiosError } from 'axios';
import { env } from '../../config/env';
import { LLMMessage, LLMRequest, LLMResponse } from '../../types/api.types';
import { LLMServiceError } from '../../utils/errors';
import { logger } from '../../utils/logger';

class OpenRouterService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxTokens: number;
  private readonly temperature: number;
  private readonly timeout: number;

  constructor() {
    this.apiUrl = env.OPENROUTER_API_URL;
    this.apiKey = env.OPENROUTER_API_KEY;
    this.model = env.OPENROUTER_MODEL;
    this.maxTokens = env.OPENROUTER_MAX_TOKENS;
    this.temperature = env.OPENROUTER_TEMPERATURE;
    this.timeout = env.OPENROUTER_TIMEOUT;
  }

  async generateResponse(
    messages: LLMMessage[],
    retries = 3
  ): Promise<{ content: string; tokensUsed: number }> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.callAPI(messages);

        if (!response.choices || response.choices.length === 0) {
          throw new Error('No response choices returned from LLM');
        }

        const content = response.choices[0].message.content;
        const tokensUsed = response.usage?.total_tokens || 0;

        logger.info('LLM response generated successfully', {
          model: this.model,
          tokensUsed,
          attempt,
        });

        return { content, tokensUsed };
      } catch (error: any) {
        lastError = error;
        const isLastAttempt = attempt === retries;

        if (this.isRetriableError(error) && !isLastAttempt) {
          const backoffMs = this.calculateBackoff(attempt);
          logger.warn('LLM call failed, retrying', {
            attempt,
            retries,
            backoffMs,
            error: error.message,
          });

          await this.sleep(backoffMs);
          continue;
        }

        logger.error('LLM call failed', {
          attempt,
          error: error.message,
          isRetriable: this.isRetriableError(error),
        });

        if (isLastAttempt) {
          break;
        }
      }
    }

    throw new LLMServiceError(
      `AI service temporarily unavailable. Please try again. (${lastError?.message})`,
      true
    );
  }

  private async callAPI(messages: LLMMessage[]): Promise<LLMResponse> {
    const request: LLMRequest = {
      model: this.model,
      messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
    };

    try {
      const response = await axios.post<LLMResponse>(
        `${this.apiUrl}/chat/completions`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://ai-support-agent.com',
            'X-Title': 'AI Support Agent',
          },
          timeout: this.timeout,
        }
      );

      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
          const status = axiosError.response.status;
          const data = axiosError.response.data as any;

          logger.error('OpenRouter API error', {
            status,
            error: data?.error || axiosError.message,
          });

          if (status === 401) {
            throw new Error('Invalid OpenRouter API key');
          }

          if (status === 429) {
            throw new Error('Rate limit exceeded on OpenRouter');
          }

          if (status >= 500) {
            throw new Error(`OpenRouter server error: ${status}`);
          }

          throw new Error(data?.error?.message || 'OpenRouter API error');
        }

        if (axiosError.code === 'ECONNABORTED') {
          throw new Error('Request timeout');
        }

        if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to OpenRouter');
        }

        throw new Error(axiosError.message);
      }

      throw error;
    }
  }

  private isRetriableError(error: any): boolean {
    const retriableMessages = [
      'timeout',
      'ECONNABORTED',
      'ENOTFOUND',
      'ECONNREFUSED',
      'server error',
      'rate limit',
    ];

    const errorMessage = error.message?.toLowerCase() || '';
    return retriableMessages.some((msg) => errorMessage.includes(msg));
  }

  private calculateBackoff(attempt: number): number {
    const baseDelay = 1000;
    const maxDelay = 10000;
    const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    const jitter = Math.random() * 500;
    return delay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testMessages: LLMMessage[] = [
        { role: 'user', content: 'Hello' },
      ];

      const response = await this.callAPI(testMessages);
      return response.choices && response.choices.length > 0;
    } catch (error) {
      logger.error('OpenRouter health check failed', { error });
      return false;
    }
  }
}

export const openRouterService = new OpenRouterService();
