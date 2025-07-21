#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating shell directory permissions...');

const shellDir = path.join(__dirname, '../src/shell');

function checkPermissions(dirPath) {
  try {
    const stats = fs.statSync(dirPath);
    const isReadable = (stats.mode & fs.constants.R_OK) !== 0;
    const isWritable = (stats.mode & fs.constants.W_OK) !== 0;
    const isExecutable = (stats.mode & fs.constants.X_OK) !== 0;
    
    // For directories, we need execute permission to access
    // For files, we need read permission
    const hasRequiredPermissions = stats.isDirectory() ? 
      (isReadable && isExecutable) : isReadable;
    
    return {
      readable: isReadable,
      writable: isWritable,
      executable: isExecutable,
      mode: stats.mode.toString(8),
      hasRequiredPermissions
    };
  } catch (error) {
    return null;
  }
}

let allPassed = true;

// Check shell directory permissions
const shellPerms = checkPermissions(shellDir);
if (shellPerms) {
  console.log(`✅ Shell directory permissions: ${shellPerms.mode} (r:${shellPerms.readable}, w:${shellPerms.writable}, x:${shellPerms.executable})`);
  
  if (!shellPerms.hasRequiredPermissions) {
    console.error('❌ Shell directory does not have required permissions');
    allPassed = false;
  }
} else {
  console.error('❌ Cannot access shell directory');
  allPassed = false;
}

// Check subdirectory permissions
const subdirs = ['components', 'layouts', 'navigation', 'roles', 'types', 'utils'];
subdirs.forEach(dir => {
  const dirPath = path.join(shellDir, dir);
  const perms = checkPermissions(dirPath);
  
  if (perms) {
    console.log(`✅ ${dir}/ permissions: ${perms.mode} (r:${perms.readable}, w:${perms.writable}, x:${perms.executable})`);
    
    if (!perms.hasRequiredPermissions) {
      console.error(`❌ ${dir}/ directory does not have required permissions`);
      allPassed = false;
    }
  } else {
    console.error(`❌ Cannot access ${dir}/ directory`);
    allPassed = false;
  }
});

// Check file permissions
const files = ['index.ts', 'components/index.ts', 'layouts/index.ts', 'navigation/index.ts', 'roles/index.ts', 'types/index.ts', 'utils/index.ts'];
files.forEach(file => {
  const filePath = path.join(shellDir, file);
  const perms = checkPermissions(filePath);
  
  if (perms) {
    console.log(`✅ ${file} permissions: ${perms.mode} (r:${perms.readable}, w:${perms.writable})`);
    
    if (!perms.hasRequiredPermissions) {
      console.error(`❌ ${file} does not have required permissions`);
      allPassed = false;
    }
  } else {
    console.error(`❌ Cannot access ${file}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('🎉 Shell permissions validation passed!');
  process.exit(0);
} else {
  console.error('💥 Shell permissions validation failed!');
  process.exit(1);
} 