#!/usr/bin/env node

/**
 * Validate Shell Permissions Script
 * Checks shell directory permissions and ensures proper access
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating shell directory permissions...');

const shellPath = path.join(__dirname, '../src-nextgen/shell');

let allValid = true;

// Check if shell directory exists and is readable
if (!fs.existsSync(shellPath)) {
  console.error('❌ Shell directory does not exist');
  allValid = false;
} else {
  try {
    fs.accessSync(shellPath, fs.constants.R_OK);
    console.log('✅ Shell directory is readable');
  } catch (error) {
    console.error('❌ Shell directory is not readable');
    allValid = false;
  }
}

// Check if shell directory is writable
try {
  fs.accessSync(shellPath, fs.constants.W_OK);
  console.log('✅ Shell directory is writable');
} catch (error) {
  console.error('❌ Shell directory is not writable');
  allValid = false;
}

// Check if shell directory is executable
try {
  fs.accessSync(shellPath, fs.constants.X_OK);
  console.log('✅ Shell directory is executable');
} catch (error) {
  console.error('❌ Shell directory is not executable');
  allValid = false;
}

// Check subdirectory permissions
const subdirs = ['role-wrappers', 'layout-contracts', 'navigation-definitions', 'sacred-view-mounts'];
for (const subdir of subdirs) {
  const subdirPath = path.join(shellPath, subdir);
  if (fs.existsSync(subdirPath)) {
    try {
      fs.accessSync(subdirPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`✅ Subdirectory permissions valid: ${subdir}`);
    } catch (error) {
      console.error(`❌ Subdirectory permissions invalid: ${subdir}`);
      allValid = false;
    }
  }
}

// Check file permissions
const files = ['index.ts', 'types.ts', 'validation.ts'];
for (const file of files) {
  const filePath = path.join(shellPath, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`✅ File permissions valid: ${file}`);
    } catch (error) {
      console.error(`❌ File permissions invalid: ${file}`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log('✅ Shell permissions validation passed');
  process.exit(0);
} else {
  console.error('❌ Shell permissions validation failed');
  process.exit(1);
} 