module.exports = {
  testEnvironment: 'node',
  testTimeout: 120000,
  testRegex: '.*\\.(test|e2e)\\.js$',
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@expo|expo(s)?|@react-navigation)/'
  ]
}; 