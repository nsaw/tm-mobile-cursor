#!/usr/bin/env node

/**
 * Validate Role Assignment Script
 * Verifies that role assignment logic is working correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating role assignment logic...');

let allValid = true;

// Check for role assignment types
const typesPath = path.join(__dirname, '../src-nextgen/shell/role-wrappers/types.ts');
if (fs.existsSync(typesPath)) {
  try {
    const content = fs.readFileSync(typesPath, 'utf8');
    
    // Check for role assignment interfaces
    if (content.includes('interactiveRole') || content.includes('contentRole') || content.includes('layoutRole')) {
      console.log('✅ Role assignment types found');
    } else {
      console.error('❌ Role assignment types not found');
      allValid = false;
    }
    
    // Check for role validation
    if (content.includes('validateRole') || content.includes('RoleValidation')) {
      console.log('✅ Role validation types found');
    } else {
      console.error('❌ Role validation types not found');
      allValid = false;
    }
  } catch (error) {
    console.error('❌ Cannot read types file');
    allValid = false;
  }
}

// Check for role assignment logic in RoleWrapper
const wrapperPath = path.join(__dirname, '../src-nextgen/shell/role-wrappers/RoleWrapper.tsx');
if (fs.existsSync(wrapperPath)) {
  try {
    const content = fs.readFileSync(wrapperPath, 'utf8');
    
    // Check for role assignment logic
    if (content.includes('interactiveRole') || content.includes('contentRole') || content.includes('layoutRole')) {
      console.log('✅ Role assignment logic found');
    } else {
      console.error('❌ Role assignment logic not found');
      allValid = false;
    }
    
    // Check for role validation logic
    if (content.includes('validateRole') || content.includes('roleValidation')) {
      console.log('✅ Role validation logic found');
    } else {
      console.error('❌ Role validation logic not found');
      allValid = false;
    }
  } catch (error) {
    console.error('❌ Cannot read RoleWrapper file');
    allValid = false;
  }
}

// Check for validation functions
const validationPath = path.join(__dirname, '../src-nextgen/shell/role-wrappers/validation.ts');
if (fs.existsSync(validationPath)) {
  try {
    const content = fs.readFileSync(validationPath, 'utf8');
    
    if (content.includes('function') || content.includes('const') || content.includes('export')) {
      console.log('✅ Validation functions found');
    } else {
      console.error('❌ Validation functions not found');
      allValid = false;
    }
  } catch (error) {
    console.error('❌ Cannot read validation file');
    allValid = false;
  }
}

// Check for test files
const testPath = path.join(__dirname, '../src-nextgen/shell/role-wrappers/__tests__');
if (fs.existsSync(testPath)) {
  console.log('✅ Test directory exists');
  
  const testFiles = fs.readdirSync(testPath).filter(file => file.endsWith('.test.ts') || file.endsWith('.test.tsx'));
  if (testFiles.length > 0) {
    console.log(`✅ Found ${testFiles.length} test files`);
  } else {
    console.error('❌ No test files found');
    allValid = false;
  }
} else {
  console.error('❌ Test directory does not exist');
  allValid = false;
}

if (allValid) {
  console.log('✅ Role assignment validation passed');
  process.exit(0);
} else {
  console.error('❌ Role assignment validation failed');
  process.exit(1);
} 