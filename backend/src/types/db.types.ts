export interface Conversation {
  id: string;
  session_id: string;
  user_identifier: string | null;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number | null;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  keywords: string[];
  priority: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ConversationWithCount extends Conversation {
  message_count: number;
}
