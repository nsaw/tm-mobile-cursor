// Minimal test setup for React Native components

// Mock React Native components
jest.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  TouchableWithoutFeedback: 'TouchableWithoutFeedback',
  Pressable: 'Pressable',
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
}));

// Set up environment variables
process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';

// Test environment configuration
beforeEach(function() {
  process.env.EXPO_PUBLIC_USE_NEXTGEN = 'false';
  process.env.EXPO_PUBLIC_ENVIRONMENT = 'legacy';
  jest.clearAllMocks();
});

afterEach(function() {
  jest.restoreAllMocks();
}); 