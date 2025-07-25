module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src-reference-complete/utils/test-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-responsive-fontsize|react-native-iphone-x-helper)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src-reference-complete/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src-reference-complete/**/?(*.)(spec|test).(ts|tsx|js)',
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src-reference-complete/**/*.{ts,tsx}',
    'src-nextgen/**/*.{ts,tsx}',
    '!src-reference-complete/**/*.d.ts',
    '!src-reference-complete/**/__tests__/**',
    '!src-reference-complete/**/*.test.{ts,tsx}',
    '!src-reference-complete/**/*.spec.{ts,tsx}',
    '!src-nextgen/**/*.d.ts',
    '!src-nextgen/**/__tests__/**',
    '!src-nextgen/**/*.test.{ts,tsx}',
    '!src-nextgen/**/*.spec.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/coverage/',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src-reference-complete/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // Environment-specific test configuration
  projects: [
    {
      displayName: 'legacy',
      testMatch: ['<rootDir>/__tests__/**/*.legacy.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src-reference-complete/utils/test-setup.ts'],
      testEnvironment: 'node',
      globals: {
        'EXPO_PUBLIC_USE_NEXTGEN': 'false',
        'EXPO_PUBLIC_ENVIRONMENT': 'legacy',
      },
    },
  ],
  // Transform configuration for React Native
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // Handle ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}; 