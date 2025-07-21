/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Direct access to specific PHP files
      {
        source: '/logout.php',
        destination: '/api/landx?path=logout.php',
      },
      {
        source: '/edit.php',
        destination: '/api/landx?path=edit.php',
      },
      {
        source: '/login.php', 
        destination: '/api/landx?path=login.php',
      },
      {
        source: '/dashboard.php',
        destination: '/api/landx?path=dashboard.php',
      },
      // General rewrite for LandX-Beta paths
      {
        source: '/LandX-Beta/:path*',
        destination: '/api/landx?path=:path*',
      },
      // Default landx access
      {
        source: '/landx',
        destination: '/api/landx',
      },
      // Catch remaining paths under /api/landx (keep this last)
      {
        source: '/api/landx/:path*',
        destination: '/api/landx?path=:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;