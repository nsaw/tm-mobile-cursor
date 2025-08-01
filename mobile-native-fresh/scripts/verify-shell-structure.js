#!/usr/bin/env node

/**
 * Shell Structure Validation Script
 * 
 * Verifies that the shell directory structure was created correctly
 * and contains all required directories and files.
 */

const fs = require('fs');
const path = require('path');

const SHELL_ROOT = path.join(__dirname, '..', 'src-nextgen', 'shell');
const REQUIRED_DIRS = ['wrappers', 'contracts', 'navigation', 'mounts', 'validation'];
const REQUIRED_FILES = ['index.ts', 'README.md'];

function validateShellStructure() {
  console.log('🔍 Validating shell directory structure...');
  
  // Check if shell root exists
  if (!fs.existsSync(SHELL_ROOT)) {
    console.error('❌ Shell root directory does not exist:', SHELL_ROOT);
    process.exit(1);
  }
  
  console.log('✅ Shell root directory exists');
  
  // Check required directories
  for (const dir of REQUIRED_DIRS) {
    const dirPath = path.join(SHELL_ROOT, dir);
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Required directory missing: ${dir}`);
      process.exit(1);
    }
    console.log(`✅ Directory exists: ${dir}`);
  }
  
  // Check required files
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(SHELL_ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`✅ File exists: ${file}`);
  }
  
  // Validate shell index.ts content
  const indexPath = path.join(SHELL_ROOT, 'index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (!indexContent.includes('SHELL_CONFIG')) {
    console.error('❌ Shell index.ts missing SHELL_CONFIG');
    process.exit(1);
  }
  
  if (!indexContent.includes('initializeShell')) {
    console.error('❌ Shell index.ts missing initializeShell function');
    process.exit(1);
  }
  
  console.log('✅ Shell index.ts content validated');
  
  console.log('🎉 Shell directory structure validation PASSED');
  process.exit(0);
}

validateShellStructure(); 