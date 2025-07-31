/* Jest global mocks & timer cleanup */
import '@testing-library/jest-native/extend-expect';

// TurboModuleRegistry stub (already in place)
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: () => ({}),
  get: () => ({})
}));

// Platform mock to stop OS checks from blowing up
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: objs => ('ios' in objs ? objs.ios : objs.default)
}));

// AsyncStorage mock already mapped via moduleNameMapper above

// PerformanceMonitor stub with proper cleanup
global.performanceMonitor = { 
  current: { 
    recordComponentMetrics: jest.fn(),
    destroy: jest.fn(),
    cleanupIntervals: jest.fn()
  } 
};

// Mock PerformanceMonitor to prevent timer creation in tests
jest.mock('../src-nextgen/utils/PerformanceMonitor', () => ({
  PerformanceMonitor: {
    getInstance: () => ({
      recordComponentMetrics: jest.fn(),
      destroy: jest.fn(),
      cleanupIntervals: jest.fn(),
      clearMetrics: jest.fn(),
      getMetrics: () => [],
      logMetrics: jest.fn()
    })
  },
  usePerformanceMonitor: () => ({
    recordComponentRender: jest.fn(() => jest.fn()),
    getMetrics: () => [],
    clearMetrics: jest.fn(),
    logMetrics: jest.fn()
  }),
  withPerformanceMonitoring: (Component) => Component
}));

beforeEach(() => {
  jest.useFakeTimers();
  
  // Clear any existing PerformanceMonitor instances
  if (global.performanceMonitor?.current?.destroy) {
    global.performanceMonitor.current.destroy();
  }
});

afterEach(() => {
  // Clear all timers and intervals
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  
  // Ensure PerformanceMonitor cleanup
  if (global.performanceMonitor?.current?.cleanupIntervals) {
    global.performanceMonitor.current.cleanupIntervals();
  }
  
  // Clear console to prevent "Cannot log after tests are done" errors
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // Final cleanup
  if (global.performanceMonitor?.current?.destroy) {
    global.performanceMonitor.current.destroy();
  }
}); 