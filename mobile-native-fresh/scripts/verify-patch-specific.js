#!/usr/bin/env node

/**
 * Patch-Specific Validation Script
 * 
 * This script provides a framework for patch-specific validation.
 * It can be customized for each patch by setting environment variables
 * or command line arguments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  legacyPath: 'THAWED-REFERENCE/src-reference',
  nextgenPath: 'src-nextgen',
  appTsxPath: 'App.tsx'
};

// Get patch-specific configuration from environment
const PATCH_CONFIG = {
  patchName: process.env.PATCH_NAME || 'unknown',
  patchType: process.env.PATCH_TYPE || 'unknown', // 'infrastructure', 'component', 'system'
  targetPath: process.env.TARGET_PATH || '',
  validationFiles: process.env.VALIDATION_FILES ? process.env.VALIDATION_FILES.split(',') : [],
  rollbackFiles: process.env.ROLLBACK_FILES ? process.env.ROLLBACK_FILES.split(',') : []
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Log validation result
 */
function logResult(success, message) {
  if (success) {
    console.log(`✅ ${message}`);
    results.passed++;
  } else {
    console.log(`❌ ${message}`);
    results.failed++;
    results.errors.push(message);
  }
}

/**
 * Check if a file exists
 */
function checkFile(filePath, description) {
  const fullPath = path.resolve(filePath);
  const exists = fs.existsSync(fullPath);
  logResult(exists, `${description}: ${fullPath}`);
  return exists;
}

/**
 * Check if a directory exists
 */
function checkDirectory(dirPath, description) {
  const fullPath = path.resolve(dirPath);
  const exists = fs.existsSync(fullPath);
  logResult(exists, `${description}: ${fullPath}`);
  return exists;
}

/**
 * Check if a file contains specific content
 */
function checkFileContent(filePath, content, description) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      logResult(false, `${description}: File not found ${fullPath}`);
      return false;
    }

    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const contains = fileContent.includes(content);
    logResult(contains, `${description}: Contains "${content}"`);
    return contains;
  } catch (error) {
    logResult(false, `${description}: Error reading file - ${error.message}`);
    return false;
  }
}

/**
 * Check TypeScript compilation
 */
function checkTypeScriptCompilation() {
  try {
    console.log('🔧 Checking TypeScript compilation...');
    execSync('npx tsc --noEmit --skipLibCheck', { 
      stdio: 'pipe',
      timeout: 30000 
    });
    logResult(true, 'TypeScript compilation passed');
    return true;
  } catch (error) {
    logResult(false, `TypeScript compilation failed: ${error.message}`);
    return false;
  }
}

/**
 * Check ESLint validation
 */
function checkESLintValidation() {
  try {
    console.log('🔍 Checking ESLint validation...');
    execSync('npx eslint . --ext .ts,.tsx --max-warnings=0', { 
      stdio: 'pipe',
      timeout: 30000 
    });
    logResult(true, 'ESLint validation passed');
    return true;
  } catch (error) {
    logResult(false, `ESLint validation failed: ${error.message}`);
    return false;
  }
}

/**
 * Check unit tests
 */
function checkUnitTests() {
  try {
    console.log('🧪 Checking unit tests...');
    execSync('yarn test:unit --watchAll=false', { 
      stdio: 'pipe',
      timeout: 60000 
    });
    logResult(true, 'Unit tests passed');
    return true;
  } catch (error) {
    logResult(false, `Unit tests failed: ${error.message}`);
    return false;
  }
}

/**
 * Validate infrastructure patches
 */
