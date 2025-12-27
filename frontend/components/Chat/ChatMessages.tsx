'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/lib/store';
import ChatMessage from './ChatMessage';
import ChatLoading from './ChatLoading';

export default function ChatMessages() {
  const messages = useChatStore((state) => state.messages);
  const isLoading = useChatStore((state) => state.isLoading);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "What are your shipping options?",
    "How do I return an item?",
    "What payment methods do you accept?",
  ];

  const handleSuggestedClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8 scrollbar-custom min-h-0"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label="Chat messages"
    >
      <div className="max-w-4xl mx-auto flex flex-col">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-6 px-4">
            {/* Animated hero icon */}
            <div className="relative mb-4 animate-scale-in">
              <div className="w-24 h-24 bg-surface-accent border-4 border-surface-accent rounded-2xl flex items-center justify-center shadow-brutal-lg">
                <svg
                  className="w-14 h-14 text-text-inverse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              {/* Floating accent elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-success border-2 border-surface-default rounded-lg animate-float" />
              <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-accent-primary border-2 border-surface-default rounded-lg animate-float" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Hero text */}
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2 tracking-tight animate-slide-in-up delay-100">
              Let's get started
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-lg mb-6 text-balance font-medium animate-slide-in-up delay-150">
              Ask me anything about products, shipping, returns, or support. I'm here to help 24/7.
            </p>

            {/* Suggested questions grid */}
            <div className="w-full max-w-2xl space-y-2 animate-slide-in-up delay-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-border-default" />
                <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Quick Start</span>
                <div className="h-px flex-1 bg-border-default" />
              </div>

              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedClick(question)}
                  disabled={isLoading}
                  className="group w-full px-4 py-2.5 text-left bg-surface-default border-2 border-border-default rounded-lg hover:border-accent-primary transition-all duration-300 hover:shadow-brutal hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none animate-scale-in"
                  style={{ animationDelay: `${300 + index * 75}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                      {question}
                    </span>
                    <svg
                      className="w-5 h-5 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 animate-fade-in delay-400">
              <span className="inline-flex items-center px-3 py-1.5 bg-accent-success/10 border border-accent-success/20 rounded-full text-xs font-semibold text-text-primary">
                <svg className="w-3 h-3 mr-1.5 text-accent-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant Responses
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-xs font-semibold text-text-primary">
                <svg className="w-3 h-3 mr-1.5 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                AI-Powered
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-accent-secondary/10 border border-accent-secondary/20 rounded-full text-xs font-semibold text-text-primary">
                <svg className="w-3 h-3 mr-1.5 text-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                24/7 Available
              </span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <ChatLoading />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
