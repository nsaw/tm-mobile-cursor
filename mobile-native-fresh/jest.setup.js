/* Keep Jest fast/stable for RN */
global.jest = global.jest || {};
global.jest.setTimeout = global.jest.setTimeout || (() => {});

// TurboModuleRegistry stub (already in place)
global.jest.mock = global.jest.mock || (() => {});

// Platform mock to stop OS checks from blowing up
global.jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: objs => ('ios' in objs ? objs.ios : objs.default)
}));

// PerformanceMonitor stub with proper cleanup
global.performanceMonitor = { 
  current: { 
    recordComponentMetrics: () => {},
    destroy: () => {},
    cleanupIntervals: () => {}
  } 
}; 