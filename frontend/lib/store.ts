import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, Message } from './types';
import { api } from './api';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: null,
      isLoading: false,
      error: null,

      sendMessage: async (content: string) => {
        const trimmedContent = content.trim();
        if (!trimmedContent) return;

        const userMessage: Message = {
          id: generateId(),
          role: 'user',
          content: trimmedContent,
          timestamp: new Date(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
          error: null,
        }));

        try {
          const currentSessionId = get().sessionId;
          const response = await api.sendMessage({
            message: trimmedContent,
            ...(currentSessionId ? { sessionId: currentSessionId } : {}),
          });

          const assistantMessage: Message = {
            id: response.message.id,
            role: 'assistant',
            content: response.message.content,
            timestamp: new Date(response.message.createdAt),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            sessionId: response.sessionId,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to send message';

          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetChat: () => {
        set({
          messages: [],
          sessionId: null,
          isLoading: false,
          error: null,
        });
      },

      setSessionId: (sessionId: string) => {
        set({ sessionId });
      },
    }),
    {
      name: 'ai-support-chat-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
      }),
    }
  )
);
