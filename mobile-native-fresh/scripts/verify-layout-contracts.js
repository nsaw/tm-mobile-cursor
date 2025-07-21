#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying layout contracts implementation...');

const shellDir = path.join(__dirname, '../src/shell');
const layoutsDir = path.join(shellDir, 'layouts');

const requiredFiles = [
  'LayoutContract.ts',
  'LayoutManager.ts',
  'index.ts'
];

let allPassed = true;

// Check if layouts directory exists
if (!fs.existsSync(layoutsDir)) {
  console.error('❌ src/shell/layouts/ directory does not exist');
  allPassed = false;
} else {
  console.log('✅ src/shell/layouts/ directory exists');
}

// Check required files
requiredFiles.forEach(file => {
  const filePath = path.join(layoutsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${file} does not exist`);
    allPassed = false;
  } else {
    console.log(`✅ ${file} exists`);
    
    // Check file content for key features
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file === 'LayoutContract.ts') {
      if (content.includes('ZIndexContract') && content.includes('SafeFrameShell')) {
        console.log(`✅ ${file} has contract interfaces`);
      } else {
        console.error(`❌ ${file} missing contract interfaces`);
        allPassed = false;
      }
      
      if (content.includes('defaultZIndexContracts') && content.includes('defaultSafeFrameShells')) {
        console.log(`✅ ${file} has default contracts`);
      } else {
        console.error(`❌ ${file} missing default contracts`);
        allPassed = false;
      }
      
      if (content.includes('getZIndexForLayer') && content.includes('validateZIndex')) {
        console.log(`✅ ${file} has utility functions`);
      } else {
        console.error(`❌ ${file} missing utility functions`);
        allPassed = false;
      }
    }
    
    if (file === 'LayoutManager.ts') {
      if (content.includes('LayoutManagerImpl') && content.includes('validateLayout')) {
        console.log(`✅ ${file} has manager implementation`);
      } else {
        console.error(`❌ ${file} missing manager implementation`);
        allPassed = false;
      }
      
      if (content.includes('registerLayout') && content.includes('unregisterLayout')) {
        console.log(`✅ ${file} has registration methods`);
      } else {
        console.error(`❌ ${file} missing registration methods`);
        allPassed = false;
      }
      
      if (content.includes('layoutManager') && content.includes('new LayoutManagerImpl')) {
        console.log(`✅ ${file} has singleton instance`);
      } else {
        console.error(`❌ ${file} missing singleton instance`);
        allPassed = false;
      }
    }
    
    if (file === 'index.ts') {
      if (content.includes('LayoutContract') && content.includes('LayoutManagerImpl')) {
        console.log(`✅ ${file} exports layout components`);
      } else {
        console.error(`❌ ${file} missing layout exports`);
        allPassed = false;
      }
      
      if (content.includes('version: \'1.4.202\'')) {
        console.log(`✅ ${file} has correct version`);
      } else {
        console.error(`❌ ${file} has incorrect version`);
        allPassed = false;
      }
    }
  }
});

// Check for TypeScript compilation
console.log('🔍 Checking TypeScript compilation...');
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit --skipLibCheck src/shell/layouts/index.ts', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation passed');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  allPassed = false;
}

if (allPassed) {
  console.log('🎉 Layout contracts validation passed!');
  process.exit(0);
} else {
  console.error('💥 Layout contracts validation failed!');
  process.exit(1);
} 