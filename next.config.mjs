
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/namantest',
        destination: '/api/namantest', // Proxy to the API route
      },
    ];
  },
};
