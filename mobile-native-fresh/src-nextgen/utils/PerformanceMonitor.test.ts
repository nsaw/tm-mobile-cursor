import { Platform } from 'react-native';

import { PerformanceMonitor, establishPerformanceBaseline, detectPerformanceRegression } from './PerformanceMonitor';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
};

global.performance = mockPerformance;

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = PerformanceMonitor.getInstance();
    const instance2 = PerformanceMonitor.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should record component metrics', () => {
    monitor.recordComponentMetrics('TestComponent', 100, 'nextgen');
    const report = monitor.getPerformanceReport();
    expect(report.currentMetrics.length).toBeGreaterThan(0);
  });

  it('should record screen metrics', () => {
    monitor.recordScreenMetrics('TestScreen', 200, 'nextgen');
    const report = monitor.getPerformanceReport();
    expect(report.currentMetrics.length).toBeGreaterThan(0);
  });

  it('should establish baseline', () => {
    monitor.recordComponentMetrics('TestComponent', 100, 'legacy');
    monitor.recordComponentMetrics('TestComponent', 110, 'nextgen');
    const baseline = monitor.establishBaseline();
    expect(baseline.legacy).toBeDefined();
    expect(baseline.nextgen).toBeDefined();
  });

  it('should check performance targets', () => {
    monitor.recordComponentMetrics('TestComponent', 100, 'nextgen');
    const result = monitor.checkPerformanceTargets('nextgen');
    expect(result.passed).toBeDefined();
    expect(result.violations).toBeDefined();
  });

  it('should handle performance API unavailability gracefully', () => {
    // Mock Platform.OS to simulate web environment without Performance API
    (Platform.OS as any) = 'web';
    
    // This should not throw an error
    expect(() => {
      monitor.recordComponentMetrics('TestComponent', 100, 'nextgen');
    }).not.toThrow();
  });

  it('should detect memory leaks', () => {
    // Simulate increasing memory usage
    for (let i = 0; i < 5; i++) {
      monitor.metrics.push({
        componentName: 'TestComponent',
        context: 'component',
        renderTime: 100,
        mountTime: Date.now(),
        memoryUsage: 1000 + i * 100, // Increasing memory usage
        bundleSize: 1000,
        startupTime: 1000,
        dualMountOverhead: 0,
        timestamp: Date.now() + i * 1000,
        environment: 'nextgen' as const,
      });
    }

    // The last 3 entries should trigger memory leak detection
    const hasLeak = monitor['detectMemoryLeak'](1400);
    expect(hasLeak).toBe(true);
  });

  it('should not detect memory leaks for stable usage', () => {
    // Simulate stable memory usage
    for (let i = 0; i < 5; i++) {
      monitor.metrics.push({
        componentName: 'TestComponent',
        context: 'component',
        renderTime: 100,
        mountTime: Date.now(),
        memoryUsage: 1000, // Stable memory usage
        bundleSize: 1000,
        startupTime: 1000,
        dualMountOverhead: 0,
        timestamp: Date.now() + i * 1000,
        environment: 'nextgen' as const,
      });
    }

    const hasLeak = monitor['detectMemoryLeak'](1000);
    expect(hasLeak).toBe(false);
  });

  it('should cleanup intervals on destroy', () => {
    // Start monitoring to create intervals
    monitor['monitorRenderPerformance']();
    monitor['monitorMemoryUsage']();

    // Mock clearInterval
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    // Destroy monitor
    monitor.destroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

describe('establishPerformanceBaseline', () => {
  it('should establish performance baseline', async () => {
    const baseline = await establishPerformanceBaseline();
    
    expect(baseline).toHaveProperty('renderTime');
    expect(baseline).toHaveProperty('memoryUsage');
    expect(baseline).toHaveProperty('bundleSize');
    expect(baseline).toHaveProperty('startupTime');
    expect(baseline).toHaveProperty('dualMountOverhead');
    expect(baseline).toHaveProperty('timestamp');
  });

  it('should handle errors gracefully', async () => {
    // Mock performance.now to throw error
    const originalNow = global.performance.now;
    global.performance.now = jest.fn(() => {
      throw new Error('Performance API error');
    });

    const baseline = await establishPerformanceBaseline();
    
    expect(baseline.renderTime).toBe(0);
    expect(baseline.memoryUsage).toBe(0);
    
    // Restore original
    global.performance.now = originalNow;
  });
});

describe('detectPerformanceRegression', () => {
  it('should detect performance regression', () => {
    const baseline = {
      renderTime: 100,
      memoryUsage: 1000,
      bundleSize: 1000,
      startupTime: 1000,
      dualMountOverhead: 0,
      timestamp: Date.now(),
    };

    const currentMetrics = {
      componentName: 'TestComponent',
      context: 'component',
      renderTime: 150, // 50% increase
      mountTime: Date.now(),
      memoryUsage: 1200, // 20% increase
      bundleSize: 1000,
      startupTime: 1000,
      dualMountOverhead: 0,
      timestamp: Date.now(),
      environment: 'nextgen' as const,
    };

    const report = detectPerformanceRegression(currentMetrics, baseline, 0.2);
    
    expect(report.hasRegression).toBe(true);
    expect(report.regressions.length).toBeGreaterThan(0);
    expect(report.regressions[0].metric).toBe('renderTime');
    expect(report.regressions[0].degradation).toBe(50);
  });

  it('should not detect regression for acceptable performance', () => {
    const baseline = {
      renderTime: 100,
      memoryUsage: 1000,
      bundleSize: 1000,
      startupTime: 1000,
      dualMountOverhead: 0,
      timestamp: Date.now(),
    };

    const currentMetrics = {
      componentName: 'TestComponent',
      context: 'component',
      renderTime: 110, // 10% increase (within threshold)
      mountTime: Date.now(),
      memoryUsage: 1050, // 5% increase (within threshold)
      bundleSize: 1000,
      startupTime: 1000,
      dualMountOverhead: 0,
      timestamp: Date.now(),
      environment: 'nextgen' as const,
    };

    const report = detectPerformanceRegression(currentMetrics, baseline, 0.2);
    
    expect(report.hasRegression).toBe(false);
    expect(report.regressions.length).toBe(0);
  });

  it('should handle errors gracefully', () => {
    const report = detectPerformanceRegression(null as any, null as any);
    
    expect(report.hasRegression).toBe(false);
    expect(report.regressions.length).toBe(0);
  });
}); 