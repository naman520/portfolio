/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/namantest',
        destination: 'https://bma-dholera-sir.onrender.com/namantest', // Proxy to the API route
      },
    ];
  },
};

export default nextConfig;
