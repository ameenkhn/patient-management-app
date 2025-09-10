/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['robohash.org', 'via.placeholder.com'],
    unoptimized: true
  },
}

module.exports = nextConfig