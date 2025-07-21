#!/usr/bin/env node

console.log('🔍 Testing safe-frame shell functionality...');

// Mock safe-frame shell system for testing
const mockSafeFrameShells = {
  shells: [
    {
      layoutId: 'modal-container',
      width: 300,
      height: 400,
      position: 'center',
      zIndex: 200,
      environment: 'legacy',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      constraints: {
        minWidth: 200,
        maxWidth: 400,
        minHeight: 100,
        maxHeight: 600,
        overflow: 'hidden'
      },
      validationRules: {
        minZIndex: 200,
        maxZIndex: 299,
        allowedLayers: ['modal'],
        conflicts: []
      }
    },
    {
      layoutId: 'notification-container',
      width: 350,
      height: 80,
      position: 'top',
      zIndex: 400,
      environment: 'legacy',
      padding: { top: 10, bottom: 10, left: 15, right: 15 },
      constraints: {
        minWidth: 250,
        maxWidth: 400,
        minHeight: 60,
        maxHeight: 120,
        overflow: 'hidden'
      },
      validationRules: {
        minZIndex: 400,
        maxZIndex: 499,
        allowedLayers: ['notification'],
        conflicts: []
      }
    }
  ],

  // Get shell by ID
  getShell: (layoutId) => {
    return mockSafeFrameShells.shells.find(shell => shell.layoutId === layoutId) || null;
  },

  // Validate shell constraints
  validateConstraints: (shell, width, height) => {
    const { constraints } = shell;
    
    if (constraints.minWidth && width < constraints.minWidth) return false;
    if (constraints.maxWidth && width > constraints.maxWidth) return false;
    if (constraints.minHeight && height < constraints.minHeight) return false;
    if (constraints.maxHeight && height > constraints.maxHeight) return false;
    
    return true;
  },

  // Validate shell z-index
  validateZIndex: (shell, zIndex) => {
    const { validationRules } = shell;
    return zIndex >= validationRules.minZIndex && zIndex <= validationRules.maxZIndex;
  },

  // Get shells for environment
  getShellsForEnvironment: (environment) => {
    return mockSafeFrameShells.shells.filter(shell => shell.environment === environment);
  },

  // Check shell conflicts
  checkConflicts: (shell1, shell2) => {
    const { validationRules: rules1 } = shell1;
    const { validationRules: rules2 } = shell2;
    
    // Check for z-index conflicts
    const zIndexOverlap = !(rules1.maxZIndex < rules2.minZIndex || rules1.minZIndex > rules2.maxZIndex);
    
    // Check for layer conflicts
    const layerConflict = rules1.allowedLayers.some(layer => rules2.allowedLayers.includes(layer));
    
    return zIndexOverlap && layerConflict;
  }
};

// Test cases for safe-frame shells
const shellTestCases = [
  // Valid shell configurations
  { layoutId: 'modal-container', width: 300, height: 400, zIndex: 200, expected: true },
  { layoutId: 'modal-container', width: 250, height: 300, zIndex: 250, expected: true },
  { layoutId: 'notification-container', width: 350, height: 80, zIndex: 400, expected: true },
  { layoutId: 'notification-container', width: 300, height: 100, zIndex: 450, expected: true },
  
  // Invalid width/height
  { layoutId: 'modal-container', width: 150, height: 400, zIndex: 200, expected: false }, // too narrow
  { layoutId: 'modal-container', width: 500, height: 400, zIndex: 200, expected: false }, // too wide
  { layoutId: 'modal-container', width: 300, height: 50, zIndex: 200, expected: false }, // too short
  { layoutId: 'modal-container', width: 300, height: 700, zIndex: 200, expected: false }, // too tall
  
  // Invalid z-index
  { layoutId: 'modal-container', width: 300, height: 400, zIndex: 100, expected: false }, // wrong layer
  { layoutId: 'modal-container', width: 300, height: 400, zIndex: 300, expected: false }, // wrong layer
  { layoutId: 'notification-container', width: 350, height: 80, zIndex: 200, expected: false }, // wrong layer
  { layoutId: 'notification-container', width: 350, height: 80, zIndex: 500, expected: false }, // out of range
];

let allPassed = true;
let passedTests = 0;
let totalTests = shellTestCases.length;

console.log(`Running ${totalTests} safe-frame shell tests...`);

