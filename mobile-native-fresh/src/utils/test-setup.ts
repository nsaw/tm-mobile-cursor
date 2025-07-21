// src/utils/test-setup.ts
// Test setup configuration for dual-mount architecture

import '@testing-library/jest-native/extend-expect';

// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    // Mock specific components that might cause issues in tests
    TouchableOpacity: 'TouchableOpacity',
    TouchableHighlight: 'TouchableHighlight',
    TouchableWithoutFeedback: 'TouchableWithoutFeedback',
    Pressable: 'Pressable',
    Text: 'Text',
    View: 'View',
    Image: 'Image',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    TextInput: 'TextInput',
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    StatusBar: {
      setBarStyle: jest.fn(),
      setHidden: jest.fn(),
    },
  };
});

// Mock Expo modules
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  Constants: {
    manifest: {
      extra: {
        EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN || 'false',
        EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT || 'legacy',
      },
    },
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Mock Firebase (if used)
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

// Mock environment variables
process.env.EXPO_PUBLIC_USE_NEXTGEN = process.env.EXPO_PUBLIC_USE_NEXTGEN || 'false';
process.env.EXPO_PUBLIC_ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'legacy';

// Global test utilities
(global as any).testUtils = {
  // Helper to create test components
  createTestComponent: (Component: any, props: any = {}) => {
    return Component(props);
  },

  // Helper to mock environment
  mockEnvironment: (environment: 'legacy' | 'nextgen') => {
    process.env.EXPO_PUBLIC_USE_NEXTGEN = environment === 'nextgen' ? 'true' : 'false';
    process.env.EXPO_PUBLIC_ENVIRONMENT = environment;
  },

  // Helper to reset environment
  resetEnvironment: () => {
    process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
    process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
  },

  // Helper to wait for async operations
  waitFor: (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to create mock data
  createMockData: (type: string, overrides: any = {}) => {
    const baseData = {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
      thoughtmark: {
        id: 'test-thoughtmark-id',
        title: 'Test Thoughtmark',
        content: 'Test content',
        createdAt: new Date().toISOString(),
      },
      component: {
        name: 'TestComponent',
        props: {},
        children: [],
      },
    };

    return { ...baseData[type as keyof typeof baseData], ...overrides };
  },
};

// Custom matchers for testing
expect.extend({
  toHaveEnvironment(component: any, expectedEnvironment: 'legacy' | 'nextgen') {
    const pass = component.props?.testID?.includes(expectedEnvironment) || 
                 component.props?.accessibilityLabel?.includes(expectedEnvironment);
    
    return {
      pass,
      message: () =>
        `expected component to have environment ${expectedEnvironment}, but got ${component.props?.testID || 'unknown'}`,
    };
  },

  toBeAccessible(component: any) {
    const hasAccessibilityProps = component.props?.accessibilityLabel || 
                                 component.props?.accessibilityRole ||
                                 component.props?.accessibilityHint;
    
    return {
      pass: !!hasAccessibilityProps,
      message: () =>
        'expected component to have accessibility props, but none found',
    };
  },
});

// Test environment configuration
beforeEach(() => {
  // Reset environment to legacy by default
  process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
  process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
  
  // Clear all mocks
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks();
});

// Global test configuration
const testConfig = {
  // Test timeout
  timeout: 10000,
  
  // Environment-specific test data
  environments: {
    legacy: {
      prefix: 'legacy',
      features: ['basic', 'stable'],
    },
    nextgen: {
      prefix: 'nextgen',
      features: ['advanced', 'experimental'],
    },
  },
  
  // Test utilities
  utils: {
    // Create test wrapper with environment
    createTestWrapper: (environment: 'legacy' | 'nextgen') => {
      return ({ children }: { children: React.ReactNode }) => {
        process.env.EXPO_PUBLIC_USE_NEXTGEN = environment === 'nextgen' ? 'true' : 'false';
        process.env.EXPO_PUBLIC_ENVIRONMENT = environment;
        return children;
      };
    },
    
    // Mock API responses
    mockApiResponse: (data: any, status: number = 200) => {
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(data),
      });
    },
    
    // Create test store
    createTestStore: (initialState: any = {}) => {
      return {
        getState: () => initialState,
        dispatch: jest.fn(),
        subscribe: jest.fn(),
      };
    },
  },
};

// Export test configuration
export default testConfig; 