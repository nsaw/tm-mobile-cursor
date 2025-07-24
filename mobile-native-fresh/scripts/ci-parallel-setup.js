#!/usr/bin/env { { { { node

/** & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
 * CI Parallel Setup Script
 * Configures parallel testing for legacy and nextgen environments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up CI Parallel Testing...\n');

// Configuration
const config = {
  environments: ['legacy', 'nextgen'],
  testScripts: {
    legacy: '{ { { { npm run test:legacy', & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    nextgen: '{ { { { npm run test:nextgen', & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    parallel: '{ { { { npm run test:parallel', & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    coverage: '{ { { { npm run test:coverage' & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  },
  jestConfigs: {
    legacy: 'jest.config.legacy.js',
    nextgen: 'jest.config.nextgen.js',
    parallel: 'jest.config.parallel.js'
  },
  outputDirs: {
    legacy: 'coverage/legacy',
    nextgen: 'coverage/nextgen',
    combined: 'coverage/combined'
  }
};

/**
 * Create Jest configuration for legacy environment
 */
function createLegacyJestConfig() {
  const config = {
    displayName: 'Legacy Environment',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
    testMatch: [
      '<rootDir>/src/**/*.legacy.test.{ts,tsx}',
      '<rootDir>/src/**/*.test.legacy.{ts,tsx}'
    ],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.nextgen.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/*.spec.{ts,tsx}'
    ],
    coverageDirectory: 'coverage/legacy',
    coverageReporters: ['text', 'lcov', 'html'],
    environmentVariables: {
      EXPO_PUBLIC_USE_NEXTGEN: 'false',
      EXPO_PUBLIC_ENVIRONMENT: 'legacy'
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '..', config.jestConfigs.legacy),
    `module.exports = ${JSON.stringify(config, null, 2)};`
  );

  console.log('✅ Legacy Jest configuration created');
}

/**
 * Create Jest configuration for nextgen environment
 */
function createNextGenJestConfig() {
  const config = {
    displayName: 'NextGen Environment',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
    testMatch: [
      '<rootDir>/src/**/*.nextgen.test.{ts,tsx}',
      '<rootDir>/src/**/*.test.nextgen.{ts,tsx}'
    ],
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.legacy.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/**/*.spec.{ts,tsx}'
    ],
    coverageDirectory: 'coverage/nextgen',
    coverageReporters: ['text', 'lcov', 'html'],
    environmentVariables: {
      EXPO_PUBLIC_USE_NEXTGEN: 'true',
      EXPO_PUBLIC_ENVIRONMENT: 'nextgen'
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapping: {
      '^@/(.*)$': '<rootDir>/src/$1'
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '..', config.jestConfigs.nextgen),
    `module.exports = ${JSON.stringify(config, null, 2)};`
  );

  console.log('✅ NextGen Jest configuration created');
}

/**
 * Create Jest configuration for parallel testing
 */
function createParallelJestConfig() {
  const config = {
    displayName: 'Parallel Testing',
    projects: [
      {
        displayName: 'Legacy',
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
        testMatch: [
          '<rootDir>/src/**/*.legacy.test.{ts,tsx}',
          '<rootDir>/src/**/*.test.legacy.{ts,tsx}'
        ],
        collectCoverageFrom: [
          'src/**/*.{ts,tsx}',
          '!src/**/*.nextgen.{ts,tsx}',
          '!src/**/*.test.{ts,tsx}',
          '!src/**/*.spec.{ts,tsx}'
        ],
        coverageDirectory: 'coverage/legacy',
        environmentVariables: {
          EXPO_PUBLIC_USE_NEXTGEN: 'false',
          EXPO_PUBLIC_ENVIRONMENT: 'legacy'
        },
        transform: {
          '^.+\\.(ts|tsx)$': 'ts-jest'
        }
      },
      {
        displayName: 'NextGen',
        testEnvironment: 'jsdom',
        setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
        testMatch: [
          '<rootDir>/src/**/*.nextgen.test.{ts,tsx}',
          '<rootDir>/src/**/*.test.nextgen.{ts,tsx}'
        ],
        collectCoverageFrom: [
          'src/**/*.{ts,tsx}',
          '!src/**/*.legacy.{ts,tsx}',
          '!src/**/*.test.{ts,tsx}',
          '!src/**/*.spec.{ts,tsx}'
        ],
        coverageDirectory: 'coverage/nextgen',
        environmentVariables: {
          EXPO_PUBLIC_USE_NEXTGEN: 'true',
          EXPO_PUBLIC_ENVIRONMENT: 'nextgen'
        },
        transform: {
          '^.+\\.(ts|tsx)$': 'ts-jest'
        }
      }
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: 'coverage/combined'
  };

  fs.writeFileSync(
    path.join(__dirname, '..', config.jestConfigs.parallel),
    `module.exports = ${JSON.stringify(config, null, 2)};`
  );

  console.log('✅ Parallel Jest configuration created');
}

/**
 * Update package.json with test scripts
 */
function updatePackageJson() {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add test scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'test:legacy': `jest --config ${config.jestConfigs.legacy}`,
    'test:nextgen': `jest --config ${config.jestConfigs.nextgen}`,
    'test:parallel': `jest --config ${config.jestConfigs.parallel}`,
    'test:coverage': '{ { { { npm run test:parallel -- --coverage', & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
    'test:legacy:watch': `jest --config ${config.jestConfigs.legacy} --watch`,
    'test:nextgen:watch': `jest --config ${config.jestConfigs.nextgen} --watch`,
    'test:parallel:watch': `jest --config ${config.jestConfigs.parallel} --watch`,
    'test:ci': '{ { { { npm run test:parallel -- --ci --coverage --watchAll=false' & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json updated with test scripts');
  return true;
}

/**
 * Create output directories
 */
function createOutputDirectories() {
  Object.values(config.outputDirs).forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  console.log('✅ Output directories created');
}

/**
 * Create test examples
 */
function createTestExamples() {
  const testExamples = {
    'src/__tests__/example.legacy.test.tsx': `
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { getCurrentEnvironment } from '../utils/dualMountToggle';

describe('Legacy Environment Tests', () => {
  beforeEach(() => {
    // Set up legacy environment
    process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
  });

  it('should run in legacy environment', () => {
    expect(getCurrentEnvironment()).toBe('legacy');
  });

  it('should have legacy-specific behavior', () => {
    // Test legacy-specific functionality
    expect(process.env.EXPO_PUBLIC_USE_NEXTGEN).toBe('false');
  });
});
`,
    'src/__tests__/example.nextgen.test.tsx': `
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { getCurrentEnvironment } from '../utils/dualMountToggle';

describe('NextGen Environment Tests', () => {
  beforeEach(() => {
    // Set up nextgen environment
    process.env.EXPO_PUBLIC_USE_NEXTGEN = 'true';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
  });

  it('should run in nextgen environment', () => {
    expect(getCurrentEnvironment()).toBe('nextgen');
  });

  it('should have nextgen-specific behavior', () => {
    // Test nextgen-specific functionality
    expect(process.env.EXPO_PUBLIC_USE_NEXTGEN).toBe('true');
  });
});
`
  };

  Object.entries(testExamples).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, '..', filePath);
    const dir = path.dirname(fullPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, content.trim());
  });

  console.log('✅ Test examples created');
}

