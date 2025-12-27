import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-surface-accent border-4 border-surface-accent rounded-2xl flex items-center justify-center shadow-brutal-lg">
            <span className="text-4xl font-bold text-text-inverse">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>

        <p className="text-text-secondary mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-accent-primary to-accent-secondary border-2 border-accent-primary rounded-lg font-bold text-white transition-all duration-300 hover:shadow-brutal hover:-translate-y-1 shadow-brutal-sm"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Home
        </Link>
      </div>
    </div>
  );
}
