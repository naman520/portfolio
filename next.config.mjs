/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Direct access to specific PHP files (most specific first)
      {
        source: '/logout.php',
        destination: '/api/namantest?path=logout.php',
      },
      {
        source: '/superadmin.php',
        destination: '/api/namantest?path=superadmin.php',
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
      // Handle any other PHP files
      {
        source: '/:file.php',
        destination: '/api/namantest?path=:file.php',
      },
      // General rewrite for namantest-Beta paths
      {
        source: '/namantest-Beta/:path*',
        destination: '/api/namantest?path=:path*',
      },
      // General rewrite for namanTest paths (note the capital T)
      {
        source: '/namanTest/:path*',
        destination: '/api/namantest?path=/namanTest/:path*',
      },
      // Default namantest access
      {
        source: '/namantest',
        destination: '/api/namantest',
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