/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/namantest/:path*',
        destination: '/api/namantest?path=/:path*',
      },
      {
        source: '/namantest',
        destination: '/api/namantest',
      },
    ];
  },
  // Optional: Add headers for better proxy support
  async headers() {
    return [
      {
        source: '/api/namantest/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;