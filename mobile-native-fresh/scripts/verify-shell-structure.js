#!/usr/bin/env node

/**
 * Verify Shell Structure Script
 * Validates that the shell directory structure has been properly created
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying shell directory structure...');

const shellPath = path.join(__dirname, '../src-nextgen/shell');
const requiredDirs = [
  'role-wrappers',
  'layout-contracts',
  'navigation-definitions',
  'sacred-view-mounts'
];

const requiredFiles = [
  'index.ts',
  'types.ts',
  'validation.ts'
];

let allValid = true;

// Check if shell directory exists
if (!fs.existsSync(shellPath)) {
  console.error('❌ Shell directory does not exist at:', shellPath);
  allValid = false;
} else {
  console.log('✅ Shell directory exists');
}

// Check required subdirectories
for (const dir of requiredDirs) {
  const dirPath = path.join(shellPath, dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Required subdirectory missing: ${dir}`);
    allValid = false;
  } else {
    console.log(`✅ Subdirectory exists: ${dir}`);
  }
}

// Check required files
for (const file of requiredFiles) {
  const filePath = path.join(shellPath, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required file missing: ${file}`);
    allValid = false;
  } else {
    console.log(`✅ File exists: ${file}`);
  }
}

// Check TypeScript configuration
const tsConfigPath = path.join(shellPath, 'tsconfig.json');
if (!fs.existsSync(tsConfigPath)) {
  console.error('❌ TypeScript configuration missing');
  allValid = false;
} else {
  console.log('✅ TypeScript configuration exists');
}

if (allValid) {
  console.log('✅ Shell structure validation passed');
  process.exit(0);
} else {
  console.error('❌ Shell structure validation failed');
  process.exit(1);
} 