import { z } from 'zod';

export const ChatMessageRequestSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be 2000 characters or less')
    .trim(),
  metadata: z.record(z.any()).optional(),
});

export type ChatMessageRequest = z.infer<typeof ChatMessageRequestSchema>;

export interface ChatMessageResponse {
  sessionId: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    createdAt: string;
  };
  conversationCreated?: boolean;
}

export const ConversationHistoryParamsSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID format'),
});

export const ConversationHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  before: z.string().uuid().optional(),
});

export type ConversationHistoryParams = z.infer<typeof ConversationHistoryParamsSchema>;
export type ConversationHistoryQuery = z.infer<typeof ConversationHistoryQuerySchema>;

export interface ConversationHistoryResponse {
  conversation: {
    id: string;
    sessionId: string;
    createdAt: string;
    updatedAt: string;
    messageCount: number;
  };
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: string;
  }>;
  pagination: {
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    llm: 'up' | 'down';
  };
  uptime: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
  requestId?: string;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  max_tokens: number;
  temperature: number;
}

export interface LLMResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
