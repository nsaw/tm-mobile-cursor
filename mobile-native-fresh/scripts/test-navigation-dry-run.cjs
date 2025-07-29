#!/usr/bin/env node

/**
 * Navigation Dry-Run Test
 * Validates navigation structure and routing without running the app
 */

const fs = require('fs');
const path = require('path');

console.log('🧭 Running Navigation Dry-Run Test...');

// Test configuration
const testConfig = {
  navigationFiles: [
    'src/navigation/AppNavigator.tsx',
    'src/navigation/routes.ts',
    'src/navigation/types.ts',
    'src-nextgen/navigation/AppNavigator.tsx',
    'src-nextgen/navigation/routes.ts',
    'src-nextgen/navigation/types.ts'
  ],
  requiredScreens: [
    'DashboardScreen',
    'HomeScreen',
    'SearchScreen',
    'SettingsScreen',
    'AllThoughtmarksScreen',
    'ThoughtmarkDetailScreen'
  ],
  navigationHooks: [
    'useNavigation',
    'useRoute',
    'useFocusEffect'
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

// Helper function to validate navigation structure
function validateNavigationStructure(filePath) {
  try {
    const content = fs.readFileSync(path.resolve(__dirname, '..', filePath), 'utf8');
    
    // Check for navigation patterns
    const hasNavigationImport = content.includes('@react-navigation');
    const hasStackNavigator = content.includes('Stack.Navigator') || content.includes('createStackNavigator');
    const hasTabNavigator = content.includes('Tab.Navigator') || content.includes('createBottomTabNavigator');
    const hasScreen = content.includes('Screen');
    
    return hasNavigationImport && (hasStackNavigator || hasTabNavigator) && hasScreen;
  } catch (error) {
    return false;
  }
}

// Test 1: Check if navigation files exist
console.log('\n📁 Checking navigation files...');
testConfig.navigationFiles.forEach(file => {
  if (fileExists(file)) {
    console.log(`✅ ${file} exists`);
    results.passed++;
  } else {
    console.log(`❌ ${file} missing`);
    results.failed++;
    results.errors.push(`Missing file: ${file}`);
  }
});

// Test 2: Validate navigation structure
console.log('\n🏗️  Validating navigation structure...');
testConfig.navigationFiles.forEach(file => {
  if (fileExists(file)) {
    if (validateNavigationStructure(file)) {
      console.log(`✅ ${file} has valid navigation structure`);
      results.passed++;
    } else {
      console.log(`❌ ${file} has invalid navigation structure`);
      results.failed++;
      results.errors.push(`Invalid navigation structure: ${file}`);
    }
  }
});

// Test 3: Check for required screens
console.log('\n🖥️  Checking required screens...');
const srcDir = path.resolve(__dirname, '..', 'src');
const srcNextgenDir = path.resolve(__dirname, '..', 'src-nextgen');

function findScreenFiles(dir) {
  const screenFiles = [];
  if (!fs.existsSync(dir)) return screenFiles;
  
  function walkDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('Screen.tsx') || file.endsWith('Screen.ts')) {
        screenFiles.push(filePath);
      }
    });
  }
  
  walkDir(dir);
  return screenFiles;
}

const legacyScreens = findScreenFiles(srcDir);
const nextgenScreens = findScreenFiles(srcNextgenDir);

console.log(`✅ Found ${legacyScreens.length} screens in legacy src/`);
console.log(`✅ Found ${nextgenScreens.length} screens in src-nextgen/`);

if (legacyScreens.length > 0 || nextgenScreens.length > 0) {
  results.passed++;
} else {
  results.failed++;
  results.errors.push('No screen files found');
}

// Test 4: Check for navigation hooks usage
console.log('\n🔗 Checking navigation hooks usage...');
const allScreenFiles = [...legacyScreens, ...nextgenScreens];
let navigationHooksFound = 0;

allScreenFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    testConfig.navigationHooks.forEach(hook => {
      if (content.includes(hook)) {
        navigationHooksFound++;
        console.log(`✅ ${hook} found in ${path.relative(path.resolve(__dirname, '..'), file)}`);
      }
    });
  } catch (error) {
    // Ignore read errors
  }
});

if (navigationHooksFound > 0) {
  console.log(`✅ Found ${navigationHooksFound} navigation hook usages`);
  results.passed++;
} else {
  console.log('⚠️  No navigation hooks found in screens');
  results.failed++;
  results.errors.push('No navigation hooks found in screens');
}

// Test 5: Validate route definitions
console.log('\n🗺️  Validating route definitions...');
const routeFiles = ['src/navigation/routes.ts', 'src-nextgen/navigation/routes.ts'];
let validRouteFiles = 0;

routeFiles.forEach(file => {
  if (fileExists(file)) {
    try {
      const content = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
      
      // Check for route patterns
      const hasRouteExport = content.includes('export');
      const hasRouteType = content.includes('type') || content.includes('interface');
      const hasRouteName = content.includes('name:');
      
      if (hasRouteExport && hasRouteType && hasRouteName) {
        console.log(`✅ ${file} has valid route definitions`);
        validRouteFiles++;
        results.passed++;
      } else {
        console.log(`❌ ${file} has invalid route definitions`);
        results.failed++;
        results.errors.push(`Invalid route definitions: ${file}`);
      }
    } catch (error) {
      console.log(`❌ Error reading ${file}: ${error.message}`);
      results.failed++;
      results.errors.push(`Error reading ${file}: ${error.message}`);
    }
  }
});

// Summary
console.log('\n📊 Navigation Dry-Run Test Summary:');
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${results.passed + results.failed > 0 ? Math.round((results.passed / (results.passed + results.failed)) * 100) : 0}%`);

if (results.errors.length > 0) {
  console.log('\n🚨 Errors:');
  results.errors.forEach(error => console.log(`  - ${error}`));
}

// Exit with appropriate code
if (results.failed === 0) {
  console.log('\n🎉 All navigation dry-run tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some navigation dry-run tests failed. Please review the errors above.');
  process.exit(1);
} 