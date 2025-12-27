'use client';

import type { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? 'animate-slide-in-right justify-end' : 'animate-slide-in-left justify-start'}`}
      role="article"
      aria-label={`${message.role} message`}
    >
      <div className={`flex max-w-[90%] sm:max-w-[85%] lg:max-w-[75%] gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar with geometric style */}
        <div className="flex-shrink-0 pt-0.5">
          <div
            className={`w-9 h-9 border-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isUser
                ? 'bg-gradient-to-br from-accent-primary to-accent-secondary border-accent-primary shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5'
                : 'bg-surface-accent border-surface-accent shadow-brutal-sm hover:shadow-brutal hover:-translate-y-0.5'
            }`}
            aria-hidden="true"
          >
            {isUser ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-text-inverse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813 2.846a.75.75 0 001.437.416l.5-1.75h2.752l.5 1.75a.75.75 0 001.437-.416L14 18.75l-.813-2.846M6.75 11.25v-1.5A4.5 4.5 0 0111.25 5h1.5a4.5 4.5 0 014.5 4.5v1.5m-10.5 0h10.5m-10.5 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm10.5 0a.75.75 0 00.75.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 00-.75.75z"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          {/* Message bubble with brutal shadow */}
          <div
            className={`relative group px-4 py-3 border-2 transition-all duration-300 ${
              isUser
                ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-text-inverse border-accent-primary clip-diagonal-tr shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5'
                : 'bg-surface-default text-text-primary border-border-default clip-diagonal-tl shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5'
            }`}
          >
            {/* Small decorative accent */}
            <div
              className={`absolute top-0 w-12 h-1 ${
                isUser
                  ? 'right-0 bg-text-inverse/30'
                  : 'left-0 bg-accent-primary'
              }`}
            />

            <div className={`text-sm sm:text-[15px] leading-relaxed break-words markdown-content ${
              isUser ? 'font-medium' : 'font-normal'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 bg-surface-elevated border border-border-subtle rounded text-xs font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="mt-2 mb-2 p-3 bg-surface-elevated border-2 border-border-default rounded-lg overflow-x-auto">
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  a: ({ children, href }) => {
                    const isSafe = (rawHref?: string | null) => {
                      if (!rawHref) return false;
                      const normalized = rawHref.trim();
                      // disallow dangerous schemes
                      const lower = normalized.toLowerCase();
                      if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
                        return false;
                      }
                      // allow explicit safe protocols
                      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalized)) {
                        const idx = normalized.indexOf(':');
                        const proto = idx !== -1 ? normalized.slice(0, idx).toLowerCase() : '';
                        return proto === 'http' || proto === 'https' || proto === 'mailto';
                      }
                      // relative or hash links are allowed
                      return normalized.startsWith('/') || normalized.startsWith('#') || normalized.startsWith('./') || normalized.startsWith('../');
                    };

                    const safeHref = href && isSafe(href) ? href.trim() : null;

                    if (safeHref) {
                      return (
                        <a
                          href={safeHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline font-medium"
                        >
                          {children}
                        </a>
                      );
                    }

                    // Render non-clickable text for unsafe or missing hrefs
                    return <span className="underline font-medium cursor-not-allowed">{children}</span>;
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent-primary pl-3 py-1 my-2 italic">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-1 mt-2">{children}</h3>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Timestamp with badge style */}
          <div className={`flex items-center gap-2 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="inline-flex items-center px-2.5 py-1 bg-surface-elevated border border-border-subtle rounded text-xs font-mono text-text-tertiary">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
