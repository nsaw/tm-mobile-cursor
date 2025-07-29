module.exports = {
  // Use a custom preset instead of jest-expo to avoid Winter runtime
  preset: undefined,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'src-nextgen/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src-nextgen/**/*.test.{ts,tsx}',
    '!src-nextgen/**/*.spec.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@nextgen/(.*)$': '<rootDir>/src-nextgen/$1',
  },
  testTimeout: 10000,
  // Custom transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
    '^.+\\.(js|jsx)$': ['babel-jest', { 
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  // Comprehensive transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|expo-modules-core|react-native|@react-native|@react-navigation|react-navigation|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-vector-icons|lucide-react-native|react-native-gesture-handler|react-native-reanimated|@react-native-voice|expo-av|expo-speech|expo-font|expo-splash-screen|expo-status-bar|firebase|@react-native-async-storage|@expo-google-fonts|@react-native-community|@react-native-masked-view|react-native-draggable-flatlist|react-native-responsive-fontsize|react-native-iphone-x-helper|react-native-safe-area-context|react-native-screens|react-native-web|zustand|date-fns)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'ios.js', 'android.js'],
  // Disable Expo Winter runtime for Jest
  globals: {
    'ts-jest': {
      useESM: false,
    },
  },
  // Add module resolution
  moduleDirectories: ['node_modules', 'src', 'src-nextgen'],
  // Handle ES modules
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}; 