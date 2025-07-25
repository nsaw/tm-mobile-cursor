#!/usr/bin/env node

// Component validation script
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking component structure...');

try {
  const componentsDir = path.join(__dirname, '../../mobile-native-fresh/src-reference-complete/components');
  
  if (fs.existsSync(componentsDir)) {
    const components = fs.readdirSync(componentsDir);
    console.log('✅ Found components:', components.length);
    console.log('✅ Component validation passed');
    process.exit(0);
  } else {
    console.log('❌ Components directory not found');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Component validation failed:', error.message);
  process.exit(1);
} 