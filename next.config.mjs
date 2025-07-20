/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/namantest',
        destination: '/api/namantest', // Proxy to the API route
      },
    ];
  },
};

export default nextConfig;
