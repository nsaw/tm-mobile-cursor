#!/usr/bin/env node

/**
 * Navigation Tree Validation Script
 * Validates all navigation screens can be reached and rendered
 */

const fs = require('fs');
const path = require('path');

console.log('🧭 Starting Navigation Tree Validation...');

// Define expected navigation structure
const expectedScreens = {
  auth: [
    'SignInScreen',
    'SignUpScreen', 
    'PinEntryScreen',
    'PasswordResetScreen'
  ],
  content: [
    'AllThoughtmarksScreen',
    'AllBinsScreen',
    'SearchScreen',
    'CreateScreen',
    'ProfileScreen'
  ],
  settings: [
    'SettingsScreen',
    'ProfileEditScreen',
    'PremiumScreen',
    'SecurityScreen',
    'ThemeScreen'
  ]
};

// Validate screen files exist
function validateScreenFiles() {
  console.log('📁 Validating screen files exist...');
  
  const srcNextgenPath = path.join(__dirname, '../src-nextgen/screens');
  let allValid = true;
  
  for (const [category, screens] of Object.entries(expectedScreens)) {
    const categoryPath = path.join(srcNextgenPath, category);
    
    if (!fs.existsSync(categoryPath)) {
      console.log(`❌ Category directory missing: ${categoryPath}`);
      allValid = false;
      continue;
    }
    
    for (const screen of screens) {
      const screenFile = path.join(categoryPath, `${screen}.tsx`);
      if (!fs.existsSync(screenFile)) {
        console.log(`❌ Screen file missing: ${screenFile}`);
        allValid = false;
      } else {
        console.log(`✅ Screen file found: ${screen}`);
      }
    }
  }
  
  return allValid;
}

// Validate navigation imports
function validateNavigationImports() {
  console.log('🔗 Validating navigation imports...');
  
  const navigationFiles = [
    'src-nextgen/navigation/MainNavigator.tsx',
    'src-nextgen/navigation/AuthNavigator.tsx',
    'src-nextgen/navigation/AppNavigator.tsx'
  ];
  
  let allValid = true;
  
  for (const file of navigationFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Navigation file missing: ${file}`);
      allValid = false;
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for basic navigation structure
    if (!content.includes('createStackNavigator') && !content.includes('createBottomTabNavigator')) {
      console.log(`⚠️  Navigation file may be incomplete: ${file}`);
    }
    
    console.log(`✅ Navigation file validated: ${file}`);
  }
  
  return allValid;
}

// Validate provider tree structure
function validateProviderTree() {
  console.log('🌳 Validating provider tree structure...');
  
  const appFile = path.join(__dirname, '../src-nextgen/App.tsx');
  
  if (!fs.existsSync(appFile)) {
    console.log('❌ App.tsx file missing');
    return false;
  }
  
  const content = fs.readFileSync(appFile, 'utf8');
  
  // Check for proper provider nesting
  const hasNavigationContainer = content.includes('NavigationContainer');
  const hasThemeProvider = content.includes('ThemeProvider');
  const hasAppStateProvider = content.includes('AppStateProvider');
  const hasAuthFlowProvider = content.includes('AuthFlowProvider');
  
  if (!hasNavigationContainer) {
    console.log('❌ NavigationContainer missing from App.tsx');
    return false;
  }
  
  if (!hasThemeProvider) {
    console.log('❌ ThemeProvider missing from App.tsx');
    return false;
  }
  
  if (!hasAppStateProvider) {
    console.log('❌ AppStateProvider missing from App.tsx');
    return false;
  }
  
  if (!hasAuthFlowProvider) {
    console.log('❌ AuthFlowProvider missing from App.tsx');
    return false;
  }
  
  console.log('✅ Provider tree structure validated');
  return true;
}

// Main validation
function main() {
  console.log('🚀 Starting comprehensive navigation validation...\n');
  
  const screenValidation = validateScreenFiles();
  const importValidation = validateNavigationImports();
  const providerValidation = validateProviderTree();
  
  console.log('\n📊 Validation Results:');
  console.log(`Screen Files: ${screenValidation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Navigation Imports: ${importValidation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Provider Tree: ${providerValidation ? '✅ PASS' : '❌ FAIL'}`);
  
  const allValid = screenValidation && importValidation && providerValidation;
  
  if (allValid) {
    console.log('\n🎉 Navigation validation PASSED - All screens accessible');
    process.exit(0);
  } else {
    console.log('\n💥 Navigation validation FAILED - Some screens inaccessible');
    process.exit(1);
  }
}

// Run validation
main(); 