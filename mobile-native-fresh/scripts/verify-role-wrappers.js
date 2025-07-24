#!/usr/bin/env { { { { node

const fs = require('fs') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
const path = require('path');

console.log('🔍 Verifying role wrappers implementation...');

const shellDir = path.join(__dirname, '../src/shell');
const componentsDir = path.join(shellDir, 'components');

const requiredWrappers = [
  'RoleWrapper.tsx',
  'InteractiveWrapper.tsx',
  'ContentWrapper.tsx',
  'LayoutWrapper.tsx'
];

let allPassed = true;

// Check if components directory exists
if (!fs.existsSync(componentsDir)) {
  console.error('❌ src/shell/components/ directory does not exist');
  allPassed = false;
} else {
  console.log('✅ src/shell/components/ directory exists');
}

// Check required wrapper files
requiredWrappers.forEach(wrapper => {
  const wrapperPath = path.join(componentsDir, wrapper);
  if (!fs.existsSync(wrapperPath)) {
    console.error(`❌ ${wrapper} does not exist`);
    allPassed = false;
  } else {
    console.log(`✅ ${wrapper} exists`);
    
    // Check file content for key functions
    const content = fs.readFileSync(wrapperPath, 'utf8');
    
    if (wrapper === 'RoleWrapper.tsx') {
      if (content.includes('validateRole') && content.includes('RoleValidationResult')) {
        console.log(`✅ ${wrapper} has validation functions`);
      } else {
        console.error(`❌ ${wrapper} missing validation functions`);
        allPassed = false;
      }
    }
    
    if (wrapper === 'InteractiveWrapper.tsx') {
      if (content.includes('InteractiveWrapperProps') && content.includes('accessibilityState')) {
        console.log(`✅ ${wrapper} has accessibility features`);
      } else {
        console.error(`❌ ${wrapper} missing accessibility features`);
        allPassed = false;
      }
    }
    
    if (wrapper === 'ContentWrapper.tsx') {
      if (content.includes('ContentWrapperProps') && content.includes('getContentStyle')) {
        console.log(`✅ ${wrapper} has content styling`);
      } else {
        console.error(`❌ ${wrapper} missing content styling`);
        allPassed = false;
      }
    }
    
    if (wrapper === 'LayoutWrapper.tsx') {
      if (content.includes('LayoutWrapperProps') && content.includes('getDefaultZIndex')) {
        console.log(`✅ ${wrapper} has z-index protection`);
      } else {
        console.error(`❌ ${wrapper} missing z-index protection`);
        allPassed = false;
      }
    }
  }
});

// Check index.ts exports
const indexPath = path.join(componentsDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  if (content.includes('RoleWrapper') && 
      content.includes('InteractiveWrapper') && 
      content.includes('ContentWrapper') && 
      content.includes('LayoutWrapper')) {
    console.log('✅ Components index.ts exports all wrappers');
  } else {
    console.error('❌ Components index.ts missing wrapper exports');
    allPassed = false;
  }
  
  if (content.includes('version: \'1.4.201\'')) {
    console.log('✅ Components index.ts has correct version');
  } else {
    console.error('❌ Components index.ts has incorrect version');
    allPassed = false;
  }
} else {
  console.error('❌ Components index.ts does not exist');
  allPassed = false;
}

// Check TypeScript compilation
console.log('🔍 Checking TypeScript compilation...');
const { execSync } = require('child_process');
try {
  execSync('{ { { { { { npx tsc --noEmit --skipLibCheck src/shell/components/index.ts & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' }), { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });
  console.log('✅ TypeScript compilation passed');
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  allPassed = false;
}

if (allPassed) {
  console.log('🎉 Role wrappers validation passed!');
  process.exit(0);
} else {
  console.error('💥 Role wrappers validation failed!');
  process.exit(1);
} 