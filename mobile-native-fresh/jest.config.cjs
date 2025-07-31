module.exports = {
  preset: 'jest-expo',
  rootDir: '.',
  roots: ['<rootDir>', '<rootDir>/src', '<rootDir>/src-nextgen'],
  modulePaths: ['<rootDir>', '<rootDir>/src', '<rootDir>/src-nextgen'],
  moduleDirectories: ['node_modules', 'src', 'src-nextgen'],
  testEnvironment: 'jsdom',
  testTimeout: 80000,
  detectOpenHandles: true,
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@expo|expo(s)?|@react-navigation)/'
  ],
  moduleNameMapper: {
    '^expo-dev-menu$': '<rootDir>/jest/__mocks__/expo-dev-menu.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/jest/__mocks__/async-storage.js',
    '^performanceMonitor$': '<rootDir>/jest/__mocks__/performance-monitor.js'
  },
}; 