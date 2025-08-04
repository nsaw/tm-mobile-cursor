const detox = require('detox');

module.exports = async () => {
  await detox.globalCleanup();
}; 