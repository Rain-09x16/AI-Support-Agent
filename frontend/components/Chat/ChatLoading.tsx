'use client';

export default function ChatLoading() {
  return (
    <div className="flex w-full mb-4 justify-start" role="status" aria-live="polite">
      <div className="flex max-w-[85%] sm:max-w-[75%]">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 mr-3"
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-100 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">AI is typing</span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot"
                  style={{ animationDelay: '0ms' }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot"
                  style={{ animationDelay: '200ms' }}
                  aria-hidden="true"
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-dot"
                  style={{ animationDelay: '400ms' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">AI is typing a response</span>
    </div>
  );
}
