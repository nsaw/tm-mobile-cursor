module.exports = {
  testEnvironment: 'node',
  testTimeout: 120000,
  testMatch: ['<rootDir>/tests/**/*.e2e.js'],
  verbose: true,
  globalSetup: '<rootDir>/global-setup.js',
  globalTeardown: '<rootDir>/global-teardown.js'
}; 