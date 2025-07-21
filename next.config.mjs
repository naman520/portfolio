const nextConfig = {
  async rewrites() {
    return [
      // Direct access to specific PHP files for namantest
      {
        source: '/superadmin.php',
        destination: '/api/namantest?path=superadmin.php',
      },
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
      // Default namantest access
      {
        source: '/namantest',
        destination: '/api/namantest',
      },
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