shellTestCases.forEach((testCase, index) => {
  const shell = mockSafeFrameShells.getShell(testCase.layoutId);
  
  if (!shell) {
    console.error(`❌ Test ${index + 1}: Shell ${testCase.layoutId} not found - FAILED`);
    allPassed = false;
    return;
  }
  
  const constraintsValid = mockSafeFrameShells.validateConstraints(shell, testCase.width, testCase.height);
  const zIndexValid = mockSafeFrameShells.validateZIndex(shell, testCase.zIndex);
  const overallValid = constraintsValid && zIndexValid;
  
  if (overallValid === testCase.expected) {
    console.log(`✅ Test ${index + 1}: ${testCase.layoutId} (${testCase.width}x${testCase.height}, z-index: ${testCase.zIndex}) - PASSED`);
    passedTests++;
  } else {
    console.error(`❌ Test ${index + 1}: ${testCase.layoutId} (${testCase.width}x${testCase.height}, z-index: ${testCase.zIndex}) - FAILED`);
    console.error(`   Expected: ${testCase.expected}, Got: ${overallValid}`);
    console.error(`   Constraints valid: ${constraintsValid}, Z-index valid: ${zIndexValid}`);
    allPassed = false;
  }
});

// Test shell retrieval
console.log('\n🔍 Testing shell retrieval...');

const retrievalTests = [
  { layoutId: 'modal-container', expectedFound: true },
  { layoutId: 'notification-container', expectedFound: true },
  { layoutId: 'non-existent-shell', expectedFound: false },
  { layoutId: 'invalid-shell', expectedFound: false }
];

retrievalTests.forEach((testCase, index) => {
  const shell = mockSafeFrameShells.getShell(testCase.layoutId);
  const found = shell !== null;
  
  if (found === testCase.expectedFound) {
    console.log(`✅ Retrieval test ${index + 1}: ${testCase.layoutId} - PASSED`);
  } else {
    console.error(`❌ Retrieval test ${index + 1}: ${testCase.layoutId} - FAILED`);
    allPassed = false;
  }
});

// Test environment filtering
console.log('\n🔍 Testing environment filtering...');

const environmentTests = [
  { environment: 'legacy', expectedCount: 2 },
  { environment: 'nextgen', expectedCount: 0 }
];

environmentTests.forEach((testCase, index) => {
  const shells = mockSafeFrameShells.getShellsForEnvironment(testCase.environment);
  const count = shells.length;
  
  if (count === testCase.expectedCount) {
    console.log(`✅ Environment test ${index + 1}: ${testCase.environment} (${count} shells) - PASSED`);
  } else {
    console.error(`❌ Environment test ${index + 1}: ${testCase.environment} (${count} shells, expected ${testCase.expectedCount}) - FAILED`);
    allPassed = false;
  }
});

// Test shell conflicts
console.log('\n🔍 Testing shell conflicts...');

const conflictTests = [
  { shell1Id: 'modal-container', shell2Id: 'notification-container', expectedConflict: false },
  { shell1Id: 'modal-container', shell2Id: 'modal-container', expectedConflict: true }
];

conflictTests.forEach((testCase, index) => {
  const shell1 = mockSafeFrameShells.getShell(testCase.shell1Id);
  const shell2 = mockSafeFrameShells.getShell(testCase.shell2Id);
  
  if (!shell1 || !shell2) {
    console.error(`❌ Conflict test ${index + 1}: Shell not found - FAILED`);
    allPassed = false;
    return;
  }
  
  const hasConflict = mockSafeFrameShells.checkConflicts(shell1, shell2);
  
  if (hasConflict === testCase.expectedConflict) {
    console.log(`✅ Conflict test ${index + 1}: ${testCase.shell1Id} vs ${testCase.shell2Id} - PASSED`);
  } else {
    console.error(`❌ Conflict test ${index + 1}: ${testCase.shell1Id} vs ${testCase.shell2Id} - FAILED`);
    allPassed = false;
  }
});

console.log(`\n📊 Safe-Frame Shell Test Results: ${passedTests}/${totalTests} tests passed`);

if (allPassed) {
  console.log('🎉 Safe-frame shell validation passed!');
  process.exit(0);
} else {
  console.error('💥 Safe-frame shell validation failed!');
  process.exit(1);
} 