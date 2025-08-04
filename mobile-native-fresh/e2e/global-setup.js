const detox = require('detox');
const config = require('../.detoxrc.cjs');

module.exports = async () => {
  await detox.globalInit(config);
}; 