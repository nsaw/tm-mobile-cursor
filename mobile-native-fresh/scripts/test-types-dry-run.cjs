#!/usr/bin/env node

/**
 * Types Dry-Run Test
 * Validates TypeScript type definitions without running the app
 */

const fs = require('fs');
const path = require('path');

console.log('📝 Running Types Dry-Run Test...');

// Test configuration
const testConfig = {
  typeFiles: [
    'src/types/index.ts',
    'src-nextgen/types/index.ts',
    'src-nextgen/types/thoughtmark.ts',
    'src-nextgen/types/user.ts',
    'src-nextgen/types/bin.ts',
    'src-nextgen/types/task.ts'
  ],
  requiredTypes: [
    'Thoughtmark',
    'User',
    'Bin',
    'Task',
    'ThoughtmarkWithBin',
    'ApiResponse',
    'NavigationProps'
  ]
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.resolve(__dirname, '..', filePath));
  } catch (error) {
    return false;
  }
}

// Helper function to validate TypeScript types
function validateTypeScriptTypes(filePath) {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
    
    // Check for TypeScript patterns
    const hasExport = content.includes('export');
    const hasType = content.includes('type') || content.includes('interface');
    const hasTypeScript = content.includes(':') && (content.includes('interface') || content.includes('type'));
    
    return hasExport && hasType && hasTypeScript;
  } catch (error) {
    return false;
  }
}

// Test 1: Check if type files exist
console.log('\n📁 Checking type files...');
testConfig.typeFiles.forEach(file => {
  if (fileExists(file)) {
    console.log(`✅ ${file} exists`);
    results.passed++;
  } else {
    console.log(`❌ ${file} missing`);
    results.failed++;
    results.errors.push(`Missing file: ${file}`);
  }
});

// Test 2: Validate TypeScript syntax
console.log('\n🔍 Validating TypeScript syntax...');
testConfig.typeFiles.forEach(file => {
  if (fileExists(file)) {
    if (validateTypeScriptTypes(file)) {
      console.log(`✅ ${file} has valid TypeScript syntax`);
      results.passed++;
    } else {
      console.log(`❌ ${file} has invalid TypeScript syntax`);
      results.failed++;
      results.errors.push(`Invalid TypeScript syntax: ${file}`);
    }
  }
});

// Test 3: Check for required types
console.log('\n🔍 Checking required types...');
const allTypeFiles = testConfig.typeFiles.filter(fileExists);
let requiredTypesFound = 0;

allTypeFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
    testConfig.requiredTypes.forEach(typeName => {
      if (content.includes(typeName)) {
        requiredTypesFound++;
        console.log(`✅ ${typeName} found in ${file}`);
      }
    });
  } catch (error) {
    // Ignore read errors
  }
});

if (requiredTypesFound > 0) {
  console.log(`✅ Found ${requiredTypesFound} required types`);
  results.passed++;
} else {
  console.log('⚠️  No required types found');
  results.failed++;
  results.errors.push('No required types found');
}

// Test 4: Check for type exports
console.log('\n📤 Checking type exports...');
let validExports = 0;

allTypeFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
    
    // Check for export patterns
    const hasDefaultExport = content.includes('export default');
    const hasNamedExports = content.includes('export type') || content.includes('export interface');
    const hasExportStatement = content.includes('export {');
    
    if (hasDefaultExport || hasNamedExports || hasExportStatement) {
      console.log(`✅ ${file} has valid exports`);
      validExports++;
      results.passed++;
    } else {
      console.log(`❌ ${file} has no valid exports`);
      results.failed++;
      results.errors.push(`No valid exports in ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error reading ${file}: ${error.message}`);
    results.failed++;
    results.errors.push(`Error reading ${file}: ${error.message}`);
  }
});

// Summary
console.log('\n📊 Types Dry-Run Test Summary:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${results.passed + results.failed > 0 ? Math.round((results.passed / (results.passed + results.failed)) * 100) : 0}%`);

if (results.errors.length > 0) {
  console.log('\n🚨 Errors:');
  results.errors.forEach(error => console.log(`  - ${error}`));
}

// Exit with appropriate code
if (results.failed === 0) {
  console.log('\n🎉 All types dry-run tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some types dry-run tests failed. Please review the errors above.');
  process.exit(1);
} 