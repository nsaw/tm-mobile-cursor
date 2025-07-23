// Test script to verify cache mirroring functionality
const { mirrorPatchToCache, mirrorSummaryToCache } = require('./ghost/ghost-patch-relay.ts');

console.log('🧪 Testing cache mirror functionality...');

// Test patch mirroring
const testPatchPath = '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/tasks/patches/test-cache-mirror.json';
const testSummaryPath = '/Users/sawyer/gitSync/tm-mobile-cursor/summaries/test-cache-mirror.md';

try {
  mirrorPatchToCache(testPatchPath);
  mirrorSummaryToCache(testSummaryPath);
  console.log('✅ Cache mirror test completed successfully');
} catch (error) {
  console.error('❌ Cache mirror test failed:', error.message);
  process.exit(1);
} 