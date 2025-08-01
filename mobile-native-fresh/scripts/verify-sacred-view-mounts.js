#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Sacred View Mount System...');

// Check if sacred mount files exist
const sacredMountFiles = [
  'src-nextgen/shell/mounts/SacredViewMount.tsx',
  'src-nextgen/shell/mounts/SacredMountRegistry.ts',
  'src-nextgen/shell/mounts/useSacredMount.ts',
  'src-nextgen/shell/mounts/index.ts'
];

let allFilesExist = true;

sacredMountFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if shell directory structure is correct
const shellDirs = [
  'src-nextgen/shell',
  'src-nextgen/shell/mounts',
  'src-nextgen/shell/wrappers',
  'src-nextgen/shell/contracts',
  'src-nextgen/shell/navigation',
  'src-nextgen/shell/validation'
];

shellDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`❌ ${dir} directory missing`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('✅ Sacred View Mount System verification PASSED');
  process.exit(0);
} else {
  console.log('❌ Sacred View Mount System verification FAILED');
  process.exit(1);
} 