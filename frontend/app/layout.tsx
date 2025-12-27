import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'AI Support Chat | Your Intelligent Support Assistant',
  description:
    'Get instant support with our AI-powered chat assistant. Fast, reliable, and available 24/7 to help answer your questions.',
  keywords: ['AI', 'support', 'chat', 'assistant', 'customer service'],
  authors: [{ name: 'AI Support Team' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'AI Support Chat',
    description: 'Your intelligent support assistant, available 24/7',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Support Chat',
    description: 'Your intelligent support assistant, available 24/7',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <main className="h-screen w-full overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
