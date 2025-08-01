#!/usr/bin/env node

/**
 * Dual-Mount System Validation Script
 * 
 * This script validates that the dual-mount system is working correctly
 * by checking both legacy and nextgen environments.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  legacyPath: 'THAWED-REFERENCE/src-reference',
  nextgenPath: 'src-nextgen',
  appTsxPath: 'App.tsx',
  environmentVar: 'EXPO_PUBLIC_USE_NEXTGEN'
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Check if a directory exists
 */
function checkDirectory(dirPath, description) {
  const fullPath = path.resolve(dirPath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}: ${fullPath}`);
    results.passed++;
    return true;
  } else {
    console.log(`❌ ${description}: ${fullPath} (NOT FOUND)`);
    results.failed++;
    results.errors.push(`${description} not found: ${fullPath}`);
    return false;
  }
}

/**
 * Check if a file exists
 */
function checkFile(filePath, description) {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${description}: ${fullPath}`);
    results.passed++;
    return true;
  } else {
    console.log(`❌ ${description}: ${fullPath} (NOT FOUND)`);
    results.failed++;
    results.errors.push(`${description} not found: ${fullPath}`);
    return false;
  }
}

/**
 * Check if App.tsx has dual-mount logic
 */
function checkDualMountLogic() {
  const appPath = path.resolve(CONFIG.appTsxPath);
  if (!fs.existsSync(appPath)) {
    console.log(`❌ App.tsx not found: ${appPath}`);
    results.failed++;
    results.errors.push('App.tsx not found');
    return false;
  }

  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check for dual-mount environment variable
  if (appContent.includes(CONFIG.environmentVar)) {
    console.log(`✅ Dual-mount environment variable found: ${CONFIG.environmentVar}`);
    results.passed++;
  } else {
    console.log(`❌ Dual-mount environment variable not found: ${CONFIG.environmentVar}`);
    results.failed++;
    results.errors.push(`Dual-mount environment variable not found: ${CONFIG.environmentVar}`);
  }

  // Check for USE_NEXTGEN logic
  if (appContent.includes('USE_NEXTGEN')) {
    console.log(`✅ USE_NEXTGEN logic found in App.tsx`);
    results.passed++;
  } else {
    console.log(`❌ USE_NEXTGEN logic not found in App.tsx`);
    results.failed++;
    results.errors.push('USE_NEXTGEN logic not found in App.tsx');
  }

  // Check for environment-based imports
  if (appContent.includes('require(') && appContent.includes('src-nextgen')) {
    console.log(`✅ NextGen imports found in App.tsx`);
    results.passed++;
  } else {
    console.log(`❌ NextGen imports not found in App.tsx`);
    results.failed++;
    results.errors.push('NextGen imports not found in App.tsx');
  }

  // Check for legacy imports
  if (appContent.includes('require(') && appContent.includes('THAWED-REFERENCE')) {
    console.log(`✅ Legacy imports found in App.tsx`);
    results.passed++;
  } else {
    console.log(`❌ Legacy imports not found in App.tsx`);
    results.failed++;
    results.errors.push('Legacy imports not found in App.tsx');
  }

  return true;
}

/**
 * Check TypeScript configuration
 */
function checkTypeScriptConfig() {
  const tsconfigPath = path.resolve('tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log(`❌ tsconfig.json not found: ${tsconfigPath}`);
    results.failed++;
    results.errors.push('tsconfig.json not found');
    return false;
  }

  const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
  const tsconfig = JSON.parse(tsconfigContent);

  // Check for src-nextgen in paths
  if (tsconfig.compilerOptions?.paths?.['@/*']?.includes('src-nextgen/*')) {
    console.log(`✅ src-nextgen path mapping found in tsconfig.json`);
    results.passed++;
  } else {
    console.log(`❌ src-nextgen path mapping not found in tsconfig.json`);
    results.failed++;
    results.errors.push('src-nextgen path mapping not found in tsconfig.json');
  }

  // Check for legacy path mapping
  if (tsconfig.compilerOptions?.paths?.['@legacy/*']?.includes('THAWED-REFERENCE/src-reference/*')) {
    console.log(`✅ Legacy path mapping found in tsconfig.json`);
    results.passed++;
  } else {
    console.log(`❌ Legacy path mapping not found in tsconfig.json`);
    results.failed++;
    results.errors.push('Legacy path mapping not found in tsconfig.json');
  }

  return true;
}

/**
 * Main validation function
 */
function validateDualMount() {
  console.log('🔍 Starting Dual-Mount System Validation...\n');

  // Check directory structure
  console.log('📁 Checking Directory Structure:');
  checkDirectory(CONFIG.legacyPath, 'Legacy source directory');
  checkDirectory(CONFIG.nextgenPath, 'NextGen source directory');
  
  // Check for key files in legacy
  console.log('\n📄 Checking Legacy Files:');
  checkFile(`${CONFIG.legacyPath}/components/AutoRoleView.tsx`, 'AutoRoleView component');
  checkFile(`${CONFIG.legacyPath}/theme/ThemeProvider.tsx`, 'ThemeProvider');
  checkFile(`${CONFIG.legacyPath}/navigation/AppNavigator.tsx`, 'AppNavigator');

  // Check for key files in nextgen
  console.log('\n📄 Checking NextGen Files:');
  checkFile(`${CONFIG.nextgenPath}/App.tsx`, 'NextGen App.tsx');
  checkFile(`${CONFIG.nextgenPath}/EXECUTIVE_SUMMARY.md`, 'NextGen Executive Summary');

  // Check App.tsx dual-mount logic
  console.log('\n🔧 Checking Dual-Mount Logic:');
  checkDualMountLogic();

  // Check TypeScript configuration
  console.log('\n⚙️ Checking TypeScript Configuration:');
  checkTypeScriptConfig();

  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.errors.length > 0) {
    console.log('\n🚨 Errors Found:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  // Exit with appropriate code
  if (results.failed > 0) {
    console.log('\n❌ Dual-mount validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Dual-mount validation PASSED');
    process.exit(0);
  }
}

// Run validation
validateDualMount(); 