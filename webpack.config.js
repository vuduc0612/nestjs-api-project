const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@entity/user': path.resolve(__dirname, 'src/user/entity')
    }
  }
};