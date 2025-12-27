'use client';

export default function ChatLoading() {
  return (
    <div className="flex w-full mb-6 justify-start animate-slide-in-left" role="status" aria-live="polite">
      <div className="flex max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] gap-3">
        {/* Avatar with pulse animation */}
        <div className="flex-shrink-0 pt-1">
          <div className="w-10 h-10 bg-surface-accent border-2 border-surface-accent rounded-lg flex items-center justify-center shadow-brutal-sm animate-pulse-slow">
            <svg
              className="w-5 h-5 text-text-inverse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813 2.846a.75.75 0 001.437.416l.5-1.75h2.752l.5 1.75a.75.75 0 001.437-.416L14 18.75l-.813-2.846M6.75 11.25v-1.5A4.5 4.5 0 0111.25 5h1.5a4.5 4.5 0 014.5 4.5v1.5m-10.5 0h10.5m-10.5 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zm10.5 0a.75.75 0 00.75.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 00-.75.75z"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {/* Loading bubble with shimmer effect */}
          <div className="relative px-5 py-4 bg-surface-default border-2 border-border-default clip-diagonal-tl shadow-brutal overflow-hidden">
            {/* Accent stripe */}
            <div className="absolute top-0 left-0 w-12 h-1 bg-accent-primary" />

            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-shimmer opacity-50" />

            <div className="relative flex items-center gap-3">
              <span className="text-[15px] text-text-secondary font-medium">Thinking</span>

              {/* Animated dots */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 bg-accent-primary rounded-full animate-typing-dot"
                  style={{ animationDelay: '0ms' }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-accent-primary rounded-full animate-typing-dot"
                  style={{ animationDelay: '200ms' }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-accent-primary rounded-full animate-typing-dot"
                  style={{ animationDelay: '400ms' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Loading indicator badge */}
          <div className="flex items-center gap-2 px-2">
            <span className="inline-flex items-center px-2.5 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded text-xs font-mono text-accent-primary animate-pulse-slow">
              <svg className="w-3 h-3 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating response
            </span>
          </div>
        </div>
      </div>
      <span className="sr-only">AI is typing a response</span>
    </div>
  );
}
