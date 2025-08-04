#!/usr/bin/env node

/**
 * Accessibility Dry-Run Test
 * Validates accessibility hooks and utilities without running the app
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Running Accessibility Dry-Run Test...');

// Test configuration
const testConfig = {
  accessibilityHooks: [
    'useAccessibilityFocus',
    'useAccessibilityAnnouncement',
    'useAccessibilityAction',
    'useAccessibilityRole',
    'useAccessibilityState'
  ],
  accessibilityUtilities: [
    'getAccessibilityProps',
    'validateAccessibilityProps',
    'createAccessibilityEvent'
  ],
  requiredFiles: [
    'src-nextgen/hooks/useAccessibilityFocus.ts',
    'src-nextgen/hooks/useAccessibilityAnnouncement.ts',
    'src-nextgen/hooks/useAccessibilityAction.ts',
    'src-nextgen/hooks/useAccessibilityRole.ts',
    'src-nextgen/hooks/useAccessibilityState.ts',
    'src-nextgen/utils/accessibility.ts'
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

// Helper function to validate TypeScript syntax
function validateTypeScriptSyntax(filePath) {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
    
    // Basic TypeScript validation
    const hasExport = content.includes('export');
    const hasImport = content.includes('import');
    const hasFunction = content.includes('function') || content.includes('const');
    const hasTypeScript = content.includes(':') && (content.includes('interface') || content.includes('type'));
    
    return hasExport && (hasImport || hasFunction) && hasTypeScript;
  } catch (error) {
    return false;
  }
}

// Test 1: Check if accessibility hook files exist
console.log('\n📁 Checking accessibility hook files...');
testConfig.requiredFiles.forEach(file => {
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
testConfig.requiredFiles.forEach(file => {
  if (fileExists(file)) {
    if (validateTypeScriptSyntax(file)) {
      console.log(`✅ ${file} has valid TypeScript syntax`);
      results.passed++;
    } else {
      console.log(`❌ ${file} has invalid TypeScript syntax`);
      results.failed++;
      results.errors.push(`Invalid TypeScript syntax: ${file}`);
    }
  }
});

// Test 3: Check for accessibility imports in components
console.log('\n🔗 Checking accessibility imports...');
const srcDir = path.resolve(__dirname, '..', 'src-nextgen');
if (fs.existsSync(srcDir)) {
  const componentFiles = [];
  
  function findComponentFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findComponentFiles(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        componentFiles.push(filePath);
      }
    });
  }
  
  findComponentFiles(srcDir);
  
  let accessibilityImportsFound = 0;
  componentFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('useAccessibility') || content.includes('accessibilityProps')) {
        accessibilityImportsFound++;
        console.log(`✅ Accessibility imports found in ${path.relative(srcDir, file)}`);
      }
    } catch (error) {
      // Ignore read errors
    }
  });
  
  if (accessibilityImportsFound > 0) {
    console.log(`✅ Found ${accessibilityImportsFound} components with accessibility imports`);
    results.passed++;
  } else {
    console.log('⚠️  No accessibility imports found in components');
    results.failed++;
    results.errors.push('No accessibility imports found in components');
  }
}

// Test 4: Validate accessibility hook structure
console.log('\n🏗️  Validating accessibility hook structure...');
testConfig.accessibilityHooks.forEach(hookName => {
  const hookFile = `src-nextgen/hooks/${hookName}.ts`;
  if (fileExists(hookFile)) {
    try {
      const content = fs.readFileSync(path.resolve(__dirname, '..', hookFile), 'utf8');
      
      // Check for required hook patterns
      const hasUsePrefix = hookName.startsWith('use');
      const hasExport = content.includes('export');
      const hasFunction = content.includes('function') || content.includes('const');
      const hasReturn = content.includes('return');
      
      if (hasUsePrefix && hasExport && hasFunction && hasReturn) {
        console.log(`✅ ${hookName} has valid hook structure`);
        results.passed++;
      } else {
        console.log(`❌ ${hookName} has invalid hook structure`);
        results.failed++;
        results.errors.push(`Invalid hook structure: ${hookName}`);
      }
    } catch (error) {
      console.log(`❌ Error reading ${hookName}: ${error.message}`);
      results.failed++;
      results.errors.push(`Error reading ${hookName}: ${error.message}`);
    }
  } else {
    console.log(`❌ ${hookName} file not found`);
    results.failed++;
    results.errors.push(`Missing hook file: ${hookName}`);
  }
});

// Summary
console.log('\n📊 Accessibility Dry-Run Test Summary:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${results.passed + results.failed > 0 ? Math.round((results.passed / (results.passed + results.failed)) * 100) : 0}%`);

if (results.errors.length > 0) {
  console.log('\n🚨 Errors:');
  results.errors.forEach(error => console.log(`  - ${error}`));
}

// Exit with appropriate code
if (results.failed === 0) {
  console.log('\n🎉 All accessibility dry-run tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some accessibility dry-run tests failed. Please review the errors above.');
  process.exit(1);
} 