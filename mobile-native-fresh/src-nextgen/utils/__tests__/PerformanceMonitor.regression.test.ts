import { PerformanceMonitor } from '../PerformanceMonitor';

describe('PerformanceMonitor Regression Tests', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
  });

  test('private method access should be properly encapsulated', () => {
    expect(() => monitor['getCurrentMemoryUsage']).toThrow();
  });

  test('public methods should be accessible', () => {
    expect(typeof monitor.startMonitoring).toBe('function');
    expect(typeof monitor.stopMonitoring).toBe('function');
  });

  test('setTimeout Promise typing should not cause errors', async () => {
    const result = await monitor.measureAsyncOperation(async () => {
      await new Promise<void>(resolve => setTimeout(resolve, 10));
      return 'test';
    });
    expect(result).toBe('test');
  });
}); 