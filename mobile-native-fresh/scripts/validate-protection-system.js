#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛡️ Validating Protection System...');

// Check if protection system files exist
const protectionFiles = [
  'src-nextgen/shell/mounts/SacredViewMount.tsx',
  'src-nextgen/shell/mounts/SacredMountRegistry.ts',
  'src-nextgen/shell/mounts/useSacredMount.ts'
];

let allFilesExist = true;

protectionFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    
    // Check file content for key functionality
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (file.includes('SacredViewMount.tsx')) {
      if (content.includes('SacredViewMount') && content.includes('mountId')) {
        console.log(`✅ SacredViewMount component has required props`);
      } else {
        console.log(`❌ SacredViewMount component missing required functionality`);
        allFilesExist = false;
      }
    }
    
    if (file.includes('SacredMountRegistry.ts')) {
      if (content.includes('SacredMountRegistry') && content.includes('register')) {
        console.log(`✅ SacredMountRegistry has registration functionality`);
      } else {
        console.log(`❌ SacredMountRegistry missing registration functionality`);
        allFilesExist = false;
      }
    }
    
    if (file.includes('useSacredMount.ts')) {
      if (content.includes('useSacredMount') && content.includes('isSacredMount')) {
        console.log(`✅ useSacredMount hook has required functionality`);
      } else {
        console.log(`❌ useSacredMount hook missing required functionality`);
        allFilesExist = false;
      }
    }
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Check if pre-registered sacred mounts are defined
const registryPath = path.join(process.cwd(), 'src-nextgen/shell/mounts/SacredMountRegistry.ts');
if (fs.existsSync(registryPath)) {
  const registryContent = fs.readFileSync(registryPath, 'utf8');
  const expectedMounts = ['bottom-nav', 'fab', 'top-bar', 'modal-overlay'];
  
  expectedMounts.forEach(mount => {
    if (registryContent.includes(mount)) {
      console.log(`✅ Sacred mount '${mount}' is pre-registered`);
    } else {
      console.log(`❌ Sacred mount '${mount}' is not pre-registered`);
      allFilesExist = false;
    }
  });
}

if (allFilesExist) {
  console.log('✅ Protection System validation PASSED');
  process.exit(0);
} else {
  console.log('❌ Protection System validation FAILED');
  process.exit(1);
} 