#!/usr/bin/env node

/**
 * Environment-Specific Validation Script
 * 
 * This script validates that both legacy and nextgen environments
 * are working correctly and can be toggled between.
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

// Validation results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * Check if a file exists and is readable
 */
function checkFile(filePath, description) {
  const fullPath = path.resolve(filePath);
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        console.log(`✅ ${description}: ${fullPath}`);
        results.passed++;
        return true;
      } else {
        console.log(`❌ ${description}: ${fullPath} (not a file)`);
        results.failed++;
        results.errors.push(`${description} is not a file: ${fullPath}`);
        return false;
      }
    } else {
      console.log(`❌ ${description}: ${fullPath} (NOT FOUND)`);
      results.failed++;
      results.errors.push(`${description} not found: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${fullPath} (ERROR: ${error.message})`);
    results.failed++;
    results.errors.push(`${description} error: ${error.message}`);
    return false;
  }
}

/**
 * Check if a directory exists and is readable
 */
function checkDirectory(dirPath, description) {
  const fullPath = path.resolve(dirPath);
  try {
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        console.log(`✅ ${description}: ${fullPath}`);
        results.passed++;
        return true;
      } else {
        console.log(`❌ ${description}: ${fullPath} (not a directory)`);
        results.failed++;
        results.errors.push(`${description} is not a directory: ${fullPath}`);
        return false;
      }
    } else {
      console.log(`❌ ${description}: ${fullPath} (NOT FOUND)`);
      results.failed++;
      results.errors.push(`${description} not found: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: ${fullPath} (ERROR: ${error.message})`);
    results.failed++;
    results.errors.push(`${description} error: ${error.message}`);
    return false;
  }
}

/**
 * Check TypeScript compilation for a specific environment
 */
function checkTypeScriptCompilation(environment) {
  try {
    console.log(`🔧 Checking TypeScript compilation for ${environment}...`);
    
    // Set environment variable for compilation check
    const env = environment === 'nextgen' ? 'EXPO_PUBLIC_USE_NEXTGEN=true' : 'EXPO_PUBLIC_USE_NEXTGEN=false';
    
    // Run TypeScript check with environment variable
    execSync(`${env} npx tsc --noEmit --skipLibCheck`, { 
      stdio: 'pipe',
      timeout: 30000 
    });
    
    console.log(`✅ TypeScript compilation passed for ${environment}`);
    results.passed++;
    return true;
  } catch (error) {
    console.log(`❌ TypeScript compilation failed for ${environment}: ${error.message}`);
    results.failed++;
    results.errors.push(`TypeScript compilation failed for ${environment}: ${error.message}`);
    return false;
  }
}

/**
 * Check if environment-specific files are accessible
 */
function checkEnvironmentFiles(environment) {
  console.log(`\n📄 Checking ${environment} environment files:`);
  
  if (environment === 'legacy') {
    // Check legacy environment files
    checkFile(`${CONFIG.legacyPath}/components/AutoRoleView.tsx`, 'Legacy AutoRoleView');
    checkFile(`${CONFIG.legacyPath}/theme/ThemeProvider.tsx`, 'Legacy ThemeProvider');
    checkFile(`${CONFIG.legacyPath}/navigation/AppNavigator.tsx`, 'Legacy AppNavigator');
    checkFile(`${CONFIG.legacyPath}/features/home/screens/HomeScreen.tsx`, 'Legacy HomeScreen');
    checkFile(`${CONFIG.legacyPath}/features/auth/screens/SignIn.tsx`, 'Legacy SignIn');
  } else {
    // Check nextgen environment files
    checkFile(`${CONFIG.nextgenPath}/App.tsx`, 'NextGen App.tsx');
    checkFile(`${CONFIG.nextgenPath}/EXECUTIVE_SUMMARY.md`, 'NextGen Executive Summary');
    checkFile(`${CONFIG.nextgenPath}/PATCH_MANIFEST.json`, 'NextGen Patch Manifest');
    checkFile(`${CONFIG.nextgenPath}/ROADMAP.md`, 'NextGen Roadmap');
  }
}

