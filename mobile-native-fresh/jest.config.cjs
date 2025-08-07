module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  testTimeout: 120000,
  testRegex: '.*\\.(test|e2e)\\.(js|ts|tsx)$',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@expo|expo(s)?|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons|lucide-react-native)/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src-nextgen/$1'
  },
  globals: {
    __DEV__: true
  }
}; 