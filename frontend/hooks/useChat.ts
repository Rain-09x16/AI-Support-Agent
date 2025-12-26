'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';

export function useChat() {
  const messages = useChatStore((state) => state.messages);
  const sessionId = useChatStore((state) => state.sessionId);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const clearError = useChatStore((state) => state.clearError);
  const resetChat = useChatStore((state) => state.resetChat);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return {
    messages,
    sessionId,
    isLoading,
    error,
    sendMessage,
    clearError,
    resetChat,
    messagesEndRef,
    scrollToBottom,
  };
}
