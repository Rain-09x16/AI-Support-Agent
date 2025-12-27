import { FAQ, Message } from '../../types/db.types';
import { LLMMessage } from '../../types/api.types';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

const SYSTEM_PROMPT_TEMPLATE = `You are a helpful and friendly customer support agent for our company. Your goal is to assist users with their questions quickly and accurately.

ROLE & CAPABILITIES:
- Answer questions about billing, account management, and technical support
- Provide clear, concise responses (under 200 words)
- Use information from the FAQ knowledge base below when available
- Admit when you don't know something rather than guessing
- Maintain a professional yet warm tone

RESPONSE GUIDELINES:
- Be direct: Answer the question in the first sentence
- Be specific: Include concrete steps, links, or examples
- Be concise: Keep responses under 200 words unless more detail is requested
- Be empathetic: Acknowledge user frustration when appropriate
- Use bullet points for multi-step instructions

CONSTRAINTS:
- ONLY answer questions related to our product/service
- DO NOT provide medical, legal, or financial advice
- DO NOT make promises about features or timelines
- DO NOT ask for sensitive information (passwords, credit card numbers)
- If a question is outside your scope, politely redirect to human support

AVAILABLE KNOWLEDGE BASE:
{faq_knowledge_base}

When answering:
1. Check if the FAQ knowledge base contains relevant information
2. Use that information as the primary source for your answer
3. If the answer isn't in the knowledge base, use general reasoning
4. If you're uncertain, say "I'm not sure" and suggest contacting support`;

export class PromptBuilder {
  private readonly MAX_TOTAL_TOKENS = 4000;
  private readonly MAX_HISTORY_TOKENS = 1200;

  build(
    userMessage: string,
    faqs: FAQ[],
    conversationHistory: Message[]
  ): LLMMessage[] {
    const faqText = this.formatFAQs(faqs);
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
      '{faq_knowledge_base}',
      faqText
    );

    const historyMessages = this.formatHistory(conversationHistory);
    const truncatedHistory = this.truncateHistory(
      historyMessages,
      this.MAX_HISTORY_TOKENS
    );

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...truncatedHistory,
      { role: 'user', content: userMessage },
    ];

    const totalTokens = this.estimateTotalTokens(messages);

    if (totalTokens > this.MAX_TOTAL_TOKENS) {
      logger.warn('Token limit exceeded, applying aggressive trimming', {
        totalTokens,
        limit: this.MAX_TOTAL_TOKENS,
      });
      return this.aggressiveTrim(messages);
    }

    logger.debug('Prompt built successfully', {
      systemTokens: this.estimateTokens(systemPrompt),
      historyMessages: truncatedHistory.length,
      faqCount: faqs.length,
      totalTokens,
    });

    return messages;
  }

  private formatFAQs(faqs: FAQ[]): string {
    if (faqs.length === 0) {
      return 'No specific FAQ information available for this query.';
    }

    const maxFAQs = Math.min(faqs.length, env.FAQ_MAX_RESULTS);
    const selectedFAQs = faqs.slice(0, maxFAQs);

    return selectedFAQs
      .map(
        (faq, index) =>
          `Q${index + 1}: [${faq.category || 'general'}] ${faq.question}\nA${index + 1}: ${faq.answer}`
      )
      .join('\n\n');
  }

  private formatHistory(messages: Message[]): LLMMessage[] {
    return messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));
  }

  private truncateHistory(messages: LLMMessage[], maxTokens: number): LLMMessage[] {
    const history: LLMMessage[] = [];
    let tokenCount = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const msgTokens = this.estimateTokens(msg.content);

      if (tokenCount + msgTokens > maxTokens) {
        break;
      }

      history.unshift(msg);
      tokenCount += msgTokens;
    }

    if (history.length < 2 && messages.length >= 2) {
      return messages.slice(-2);
    }

    return history;
  }

  private aggressiveTrim(messages: LLMMessage[]): LLMMessage[] {
    const system = messages[0];
    const recent = messages.slice(-5);
    return [system, ...recent];
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private estimateTotalTokens(messages: LLMMessage[]): number {
    return messages.reduce(
      (total, msg) => total + this.estimateTokens(msg.content),
      0
    );
  }

  buildSimplePrompt(userMessage: string): LLMMessage[] {
    const systemPrompt = SYSTEM_PROMPT_TEMPLATE.replace(
      '{faq_knowledge_base}',
      'No specific FAQ information available for this query.'
    );

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];
  }

  estimatePromptTokens(
    userMessage: string,
    faqs: FAQ[],
    conversationHistory: Message[]
  ): number {
    const messages = this.build(userMessage, faqs, conversationHistory);
    return this.estimateTotalTokens(messages);
  }
}

export const promptBuilder = new PromptBuilder();