/**
 * Check if environment can be toggled
 */
function checkEnvironmentToggle() {
  console.log('\n🔄 Checking environment toggle functionality:');
  
  const appPath = path.resolve(CONFIG.appTsxPath);
  if (!fs.existsSync(appPath)) {
    console.log(`❌ App.tsx not found for environment toggle check`);
    results.failed++;
    results.errors.push('App.tsx not found for environment toggle check');
    return false;
  }

  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Check for environment variable usage
  if (appContent.includes('EXPO_PUBLIC_USE_NEXTGEN')) {
    console.log(`✅ Environment variable EXPO_PUBLIC_USE_NEXTGEN found`);
    results.passed++;
  } else {
    console.log(`❌ Environment variable EXPO_PUBLIC_USE_NEXTGEN not found`);
    results.failed++;
    results.errors.push('Environment variable EXPO_PUBLIC_USE_NEXTGEN not found');
  }

  // Check for conditional logic
  if (appContent.includes('if (USE_NEXTGEN)')) {
    console.log(`✅ Conditional logic for environment toggle found`);
    results.passed++;
  } else {
    console.log(`❌ Conditional logic for environment toggle not found`);
    results.failed++;
    results.errors.push('Conditional logic for environment toggle not found');
  }

  // Check for both environment imports
  if (appContent.includes('src-nextgen') && appContent.includes('THAWED-REFERENCE')) {
    console.log(`✅ Both environment imports found`);
    results.passed++;
  } else {
    console.log(`❌ Both environment imports not found`);
    results.failed++;
    results.errors.push('Both environment imports not found');
  }

  return true;
}

/**
 * Check package.json for environment-specific scripts
 */
function checkPackageScripts() {
  console.log('\n📦 Checking package.json for environment scripts:');
  
  const packagePath = path.resolve('package.json');
  if (!fs.existsSync(packagePath)) {
    console.log(`❌ package.json not found`);
    results.failed++;
    results.errors.push('package.json not found');
    return false;
  }

  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);

  // Check for test scripts
  if (packageJson.scripts && packageJson.scripts['test:unit']) {
    console.log(`✅ Unit test script found: test:unit`);
    results.passed++;
  } else {
    console.log(`❌ Unit test script not found: test:unit`);
    results.failed++;
    results.errors.push('Unit test script not found: test:unit');
  }

  // Check for lint scripts
  if (packageJson.scripts && packageJson.scripts['lint:guard']) {
    console.log(`✅ Lint script found: lint:guard`);
    results.passed++;
  } else {
    console.log(`❌ Lint script not found: lint:guard`);
    results.failed++;
    results.errors.push('Lint script not found: lint:guard');
  }

  return true;
}

/**
 * Main validation function
 */
function validateEnvironmentSpecific() {
  console.log('🔍 Starting Environment-Specific Validation...\n');

  // Check directory structure
  console.log('📁 Checking Directory Structure:');
  checkDirectory(CONFIG.legacyPath, 'Legacy source directory');
  checkDirectory(CONFIG.nextgenPath, 'NextGen source directory');

  // Check legacy environment files
  checkEnvironmentFiles('legacy');

  // Check nextgen environment files
  checkEnvironmentFiles('nextgen');

  // Check environment toggle functionality
  checkEnvironmentToggle();

  // Check package.json scripts
  checkPackageScripts();

  // Check TypeScript compilation for both environments
  console.log('\n🔧 Checking TypeScript Compilation:');
  checkTypeScriptCompilation('legacy');
  checkTypeScriptCompilation('nextgen');

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
    console.log('\n❌ Environment-specific validation FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ Environment-specific validation PASSED');
    process.exit(0);
  }
}

// Run validation
validateEnvironmentSpecific(); 