/**
 * Validate setup
 */
function validateSetup() {
  const requiredFiles = [
    config.jestConfigs.legacy,
    config.jestConfigs.nextgen,
    config.jestConfigs.parallel,
    'package.json'
  ];

  const missingFiles = requiredFiles.filter(file => {
    const fullPath = path.join(__dirname, '..', file);
    return !fs.existsSync(fullPath);
  });

  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    return false;
  }

  // Test Jest configurations
  try {
    execSync('{ { { { { { npx jest --version & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown', { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' }), { stdio: 'pipe' });
    console.log('✅ Jest is available');
  } catch (error) {
    console.error('❌ Jest not available:', error.message);
    return false;
  }

  console.log('✅ Setup validation passed');
  return true;
}

/**
 * Main setup function
 */
function setup() {
  console.log('🔧 Setting up CI Parallel Testing...\n');

  try {
    createLegacyJestConfig();
    createNextGenJestConfig();
    createParallelJestConfig();
    updatePackageJson();
    createOutputDirectories();
    createTestExamples();
    
    if (validateSetup()) {
      console.log('\n🎉 CI Parallel Setup Complete!');
      console.log('\nAvailable commands:');
      console.log('  { { { { npm run test:legacy     - Run legacy tests') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  { { { { npm run test:nextgen    - Run nextgen tests') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  { { { { npm run test:parallel   - Run both environments in parallel') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  { { { { npm run test:coverage   - Run tests with coverage') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
      console.log('  { { { { npm run test:ci         - Run tests for CI') & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown;
    } else {
      console.error('\n❌ Setup validation failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setup();
}

module.exports = {
  setup,
  createLegacyJestConfig,
  createNextGenJestConfig,
  createParallelJestConfig,
  updatePackageJson,
  createOutputDirectories,
  createTestExamples,
  validateSetup
}; 