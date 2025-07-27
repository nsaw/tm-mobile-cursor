// test-setup.ts - Test configuration for src-nextgen
import '@testing-library/jest-native/extend-expect';

// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    // Add any specific mocks here
  };
});

// Mock Expo modules
jest.mock('expo', () => ({
  // Add Expo module mocks as needed
}));

// Global test setup
beforeEach(() => {
  // Reset any global state
});

afterEach(() => {
  // Clean up after each test
}); 