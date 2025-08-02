#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateNavigationTypes() {
  console.log('🧭 Validating navigation types...');
  
  const navigationFiles = [
    'src-nextgen/navigation/types.ts',
    'src-nextgen/navigation/DualMountNavigator.tsx',
    'src-nextgen/navigation/RootNavigator.tsx'
  ];

  let allValid = true;
  
  for (const file of navigationFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Navigation file not found: ${file}`);
      allValid = false;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for required navigation exports
    if (file.includes('types.ts') && !content.includes('export type RootStackParamList')) {
      console.error(`❌ Missing RootStackParamList export in: ${file}`);
      allValid = false;
    }
    
    if (file.includes('DualMountNavigator') && !content.includes('export')) {
      console.error(`❌ Missing exports in: ${file}`);
      allValid = false;
    }
    
    if (file.includes('RootNavigator') && !content.includes('export')) {
      console.error(`❌ Missing exports in: ${file}`);
      allValid = false;
    }

    console.log(`✅ Navigation file validated: ${file}`);
  }

  // Check for deep link configuration
  const hasDeepLinkConfig = fs.existsSync(path.join(process.cwd(), 'app.json')) &&
    fs.readFileSync(path.join(process.cwd(), 'app.json'), 'utf8').includes('scheme');

  if (hasDeepLinkConfig) {
    console.log('✅ Deep link configuration detected');
  } else {
    console.log('⚠️  No deep link configuration detected');
  }

  return allValid;
}

function main() {
  const isValid = validateNavigationTypes();
  
  if (isValid) {
    console.log('✅ Navigation validation passed');
    process.exit(0);
  } else {
    console.error('❌ Navigation validation failed');
    process.exit(1);
  }
}

main(); 