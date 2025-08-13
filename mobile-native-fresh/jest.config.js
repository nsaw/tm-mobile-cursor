/* Hardened Jest config for RN/Expo */
export default {
  preset: 'react-native',
  testEnvironment: 'node',
  roots: ['/Users/sawyer/gitSync/.cursor-cache/MAIN/validation'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-vector-icons|react-native-reanimated|expo|expo-modules-core|@expo|@react-navigation|@react-native-community)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '/Users/sawyer/gitSync/.cursor-cache/MAIN/validation/__mocks__/fileMock.js'
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  reporters: ['default'],
  verbose: true,
  maxWorkers: 1
};
