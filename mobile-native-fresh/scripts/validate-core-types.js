#!/usr/bin/env node

/**
 * Core Types Runtime Validation Script
 * 
 * This script validates all core types at runtime to ensure
 * they work correctly in the actual application environment.
 */

const fs = require('fs');
const path = require('path');

// Mock React Native environment for Node.js
global.React = require('react');
global.__DEV__ = true;

// Mock React Native components
global.View = () => null;
global.Text = () => null;
global.Image = () => null;
global.TouchableOpacity = () => null;
global.ScrollView = () => null;
global.FlatList = () => null;

// Mock React Native APIs
global.Platform = {
  OS: 'ios',
  Version: '15.0',
  isPad: false,
  isTV: false,
  isTVOS: false,
  isTesting: false,
};

global.AsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock performance API
global.performance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
};

// Mock fetch
global.fetch = jest.fn();

// Mock console for testing
const originalConsole = { ...console };
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Import type validation utilities
const { typeValidator, typeTester } = require('../src-nextgen/types/TypeValidation');
const { isUser, isThoughtmark, isBin, isTask, isApiResponse, isApiError, isAppState, isAuthState, isUIState } = require('../src-nextgen/types/TypeGuards');

// Test data
const testData = {
  user: {
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    isPremium: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  thoughtmark: {
    id: 'test-thought',
    title: 'Test Thoughtmark',
    content: 'This is a test thoughtmark content',
    tags: ['test', 'example'],
    binId: 'test-bin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
    isPinned: false,
  },
  bin: {
    id: 'test-bin',
    name: 'Test Bin',
    color: '#FF0000',
    thoughtmarkCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: false,
    sortOrder: 1,
  },
  task: {
    id: 'test-task',
    title: 'Test Task',
    isCompleted: false,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  apiResponse: {
    data: { success: true },
    status: 200,
    message: 'Success',
    success: true,
    timestamp: new Date().toISOString(),
  },
  apiError: {
    code: 'TEST_ERROR',
    message: 'Test error message',
    timestamp: new Date().toISOString(),
  },
  appState: {
    currentEnvironment: 'nextgen',
    isFirstLaunch: false,
    onboardingCompleted: true,
    theme: 'light',
    notifications: true,
    analytics: true,
    version: '1.0.0',
    buildNumber: '1',
  },
  authState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    refreshToken: null,
    tokenExpiry: null,
  },
  uiState: {
    isLoading: false,
    error: null,
    modal: {
      isVisible: false,
      type: null,
      data: null,
    },
    sidebar: {
      isOpen: false,
    },
    search: {
      query: '',
      isActive: false,
      results: [],
      filters: {
        bins: [],
        tags: [],
        dateRange: { start: null, end: null },
        sortBy: 'created',
        sortOrder: 'desc',
      },
    },
    toast: {
      isVisible: false,
      message: '',
      type: 'info',
      duration: 3000,
    },
  },
};

// Validation functions
function validateTypeGuards() {
  console.log('🔍 Validating Type Guards...');
  
  const results = {
    user: isUser(testData.user),
    thoughtmark: isThoughtmark(testData.thoughtmark),
    bin: isBin(testData.bin),
    task: isTask(testData.task),
    apiResponse: isApiResponse(testData.apiResponse),
    apiError: isApiError(testData.apiError),
    appState: isAppState(testData.appState),
    authState: isAuthState(testData.authState),
    uiState: isUIState(testData.uiState),
  };

  const allValid = Object.values(results).every(result => result === true);
  
  console.log('Type Guard Results:', results);
  console.log(`✅ All type guards valid: ${allValid}`);
  
  return allValid;
}

function validateTypeValidator() {
  console.log('🔍 Validating Type Validator...');
  
  const results = {
    apiTypes: typeValidator.validateApiTypes(),
    dataTypes: typeValidator.validateDataTypes(),
    stateTypes: typeValidator.validateStateTypes(),
    navigationTypes: typeValidator.validateNavigationTypes(),
    allTypes: typeValidator.validateAllTypes(),
  };

  const allValid = Object.values(results).every(result => result.isValid);
  
  console.log('Type Validator Results:', results);
  console.log(`✅ All type validations passed: ${allValid}`);
  
  return allValid;
}

function validateTypeTester() {
  console.log('🔍 Running Type Tests...');
  
  const suites = typeTester.runAllTests();
  
  const allPassed = suites.every(suite => suite.passedTests === suite.totalTests);
  
  console.log('Test Suite Results:');
  suites.forEach(suite => {
    console.log(`  ${suite.name}: ${suite.passedTests}/${suite.totalTests} passed (${suite.duration}ms)`);
  });
  
  console.log(`✅ All type tests passed: ${allPassed}`);
  
  return allPassed;
}

function validateCompatibility() {
  console.log('🔍 Validating Legacy Compatibility...');
  
  const checks = typeValidator.checkLegacyCompatibility();
  const allCompatible = checks.every(check => check.isCompatible);
  
  console.log('Compatibility Checks:', checks);
  console.log(`✅ All compatibility checks passed: ${allCompatible}`);
  
  return allCompatible;
}

function validateEdgeCases() {
  console.log('🔍 Validating Edge Cases...');
  
  const edgeCases = [
    { name: 'null values', value: null },
    { name: 'undefined values', value: undefined },
    { name: 'string values', value: 'test' },
    { name: 'number values', value: 123 },
    { name: 'boolean values', value: true },
    { name: 'array values', value: [] },
    { name: 'empty objects', value: {} },
  ];

  const typeGuards = [isUser, isThoughtmark, isBin, isTask, isApiResponse, isApiError, isAppState, isAuthState, isUIState];
  
  let allHandled = true;
  
  edgeCases.forEach(edgeCase => {
    typeGuards.forEach(guard => {
      try {
        const result = guard(edgeCase.value);
        if (typeof result !== 'boolean') {
          console.error(`❌ Type guard returned non-boolean for ${edgeCase.name}: ${result}`);
          allHandled = false;
        }
      } catch (error) {
        console.error(`❌ Type guard threw error for ${edgeCase.name}: ${error.message}`);
        allHandled = false;
      }
    });
  });
  
  console.log(`✅ All edge cases handled: ${allHandled}`);
  
  return allHandled;
}

function validatePerformance() {
  console.log('🔍 Validating Performance...');
  
  const iterations = 1000;
  const startTime = Date.now();
  
  // Run type guards multiple times
  for (let i = 0; i < iterations; i++) {
    isUser(testData.user);
    isThoughtmark(testData.thoughtmark);
    isBin(testData.bin);
    isTask(testData.task);
    isApiResponse(testData.apiResponse);
    isApiError(testData.apiError);
    isAppState(testData.appState);
    isAuthState(testData.authState);
    isUIState(testData.uiState);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const averageTime = duration / iterations;
  
  console.log(`Performance: ${iterations} iterations in ${duration}ms (${averageTime.toFixed(2)}ms per iteration)`);
  
  const performanceOk = averageTime < 1; // Should be less than 1ms per iteration
  console.log(`✅ Performance acceptable: ${performanceOk}`);
  
  return performanceOk;
}

// Main validation function
function runValidation() {
  console.log('🚀 Starting Core Types Runtime Validation...\n');
  
  const results = {
    typeGuards: validateTypeGuards(),
    typeValidator: validateTypeValidator(),
    typeTester: validateTypeTester(),
    compatibility: validateCompatibility(),
    edgeCases: validateEdgeCases(),
    performance: validatePerformance(),
  };
  
  console.log('\n📊 Validation Summary:');
  Object.entries(results).forEach(([name, result]) => {
    console.log(`  ${name}: ${result ? '✅ PASS' : '❌ FAIL'}`);
  });
  
  const allPassed = Object.values(results).every(result => result === true);
  
  console.log(`\n${allPassed ? '🎉 All validations passed!' : '❌ Some validations failed!'}`);
  
  // Restore console
  global.console = originalConsole;
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run validation if this script is executed directly
if (require.main === module) {
  runValidation();
}

module.exports = {
  runValidation,
  validateTypeGuards,
  validateTypeValidator,
  validateTypeTester,
  validateCompatibility,
  validateEdgeCases,
  validatePerformance,
}; 