function validateInfrastructurePatch() {
  console.log('🏗️ Validating infrastructure patch...');
  
  // Check shell directory structure
  if (PATCH_CONFIG.targetPath.includes('shell')) {
    checkDirectory('src-nextgen/shell', 'Shell directory');
    checkDirectory('src-nextgen/shell/components', 'Shell components directory');
    checkDirectory('src-nextgen/shell/layout', 'Shell layout directory');
    checkDirectory('src-nextgen/shell/navigation', 'Shell navigation directory');
  }

  // Check role wrappers
  if (PATCH_CONFIG.targetPath.includes('role')) {
    checkFile('src-nextgen/shell/components/RoleWrapper.tsx', 'RoleWrapper component');
    checkFileContent('src-nextgen/shell/components/RoleWrapper.tsx', 'interface RoleWrapperProps', 'RoleWrapper interface');
  }

  // Check layout contracts
  if (PATCH_CONFIG.targetPath.includes('layout')) {
    checkFile('src-nextgen/shell/layout/LayoutContracts.ts', 'Layout contracts');
    checkFileContent('src-nextgen/shell/layout/LayoutContracts.ts', 'interface LayoutContract', 'Layout contract interface');
  }

  // Check navigation definitions
  if (PATCH_CONFIG.targetPath.includes('navigation')) {
    checkFile('src-nextgen/shell/navigation/NavigationDefinitions.ts', 'Navigation definitions');
    checkFileContent('src-nextgen/shell/navigation/NavigationDefinitions.ts', 'interface NavigationRoute', 'Navigation route interface');
  }
}

/**
 * Validate component migration patches
 */
function validateComponentMigrationPatch() {
  console.log('🧩 Validating component migration patch...');
  
  const componentName = PATCH_CONFIG.patchName.match(/patch-v\d+\.\d+\.\d+\(P\d+\.\d+\.\d+\)_(\w+)-migration/)?.[1];
  
  if (componentName) {
    // Check if component exists in nextgen
    checkFile(`src-nextgen/components/${componentName}.tsx`, `${componentName} component in nextgen`);
    
    // Check if component exists in legacy
    checkFile(`THAWED-REFERENCE/src-reference/components/ui/${componentName}.tsx`, `${componentName} component in legacy`);
    
    // Check for role assignment
    checkFileContent(`src-nextgen/components/${componentName}.tsx`, 'interactiveRole', 'Interactive role assignment');
    checkFileContent(`src-nextgen/components/${componentName}.tsx`, 'contentRole', 'Content role assignment');
    checkFileContent(`src-nextgen/components/${componentName}.tsx`, 'layoutRole', 'Layout role assignment');
  }
}

/**
 * Validate system patches
 */
function validateSystemPatch() {
  console.log('⚙️ Validating system patch...');
  
  // Check sacred view mounts
  if (PATCH_CONFIG.targetPath.includes('sacred')) {
    checkFile('src-nextgen/shell/SacredViewMounts.ts', 'Sacred view mounts');
    checkFileContent('src-nextgen/shell/SacredViewMounts.ts', 'interface SacredMount', 'Sacred mount interface');
  }

  // Check patch runner automation
  if (PATCH_CONFIG.targetPath.includes('patch-runner')) {
    checkFile('src-nextgen/shell/PatchRunner.ts', 'Patch runner');
    checkFileContent('src-nextgen/shell/PatchRunner.ts', 'interface PatchConfig', 'Patch config interface');
  }
}

/**
 * Validate specific files from environment
 */
function validateSpecificFiles() {
  if (PATCH_CONFIG.validationFiles.length > 0) {
    console.log('📄 Validating specific files...');
    PATCH_CONFIG.validationFiles.forEach(filePath => {
      checkFile(filePath.trim(), `Specific file: ${filePath}`);
    });
  }
}

/**
 * Main validation function
 */
function validatePatchSpecific() {
  console.log(`🔍 Starting Patch-Specific Validation for ${PATCH_CONFIG.patchName}...\n`);
  console.log(`📋 Patch Type: ${PATCH_CONFIG.patchType}`);
  console.log(`🎯 Target Path: ${PATCH_CONFIG.targetPath}\n`);

  // Basic validation
  console.log('🔧 Basic Validation:');
  checkTypeScriptCompilation();
  checkESLintValidation();
  checkUnitTests();

  // Patch-specific validation
  switch (PATCH_CONFIG.patchType) {
    case 'infrastructure':
      validateInfrastructurePatch();
      break;
    case 'component':
      validateComponentMigrationPatch();
      break;
    case 'system':
      validateSystemPatch();
      break;
    default:
      console.log('⚠️ Unknown patch type, skipping patch-specific validation');
  }

  // Validate specific files
  validateSpecificFiles();

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
    console.log('\n❌ Patch-specific validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Patch-specific validation PASSED');
    process.exit(0);
  }
}

// Run validation
validatePatchSpecific(); 