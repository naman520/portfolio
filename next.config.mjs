const nextConfig = {
  async rewrites() {
    return [
      // Direct access to specific PHP files
      {
        source: '/logout.php',
        destination: '/api/namantest?path=logout.php',
      },
      {
        source: '/edit.php',
        destination: '/api/namantest?path=edit.php',
      },
      {
        source: '/login.php', 
        destination: '/api/namantest?path=login.php',
      },
      {
        source: '/dashboard.php',
        destination: '/api/namantest?path=dashboard.php',
      },
      // General rewrite for namantest-Beta paths
      {
        source: '/namantest-Beta/:path*',
        destination: '/api/namantest?path=:path*',
      },
      // Default namantest access
      {
        source: '/namantest',
        destination: '/api/namantest',
      },
      // Catch remaining paths under /api/namantest (keep this last)
      {
        source: '/api/namantest/:path*',
        destination: '/api/namantest?path=:path*',
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