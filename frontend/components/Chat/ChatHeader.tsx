'use client';

import { useChatStore } from '@/lib/store';

export default function ChatHeader() {
  const resetChat = useChatStore((state) => state.resetChat);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new chat? This will clear all messages.')) {
      resetChat();
    }
  };

  return (
    <header className="bg-surface-default border-b-2 border-border-default relative animate-slide-in-up flex-shrink-0">
      {/* Accent stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary"></div>

      <div className="max-w-4xl mx-auto px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo with brutal shadow */}
            <div className="relative group">
              <div className="w-12 h-12 bg-surface-accent border-2 border-surface-accent rounded-lg flex items-center justify-center shadow-brutal-sm transition-all duration-300 group-hover:shadow-brutal group-hover:-translate-y-0.5">
                <svg
                  className="w-6 h-6 text-text-inverse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent-success rounded-full border-2 border-surface-default animate-pulse-slow"></div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                AI Support
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-medium">
                Real-time assistance • Always here to help
              </p>
            </div>
          </div>

          {/* Reset button with brutal style */}
          <button
            onClick={handleReset}
            className="group relative px-3 py-2 bg-surface-elevated border-2 border-border-default hover:border-surface-accent rounded-lg transition-all duration-200 hover:shadow-brutal-sm hover:-translate-y-0.5 focus-brutal"
            aria-label="Start new chat"
            title="Start new chat"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-text-secondary group-hover:text-surface-accent transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-semibold text-text-secondary group-hover:text-surface-accent transition-colors hidden sm:inline">
                New Chat
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
