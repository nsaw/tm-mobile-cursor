#!/usr/bin/env node

/**
 * Verify Shell Structure Script
 * Validates that the shell directory structure has been properly created
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying shell directory structure...');

const shellDir = path.join(__dirname, '../src/shell');
const requiredDirs = [
  'components',
  'layouts', 
  'navigation',
  'roles',
  'types',
  'utils'
];

const requiredFiles = [
  'index.ts',
  'components/index.ts',
  'layouts/index.ts',
  'navigation/index.ts',
  'roles/index.ts',
  'types/index.ts',
  'utils/index.ts'
];

let allPassed = true;

// Check if shell directory exists
if (!fs.existsSync(shellDir)) {
  console.error('❌ src/shell/ directory does not exist');
  allPassed = false;
} else {
  console.log('✅ src/shell/ directory exists');
}

// Check required subdirectories
requiredDirs.forEach(dir => {
  const dirPath = path.join(shellDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ src/shell/${dir}/ directory does not exist`);
    allPassed = false;
  } else {
    console.log(`✅ src/shell/${dir}/ directory exists`);
  }
});

// Check required files
requiredFiles.forEach(file => {
  const filePath = path.join(shellDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ src/shell/${file} file does not exist`);
    allPassed = false;
  } else {
    console.log(`✅ src/shell/${file} file exists`);
  }
});

// Check shell index.ts content
const shellIndexPath = path.join(shellDir, 'index.ts');
if (fs.existsSync(shellIndexPath)) {
  const content = fs.readFileSync(shellIndexPath, 'utf8');
  if (content.includes('initializeShell') && content.includes('validateShell')) {
    console.log('✅ Shell index.ts has required functions');
  } else {
    console.error('❌ Shell index.ts missing required functions');
    allPassed = false;
  }
}

if (allPassed) {
  console.log('🎉 Shell directory structure validation passed!');
  process.exit(0);
} else {
  console.error('💥 Shell directory structure validation failed!');
  process.exit(1);
} 