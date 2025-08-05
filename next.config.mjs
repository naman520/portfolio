/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Handle favicon specifically
      {
        source: '/favicon.ico',
        destination: '/api/namantest?path=/favicon.ico',
      },
      // Test the basic API route first
      {
        source: '/test-api',
        destination: '/api/namantest?path=dashboard.php',
      },
      // Direct access to specific PHP files with explicit handling
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
      {
        source: '/generate_pdf.php',
        destination: '/api/namantest?path=generate_pdf.php',
      },
      // Handle other common PHP files
      {
        source: '/index.php',
        destination: '/api/namantest?path=index.php',
      },
      {
        source: '/admin.php',
        destination: '/api/namantest?path=admin.php',
      },
      // Handle CSS, JS, and image files
      {
        source: '/css/:path*',
        destination: 'https://bigbucket.online/namanTest/css/:path*',
      },
      {
        source: '/js/:path*',
        destination: 'https://bigbucket.online/namanTest/js/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'https://bigbucket.online/namanTest/images/:path*',
      },
      {
        source: '/img/:path*',
        destination: 'https://bigbucket.online/namanTest/img/:path*',
      },
      {
        source: "/uploads/pdfs/:path*",
        destination: "/api/namantest?path=uploads/pdfs/:path*",
      },
      // Default namanTest access - should be last
      {
        source: '/namantest',
        destination: '/api/namantest',
      },
      {
        source: '/namantest/:path*',
        destination: '/api/namantest?path=:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
      // Specific headers for API routes
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        source: "/api/namantest",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type",
          },
        ],
      },
      {
        source: "/uploads/pdfs/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Expose-Headers", value: "*" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },

  // Additional configuration for better production handling
  poweredByHeader: false,
  compress: true,
  
  // Handle trailing slashes consistently
  trailingSlash: false,
  
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;