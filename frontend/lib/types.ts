export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  sessionId: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    createdAt: string;
  };
  conversationCreated?: boolean;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ErrorResponse {
  detail: string;
}

export interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
  resetChat: () => void;
  setSessionId: (sessionId: string) => void;
}
