module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)',
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
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
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
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
      testMatch: ['<rootDir>/src/**/__tests__/**/*.legacy.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
      testEnvironment: 'node',
      globals: {
        'EXPO_PUBLIC_USE_NEXTGEN': 'false',
        'EXPO_PUBLIC_ENVIRONMENT': 'legacy',
      },
    },
    {
      displayName: 'nextgen',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.nextgen.test.{ts,tsx}'],
      setupFilesAfterEnv: ['<rootDir>/src/utils/test-setup.ts'],
      testEnvironment: 'node',
      globals: {
        'EXPO_PUBLIC_USE_NEXTGEN': 'true',
        'EXPO_PUBLIC_ENVIRONMENT': 'nextgen',
      },
    },
  ],
}; 