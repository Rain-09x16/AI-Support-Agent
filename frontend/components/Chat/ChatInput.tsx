'use client';

import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/store';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);
  const clearError = useChatStore((state) => state.clearError);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto first to get accurate scrollHeight
      textarea.style.height = 'auto';

      // Calculate new height with smooth expansion (max 200px, min 52px)
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(52, Math.min(scrollHeight, 200));
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) return;

    setInput('');
    if (error) clearError();
    await sendMessage(trimmedInput);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="border-t-2 border-border-default bg-surface-default relative flex-shrink-0">
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-50" />

      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {error && (
          <div
            className="mb-3 p-3 bg-accent-error/10 border-2 border-accent-error/30 rounded-lg flex items-start justify-between animate-scale-in shadow-brutal-sm"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-accent-error rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-accent-error">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-accent-error hover:bg-accent-error/10 rounded transition-colors focus-brutal"
              aria-label="Dismiss error"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 flex flex-col">
            <label htmlFor="message-input" className="sr-only">
              Type your message
            </label>

            {/* Character count indicator (appears when typing) */}
            {input.length > 0 && (
              <div className="mb-1.5 flex justify-end animate-fade-in">
                <span className={`text-xs font-mono ${
                  input.length > 1800 ? 'text-accent-error' : 'text-text-tertiary'
                }`}>
                  {input.length}/2000
                </span>
              </div>
            )}

            <textarea
              ref={textareaRef}
              id="message-input"
              rows={1}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Type your message..."
              className="block w-full px-4 py-3 bg-white border border-border-subtle rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-border-default focus:border-border-default transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] text-text-primary placeholder:text-text-tertiary relative z-10 overflow-hidden"
              style={{
                minHeight: '52px',
                maxHeight: '200px',
                lineHeight: '1.5',
              }}
              aria-label="Message input"
            />

          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="group relative px-5 py-3.5 bg-gradient-to-br from-accent-primary to-accent-secondary border-2 border-accent-primary rounded-lg font-bold text-white transition-all duration-300 hover:shadow-brutal hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus-brutal shadow-brutal-sm flex-shrink-0"
            aria-label="Send message"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="hidden sm:inline">Sending...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Send</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
