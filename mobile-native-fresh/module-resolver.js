const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@legacy': path.resolve(__dirname, 'src-reference'),
      '@legacy/': path.resolve(__dirname, 'src-reference/'),
    },
  },
}; 