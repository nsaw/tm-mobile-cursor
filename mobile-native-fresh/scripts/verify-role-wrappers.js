#!/usr/bin/env node

/**
 * Verify Role Wrappers Script
 * Validates that role-based wrappers have been properly implemented
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying role-based wrappers...');

const roleWrappersPath = path.join(__dirname, '../src-nextgen/shell/role-wrappers');
const requiredFiles = [
  'index.ts',
  'RoleWrapper.tsx',
  'types.ts',
  'validation.ts'
];

let allValid = true;

// Check if role-wrappers directory exists
if (!fs.existsSync(roleWrappersPath)) {
  console.error('❌ Role wrappers directory does not exist');
  allValid = false;
} else {
  console.log('✅ Role wrappers directory exists');
}

// Check required files
for (const file of requiredFiles) {
  const filePath = path.join(roleWrappersPath, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Required file missing: ${file}`);
    allValid = false;
  } else {
    console.log(`✅ File exists: ${file}`);
    
    // Check file content for basic structure
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length === 0) {
        console.error(`❌ File is empty: ${file}`);
        allValid = false;
      } else {
        console.log(`✅ File has content: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Cannot read file: ${file}`);
      allValid = false;
    }
  }
}

// Check for TypeScript interfaces
const typesPath = path.join(roleWrappersPath, 'types.ts');
if (fs.existsSync(typesPath)) {
  try {
    const content = fs.readFileSync(typesPath, 'utf8');
    if (content.includes('interface') || content.includes('type')) {
      console.log('✅ TypeScript interfaces found');
    } else {
      console.error('❌ No TypeScript interfaces found');
      allValid = false;
    }
  } catch (error) {
    console.error('❌ Cannot read types file');
    allValid = false;
  }
}

// Check for React component structure
const wrapperPath = path.join(roleWrappersPath, 'RoleWrapper.tsx');
if (fs.existsSync(wrapperPath)) {
  try {
    const content = fs.readFileSync(wrapperPath, 'utf8');
    if (content.includes('React') && content.includes('export')) {
      console.log('✅ React component structure found');
    } else {
      console.error('❌ React component structure not found');
      allValid = false;
    }
  } catch (error) {
    console.error('❌ Cannot read RoleWrapper file');
    allValid = false;
  }
}

if (allValid) {
  console.log('✅ Role wrappers validation passed');
  process.exit(0);
} else {
  console.error('❌ Role wrappers validation failed');
  process.exit(1);
} 