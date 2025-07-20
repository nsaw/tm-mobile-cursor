const fs = require('fs');
const config = require('../../.cursor-config.json');
config.patchTargetDir = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/patches';
fs.writeFileSync('../../.cursor-config.json', JSON.stringify(config, null, 2));
console.log('✅ Ghost patch routing fixed.');