import { ValidationSystem } from './ValidationSystem';
import { PerformanceMonitor } from './PerformanceMonitor';

// Mock PerformanceMonitor
jest.mock('./PerformanceMonitor', () => ({
  PerformanceMonitor: {
    getInstance: jest.fn(() => ({
      recordComponentMetrics: jest.fn(),
    })),
  },
}));

describe('ValidationSystem Integration', () => {
  let validationSystem: ValidationSystem;

  beforeEach(() => {
    validationSystem = ValidationSystem.getInstance();
    validationSystem.clearCache();
    jest.clearAllMocks();
  });

  it('should integrate with PerformanceMonitor', async () => {
    const mockPerformanceMonitor = {
      recordComponentMetrics: jest.fn(),
    };
    
    (PerformanceMonitor.getInstance as jest.Mock).mockReturnValue(mockPerformanceMonitor);

    // Mock successful network request
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await validationSystem.validateEnvironment();
    
    expect(result.isValid).toBe(true);
    expect(mockPerformanceMonitor.recordComponentMetrics).not.toHaveBeenCalled(); // Validation doesn't record component metrics
  });

  it('should handle validation in different environments', async () => {
    // Test with different network conditions
    const networkConditions = [
      { ok: true, status: 200 },
      { ok: false, status: 500 },
      { ok: false, status: 404 },
    ];

    for (const condition of networkConditions) {
      global.fetch = jest.fn().mockResolvedValue(condition);
      
      const result = await validationSystem.validateEnvironment();
      
      if (condition.ok) {
        expect(result.isValid).toBe(true);
      } else {
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      }
    }
  });

  it('should handle rapid successive validations', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    // Perform rapid successive validations
    const startTime = Date.now();
    const promises = Array(10).fill(0).map(() => 
      validationSystem.validateEnvironment()
    );

    const results = await Promise.all(promises);
    const endTime = Date.now();

    // All should succeed
    results.forEach(result => {
      expect(result.isValid).toBe(true);
    });

    // Should complete quickly due to caching
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('should handle validation with performance monitoring', async () => {
    const mockRecordMetrics = jest.fn();
    const mockPerformanceMonitor = {
      recordComponentMetrics: mockRecordMetrics,
    };
    
    (PerformanceMonitor.getInstance as jest.Mock).mockReturnValue(mockPerformanceMonitor);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await validationSystem.validateEnvironment();
    
    expect(result.isValid).toBe(true);
    expect(result.duration).toBeGreaterThan(0);
  });
}); 