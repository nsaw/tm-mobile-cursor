import { Platform } from 'react-native';

import { ValidationSystem, ValidationErrorType } from './ValidationSystem';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

// Mock PerformanceMonitor
const mockPerformanceMonitor = {
  getInstance: jest.fn(() => ({
    recordComponentMetrics: jest.fn(),
    recordPerformanceMark: jest.fn(),
    recordPerformanceMeasure: jest.fn(),
    getMetrics: jest.fn(() => ({})),
    clearMetrics: jest.fn(),
    isEnabled: jest.fn(() => true),
    enable: jest.fn(),
    disable: jest.fn(),
  })),
};

jest.mock('./PerformanceMonitor', () => ({
  PerformanceMonitor: mockPerformanceMonitor,
}));

describe('ValidationSystem', () => {
  let validationSystem: ValidationSystem;

  beforeEach(() => {
    validationSystem = ValidationSystem.getInstance();
    validationSystem.clearCache();
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockPerformanceMonitor.getInstance.mockClear();
  });

  it('should be a singleton', () => {
    const instance1 = ValidationSystem.getInstance();
    const instance2 = ValidationSystem.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should validate environment successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const result = await validationSystem.validateEnvironment();
    
    console.log('Validation result:', JSON.stringify(result, null, 2));
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should handle network validation failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));

    const result = await validationSystem.validateEnvironment();
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe(ValidationErrorType.NETWORK);
    expect(result.warnings).toContain('Network connectivity may be limited');
  });

  it('should handle timeout errors', async () => {
    // Mock a slow network request that times out
    mockFetch.mockImplementationOnce(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
      )
    );

    const result = await validationSystem.validateEnvironment();
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe(ValidationErrorType.TIMEOUT);
  }, 15000); // Increase timeout for this test

  it('should retry failed validations', async () => {
    let callCount = 0;
    mockFetch.mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        return Promise.reject(new Error('network'));
      }
      return Promise.resolve({ ok: true, status: 200 });
    });

    const result = await validationSystem.validateEnvironment();
    
    expect(callCount).toBeGreaterThan(1);
    expect(result.isValid).toBe(true);
  }, 15000); // Increase timeout for retry logic

  it('should cache validation results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    // First validation
    const result1 = await validationSystem.validateEnvironment();
    
    // Second validation should use cache
    const result2 = await validationSystem.validateEnvironment();
    
    expect(result1).toEqual(result2);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle platform compatibility validation', async () => {
    // Test with supported platform
    (Platform.OS as any) = 'ios';
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
    });
    
    const result = await validationSystem.validateEnvironment();
    
    // Should not have platform compatibility errors
    const platformErrors = result.errors.filter(
      error => error.message.includes('Platform compatibility')
    );
    expect(platformErrors).toHaveLength(0);
  });

  it('should handle unsupported platform', async () => {
    // Test with unsupported platform
    (Platform.OS as any) = 'unsupported';
    
    const result = await validationSystem.validateEnvironment();
    
    expect(result.isValid).toBe(false);
    const platformErrors = result.errors.filter(
      error => error.message.includes('Platform compatibility')
    );
    expect(platformErrors).toHaveLength(1);
  });

  it('should provide validation statistics', () => {
    const stats = validationSystem.getValidationStats();
    
    expect(stats).toHaveProperty('totalErrors');
    expect(stats).toHaveProperty('errorBreakdown');
    expect(stats).toHaveProperty('cacheSize');
    expect(stats).toHaveProperty('activeValidations');
    expect(stats.totalErrors).toBe(0);
    expect(stats.cacheSize).toBe(0);
  });

  it('should handle concurrent validations', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
    });

    // Start multiple concurrent validations
    const promises = Array(5).fill(0).map(() => 
      validationSystem.validateEnvironment()
    );
    
    const results = await Promise.all(promises);
    
    // All should succeed
    results.forEach(result => {
      expect(result.isValid).toBe(true);
    });
    
    // Should only make one network request due to caching
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle validation system destruction', () => {
    expect(() => validationSystem.destroy()).not.toThrow();
  });
});

describe('ValidationErrorType', () => {
  it('should have all required error types', () => {
    expect(ValidationErrorType.NETWORK).toBe('network');
    expect(ValidationErrorType.TIMEOUT).toBe('timeout');
    expect(ValidationErrorType.PLATFORM).toBe('platform');
    expect(ValidationErrorType.UNKNOWN).toBe('unknown');
  });
}); 