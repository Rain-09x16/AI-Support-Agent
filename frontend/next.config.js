/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // Production optimizations
  swcMinify: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
