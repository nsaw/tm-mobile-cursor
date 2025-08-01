#!/usr/bin/env node

/**
 * Shell Permissions Validation Script
 * 
 * Verifies that all shell scripts have proper execute permissions.
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname);

function validateShellPermissions() {
  console.log('🔍 Validating shell script permissions...');
  
  // Get all .sh files in scripts directory
  const scriptFiles = fs.readdirSync(SCRIPTS_DIR)
    .filter(file => file.endsWith('.sh'))
    .map(file => path.join(SCRIPTS_DIR, file));
  
  if (scriptFiles.length === 0) {
    console.log('ℹ️  No shell scripts found in scripts directory');
    process.exit(0);
  }
  
  let allValid = true;
  
  for (const scriptPath of scriptFiles) {
    const stats = fs.statSync(scriptPath);
    const isExecutable = (stats.mode & fs.constants.S_IXUSR) !== 0;
    
    if (!isExecutable) {
      console.error(`❌ Script not executable: ${path.basename(scriptPath)}`);
      allValid = false;
    } else {
      console.log(`✅ Script executable: ${path.basename(scriptPath)}`);
    }
  }
  
  if (!allValid) {
    console.error('❌ Some shell scripts are not executable');
    process.exit(1);
  }
  
  console.log('🎉 All shell script permissions validated');
  process.exit(0);
}

validateShellPermissions(); 