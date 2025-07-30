import { Text } from 'react-native';
import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

import { ThemeProvider } from '../../theme/ThemeProvider';

// Mock providers wrapper
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider><Text>{children}</Text></ThemeProvider>
  );
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };

// Test data factories
export const createMockThoughtmark = (overrides = {}) => ({
  id: 'test-thoughtmark-1',
  title: 'Test Thoughtmark',
  content: 'This is a test thoughtmark content',
  tags: ['test', 'example'],
  isPinned: false,
  isCompleted: false,
  isDeleted: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  binId: null,
  ...overrides,
});

export const createMockBin = (overrides = {}) => ({
  id: 'test-bin-1',
  name: 'Test Bin',
  description: 'A test bin for testing',
  color: '#007AFF',
  isDeleted: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  isAnonymous: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// Mock navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

// Mock route
export const mockRoute = {
  key: 'test-route',
  name: 'TestScreen',
  params: {},
  path: undefined,
};

// Mock theme
export const mockTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
    accent: '#007AFF',
    backgroundSecondary: '#F2F2F7',
    buttonText: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      bold: '700',
    },
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

// Mock tokens
export const mockTokens = {
  ...mockTheme,
  spacing: mockTheme.spacing,
  borderRadius: mockTheme.borderRadius,
  typography: mockTheme.typography,
  radius: mockTheme.radius,
};

// Mock useTheme hook
export const mockUseTheme = () => ({
  theme: mockTheme,
  tokens: mockTokens,
  themeMode: 'light' as const,
  isDark: false,
  isLight: true,
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
});

// Mock useAccessibility hook
export const mockUseAccessibility = () => ({
  isHighContrastEnabled: false,
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  isReduceTransparencyEnabled: false,
  isVoiceOverEnabled: false,
  isTalkBackEnabled: false,
  getAccessibilitySettings: jest.fn(() => ({
    highContrast: false,
    reduceMotion: false,
    screenReader: false,
    boldText: false,
    grayscale: false,
    invertColors: false,
    reduceTransparency: false,
  })),
  isAccessibilityEnabled: jest.fn(() => false),
  getAccessibilityAnnouncement: jest.fn(),
});

// Mock usePerformanceMonitor hook
export const mockUsePerformanceMonitor = () => ({
  recordComponentRender: jest.fn(() => jest.fn()),
  getMetrics: jest.fn(() => []),
  clearMetrics: jest.fn(),
  logMetrics: jest.fn(),
});

// Test utilities
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Mock AsyncStorage
export const mockAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
};

// Mock Firebase
export const mockFirebase = {
  auth: {
    signInAnonymously: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null,
  },
  firestore: {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    onSnapshot: jest.fn(),
  },
};

// Mock Expo modules
export const mockExpo = {
  font: {
    loadAsync: jest.fn(),
  },
  splashScreen: {
    hideAsync: jest.fn(),
  },
  statusBar: {
    setBarStyle: jest.fn(),
  },
  av: {
    Audio: {
      setAudioModeAsync: jest.fn(),
      Recording: {
        createAsync: jest.fn(),
        startAsync: jest.fn(),
        stopAndUnloadAsync: jest.fn(),
      },
    },
  },
  speech: {
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeakingAsync: jest.fn(),
  },
};

// Mock React Native Voice
export const mockVoice = {
  Voice: {
    onSpeechStart: jest.fn(),
    onSpeechEnd: jest.fn(),
    onSpeechResults: jest.fn(),
    onSpeechError: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn(),
  },
};

// Test setup helpers
export const setupTestEnvironment = () => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Setup default mock implementations
  mockAsyncStorage.getItem.mockResolvedValue(null);
  mockAsyncStorage.setItem.mockResolvedValue(undefined);
  mockAsyncStorage.removeItem.mockResolvedValue(undefined);
  mockAsyncStorage.clear.mockResolvedValue(undefined);
  mockAsyncStorage.getAllKeys.mockResolvedValue([]);
  mockAsyncStorage.multiGet.mockResolvedValue([]);
  mockAsyncStorage.multiSet.mockResolvedValue(undefined);
  mockAsyncStorage.multiRemove.mockResolvedValue(undefined);
  
  mockFirebase.auth.signInAnonymously.mockResolvedValue({ user: mockUser });
  mockFirebase.auth.onAuthStateChanged.mockImplementation((callback) => {
    callback(mockUser);
    return jest.fn(); // Return unsubscribe function
  });
  
  mockFirebase.firestore.collection.mockReturnValue({
    doc: jest.fn(),
    add: jest.fn(),
    get: jest.fn(),
    onSnapshot: jest.fn(),
  });
  
  mockFirebase.firestore.doc.mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    onSnapshot: jest.fn(),
  });
  
  mockFirebase.firestore.getDoc.mockResolvedValue({
    exists: () => true,
    data: () => ({}),
    id: 'test-doc-id',
  });
  
  mockFirebase.firestore.getDocs.mockResolvedValue({
    docs: [],
    empty: true,
    size: 0,
    forEach: jest.fn(),
  });
  
  mockFirebase.firestore.addDoc.mockResolvedValue({
    id: 'test-doc-id',
  });
  
  mockFirebase.firestore.updateDoc.mockResolvedValue(undefined);
  mockFirebase.firestore.deleteDoc.mockResolvedValue(undefined);
  
  mockExpo.font.loadAsync.mockResolvedValue(undefined);
  mockExpo.splashScreen.hideAsync.mockResolvedValue(undefined);
  mockExpo.statusBar.setBarStyle.mockImplementation(() => {});
  
  mockExpo.av.Audio.setAudioModeAsync.mockResolvedValue(undefined);
  mockExpo.av.Audio.Recording.createAsync.mockResolvedValue({
    status: { isRecording: false },
  });
  mockExpo.av.Audio.Recording.startAsync.mockResolvedValue(undefined);
  mockExpo.av.Audio.Recording.stopAndUnloadAsync.mockResolvedValue({
    status: { isRecording: false },
    sound: null,
  });
  
  mockExpo.speech.speak.mockResolvedValue(undefined);
  mockExpo.speech.stop.mockResolvedValue(undefined);
  mockExpo.speech.isSpeakingAsync.mockResolvedValue(false);
  
  mockVoice.Voice.start.mockResolvedValue(undefined);
  mockVoice.Voice.stop.mockResolvedValue(undefined);
  mockVoice.Voice.destroy.mockResolvedValue(undefined);
};

// Test cleanup helpers
export const cleanupTestEnvironment = () => {
  jest.clearAllMocks();
  jest.clearAllTimers();
};

// Mock user for tests
export const mockUser = createMockUser();

// Export test utilities
export default {
  render: customRender,
  createMockThoughtmark,
  createMockBin,
  createMockUser,
  mockNavigation,
  mockRoute,
  mockTheme,
  mockTokens,
  mockUseTheme,
  mockUseAccessibility,
  mockUsePerformanceMonitor,
  mockAsyncStorage,
  mockFirebase,
  mockExpo,
  mockVoice,
  setupTestEnvironment,
  cleanupTestEnvironment,
  waitFor,
  flushPromises,
};

// Add a simple test to satisfy Jest requirements
describe('Test Utils', () => {
  it('should have test utilities configured', () => {
    expect(createMockThoughtmark).toBeDefined();
    expect(createMockBin).toBeDefined();
    expect(createMockUser).toBeDefined();
    expect(mockNavigation).toBeDefined();
    expect(mockTheme).toBeDefined();
  });
}); 