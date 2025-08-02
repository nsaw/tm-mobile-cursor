#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const criticalFiles = [
  'src-nextgen/utils/ValidationSystem.ts',
  'src-nextgen/utils/PerformanceMonitor.ts',
  'src-nextgen/shell/wrappers/AutoRoleView.tsx',
  'src-nextgen/shell/wrappers/RoleWrapper.tsx'
];

function validateExports(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const hasExports = content.includes('export ');
  
  if (!hasExports) {
    console.error(`❌ No exports found in: ${filePath}`);
    return false;
  }

  console.log(`✅ Exports validated: ${filePath}`);
  return true;
}

function main() {
  console.log('🔍 Validating critical file exports...');
  
  let allValid = true;
  for (const file of criticalFiles) {
    if (!validateExports(file)) {
      allValid = false;
    }
  }

  if (allValid) {
    console.log('✅ All critical file exports validated successfully');
    process.exit(0);
  } else {
    console.error('❌ Export validation failed');
    process.exit(1);
  }
}

main(); 