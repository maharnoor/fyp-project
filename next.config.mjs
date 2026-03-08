/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
  // Suppress hydration warnings for browser extensions
  reactStrictMode: true,
}

export default nextConfig
