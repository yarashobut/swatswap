module.exports = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '/**',
          },
        ],
      }  
};