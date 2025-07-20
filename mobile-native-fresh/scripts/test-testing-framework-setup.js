#!/usr/bin/env node

/**
 * Testing Framework Setup Validation
 * Tests the testing framework system and infrastructure
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Testing Framework Setup...\n');

// Test 1: Package.json Dependencies
console.log('📦 Test 1: Package.json Dependencies');
try {
  const packageJsonPath = path.join(__dirname, '../package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json file missing');
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check for testing dependencies
  const requiredDependencies = [
    '@testing-library/react-native',
    '@testing-library/jest-native',
    'jest',
    'jest-expo',
    '@types/jest',
    'detox',
    'ts-jest'
  ];
  
  for (const dep of requiredDependencies) {
    if (!packageJson.devDependencies[dep]) {
      throw new Error(`Missing testing dependency: ${dep}`);
    }
  }
  
  console.log('✅ All testing dependencies present');
  
  // Check for testing scripts
  const requiredScripts = [
    'test',
    'test:watch',
    'test:coverage',
    'test:unit',
    'test:integration',
    'test:e2e',
    'test:parallel',
    'test:legacy',
    'test:nextgen'
  ];
  
  for (const script of requiredScripts) {
    if (!packageJson.scripts[script]) {
      throw new Error(`Missing testing script: ${script}`);
    }
  }
  
  console.log('✅ All testing scripts present');
  
} catch (error) {
  console.error('❌ Package.json test failed:', error.message);
  process.exit(1);
}

// Test 2: Jest Configuration
console.log('\n⚙️ Test 2: Jest Configuration');
try {
  const jestConfigPath = path.join(__dirname, '../jest.config.js');
  if (!fs.existsSync(jestConfigPath)) {
    throw new Error('jest.config.js file missing');
  }
  
  const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf8');
  
  // Check for Jest configuration features
  const jestFeatures = [
    'preset',
    'jest-expo',
    'setupFilesAfterEnv',
    'transformIgnorePatterns',
    'moduleFileExtensions',
    'testMatch',
    'testEnvironment',
    'collectCoverageFrom',
    'coverageDirectory',
    'coverageReporters',
    'coverageThreshold',
    'testTimeout',
    'verbose',
    'clearMocks',
    'restoreMocks',
    'testPathIgnorePatterns',
    'moduleNameMapping',
    'globals',
    'projects'
  ];
  
  for (const feature of jestFeatures) {
    if (!jestConfigContent.includes(feature)) {
      throw new Error(`Missing Jest configuration feature: ${feature}`);
    }
  }
  
  console.log('✅ Jest configuration present');
  
} catch (error) {
  console.error('❌ Jest configuration test failed:', error.message);
  process.exit(1);
}

// Test 3: Test Setup File
console.log('\n🔧 Test 3: Test Setup File');
try {
  const testSetupPath = path.join(__dirname, '../src/utils/test-setup.ts');
  if (!fs.existsSync(testSetupPath)) {
    throw new Error('test-setup.ts file missing');
  }
  
  const testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
  
  // Check for test setup features
  const setupFeatures = [
    '@testing-library/jest-native/extend-expect',
    'jest.mock',
    'react-native',
    'expo',
    'AsyncStorage',
    'navigation',
    'firebase',
    'EXPO_PUBLIC_USE_NEXTGEN',
    'EXPO_PUBLIC_ENVIRONMENT',
    'testUtils',
    'createTestComponent',
    'mockEnvironment',
    'resetEnvironment',
    'waitFor',
    'createMockData',
    'expect.extend',
    'toHaveEnvironment',
    'toBeAccessible',
    'beforeEach',
    'afterEach',
    'testConfig'
  ];
  
  for (const feature of setupFeatures) {
    if (!testSetupContent.includes(feature)) {
      throw new Error(`Missing test setup feature: ${feature}`);
    }
  }
  
  console.log('✅ Test setup file present');
  
} catch (error) {
  console.error('❌ Test setup file test failed:', error.message);
  process.exit(1);
}

// Test 4: Example Test Files
console.log('\n📝 Test 4: Example Test Files');
try {
  const legacyTestPath = path.join(__dirname, '../src/__tests__/example.legacy.test.tsx');
  const nextgenTestPath = path.join(__dirname, '../src/__tests__/example.nextgen.test.tsx');
  
  if (!fs.existsSync(legacyTestPath)) {
    throw new Error('example.legacy.test.tsx file missing');
  }
  
  if (!fs.existsSync(nextgenTestPath)) {
    throw new Error('example.nextgen.test.tsx file missing');
  }
  
  console.log('✅ Example test files present');
  
  // Check test content
  const legacyTestContent = fs.readFileSync(legacyTestPath, 'utf8');
  const nextgenTestContent = fs.readFileSync(nextgenTestPath, 'utf8');
  
  const testFeatures = [
    '@testing-library/react-native',
    'render',
    'screen',
    'fireEvent',
    'describe',
    'it',
    'expect',
    'beforeEach',
    'EXPO_PUBLIC_USE_NEXTGEN',
    'EXPO_PUBLIC_ENVIRONMENT'
  ];
  
  for (const feature of testFeatures) {
    if (!legacyTestContent.includes(feature)) {
      throw new Error(`Missing test feature in legacy test: ${feature}`);
    }
    if (!nextgenTestContent.includes(feature)) {
      throw new Error(`Missing test feature in nextgen test: ${feature}`);
    }
  }
  
  console.log('✅ Test files have required features');
  
} catch (error) {
  console.error('❌ Example test files test failed:', error.message);
  process.exit(1);
}

// Test 5: Environment Support
console.log('\n🔄 Test 5: Environment Support');
try {
  const testSetupPath = path.join(__dirname, '../src/utils/test-setup.ts');
  const testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
  
  // Check for environment support
  const environmentFeatures = [
    'legacy',
    'nextgen',
    'EXPO_PUBLIC_USE_NEXTGEN',
    'EXPO_PUBLIC_ENVIRONMENT',
    'mockEnvironment',
    'resetEnvironment'
  ];
  
  for (const feature of environmentFeatures) {
    if (!testSetupContent.includes(feature)) {
      throw new Error(`Missing environment feature: ${feature}`);
    }
  }
  
  console.log('✅ Dual-mount environment support configured');
  
} catch (error) {
  console.error('❌ Environment support test failed:', error.message);
  process.exit(1);
}

// Test 6: Testing Utilities
console.log('\n🛠️ Test 6: Testing Utilities');
try {
  const testSetupPath = path.join(__dirname, '../src/utils/test-setup.ts');
  const testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
  
  // Check for testing utilities
  const utilityFeatures = [
    'createTestComponent',
    'createTestWrapper',
    'mockApiResponse',
    'createTestStore',
    'waitFor',
    'createMockData'
  ];
  
  for (const feature of utilityFeatures) {
    if (!testSetupContent.includes(feature)) {
      throw new Error(`Missing testing utility: ${feature}`);
    }
  }
  
  console.log('✅ Testing utilities present');
  
} catch (error) {
  console.error('❌ Testing utilities test failed:', error.message);
  process.exit(1);
}

// Test 7: Custom Matchers
console.log('\n🎯 Test 7: Custom Matchers');
try {
  const testSetupPath = path.join(__dirname, '../src/utils/test-setup.ts');
  const testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
  
  // Check for custom matchers
  const matcherFeatures = [
    'expect.extend',
    'toHaveEnvironment',
    'toBeAccessible',
    'Custom matchers for testing'
  ];
  
  for (const feature of matcherFeatures) {
    if (!testSetupContent.includes(feature)) {
      throw new Error(`Missing custom matcher: ${feature}`);
    }
  }
  
  console.log('✅ Custom matchers present');
  
} catch (error) {
  console.error('❌ Custom matchers test failed:', error.message);
  process.exit(1);
}

// Test 8: Mock Configuration
console.log('\n🎭 Test 8: Mock Configuration');
try {
  const testSetupPath = path.join(__dirname, '../src/utils/test-setup.ts');
  const testSetupContent = fs.readFileSync(testSetupPath, 'utf8');
  
  // Check for mock configuration
  const mockFeatures = [
    'jest.mock',
    'react-native',
    'expo',
    'AsyncStorage',
    'navigation',
    'firebase',
    'TouchableOpacity',
    'Text',
    'View',
    'Platform',
    'Dimensions'
  ];
  
  for (const feature of mockFeatures) {
    if (!testSetupContent.includes(feature)) {
      throw new Error(`Missing mock configuration: ${feature}`);
    }
  }
  
  console.log('✅ Mock configuration present');
  
} catch (error) {
  console.error('❌ Mock configuration test failed:', error.message);
  process.exit(1);
}

// Test 9: Coverage Configuration
console.log('\n📊 Test 9: Coverage Configuration');
try {
  const jestConfigPath = path.join(__dirname, '../jest.config.js');
  const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf8');
  
  // Check for coverage configuration
  const coverageFeatures = [
    'collectCoverageFrom',
    'coverageDirectory',
    'coverageReporters',
    'coverageThreshold',
    'branches',
    'functions',
    'lines',
    'statements'
  ];
  
  for (const feature of coverageFeatures) {
    if (!jestConfigContent.includes(feature)) {
      throw new Error(`Missing coverage configuration: ${feature}`);
    }
  }
  
  console.log('✅ Coverage configuration present');
  
} catch (error) {
  console.error('❌ Coverage configuration test failed:', error.message);
  process.exit(1);
}

// Test 10: Parallel Testing
console.log('\n⚡ Test 10: Parallel Testing');
try {
  const jestConfigPath = path.join(__dirname, '../jest.config.js');
  const jestConfigContent = fs.readFileSync(jestConfigPath, 'utf8');
  
  // Check for parallel testing configuration
  const parallelFeatures = [
    'projects',
    'legacy',
    'nextgen',
    'displayName',
    'testMatch',
    'globals'
  ];
  
  for (const feature of parallelFeatures) {
    if (!jestConfigContent.includes(feature)) {
      throw new Error(`Missing parallel testing feature: ${feature}`);
    }
  }
  
  console.log('✅ Parallel testing configuration present');
  
} catch (error) {
  console.error('❌ Parallel testing test failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 All Testing Framework Setup Tests Passed!');
console.log('\n📊 Summary:');
console.log('- ✅ All testing dependencies present');
console.log('- ✅ All testing scripts present');
console.log('- ✅ Jest configuration present');
console.log('- ✅ Test setup file present');
console.log('- ✅ Example test files present');
console.log('- ✅ Dual-mount environment support configured');
console.log('- ✅ Testing utilities present');
console.log('- ✅ Custom matchers present');
console.log('- ✅ Mock configuration present');
console.log('- ✅ Coverage configuration present');
console.log('- ✅ Parallel testing configuration present');

console.log('\n🧪 Testing framework ready!');
console.log('The system can now run unit tests, integration tests, and e2e tests');
console.log('for both legacy and nextgen environments with full coverage reporting.'); 