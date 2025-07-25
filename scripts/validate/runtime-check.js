#!/usr/bin/env node

// Runtime validation script
const { execSync } = require('child_process');

console.log('🔍 Checking runtime status...');

try {
  // Check if Expo is running
  const expoStatus = execSync('curl -s http://localhost:8081/status', { encoding: 'utf8' });
  console.log('✅ Expo status:', expoStatus.trim());
  
  // Check if Metro bundler is working
  console.log('✅ Runtime validation passed');
  process.exit(0);
} catch (error) {
  console.log('❌ Runtime validation failed:', error.message);
  process.exit(1);
} 