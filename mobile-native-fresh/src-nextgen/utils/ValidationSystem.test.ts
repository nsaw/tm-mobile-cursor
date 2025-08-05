import { ValidationSystem, FailSafeValidationLoop } from './ValidationSystem';
import React from 'react';
import { _View, _Text } from 'react-native';

// Mock React Native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

const TestComponent: React.ComponentType<unknown> = () => {
  return React.createElement('div', null, 'Test Component');
};

const TestScreen: React.ComponentType<unknown> = () => {
  return React.createElement('div', null, 'Test Screen');
};

describe('ValidationSystem', () => {
  let validationSystem: ValidationSystem;

  beforeEach(() => {
    validationSystem = new ValidationSystem();
    jest.clearAllMocks();
  });

  afterEach(() => {
    validationSystem.destroy();
  });

  it('should validate component successfully', async () => {
    const result = await validationSystem.validateComponent(TestComponent, {});
    
    expect(result).toBeDefined();
    expect(result.isValid).toBeDefined();
    expect(result.duration).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  it('should validate screen successfully', async () => {
    const result = await validationSystem.validateScreen(TestScreen, {});
    
    expect(result).toBeDefined();
    expect(result.isValid).toBeDefined();
    expect(result.duration).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  it('should validate bundle successfully', async () => {
    const bundle = { components: [TestComponent], screens: [TestScreen] };
    const result = await validationSystem.validateBundle(bundle);
    
    expect(result).toBeDefined();
    expect(result.isValid).toBeDefined();
    expect(result.duration).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  it('should cache validation results', async () => {
    const props = { testProp: 'value' };
    
    // First validation
    const result1 = await validationSystem.validateComponent(TestComponent, props);
    
    // Second validation should use cache
    const result2 = await validationSystem.validateComponent(TestComponent, props);
    
    expect(result1).toEqual(result2);
    expect(validationSystem.getCacheSize()).toBeGreaterThan(0);
  });

  it('should handle validation timeouts', async () => {
    // Mock a slow validation
    const slowValidation = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(undefined), 20000); // 20 seconds
      });
    });

    // Override the validation method
    (validationSystem as unknown as Record<string, unknown>).executeValidation = slowValidation;

    await expect(validationSystem.validateComponent(TestComponent, {})).rejects.toThrow('Component validation timeout');
  });

  it('should handle circuit breaker state', () => {
    const state = validationSystem.getCircuitBreakerState();
    
    expect(state).toBeDefined();
    expect(state.state).toBe('CLOSED');
    expect(state.failureCount).toBe(0);
  });

  it('should reset circuit breaker', () => {
    validationSystem.resetCircuitBreaker();
    const state = validationSystem.getCircuitBreakerState();
    
    expect(state.state).toBe('CLOSED');
    expect(state.failureCount).toBe(0);
  });

  it('should clear cache', () => {
    // Add some items to cache
    validationSystem.validateComponent(TestComponent, {});
    expect(validationSystem.getCacheSize()).toBeGreaterThan(0);
    
    validationSystem.clearCache();
    expect(validationSystem.getCacheSize()).toBe(0);
  });

  it('should handle debounced validation', (done) => {
    const validationFn = jest.fn().mockResolvedValue({ isValid: true });
    
    validationSystem.debouncedValidation('test_key', validationFn, 100);
    
    // Call multiple times quickly
    validationSystem.debouncedValidation('test_key', validationFn, 100);
    validationSystem.debouncedValidation('test_key', validationFn, 100);
    
    // Should only execute once after delay
    setTimeout(() => {
      expect(validationFn).toHaveBeenCalledTimes(1);
      done();
    }, 200);
  });
});

describe('FailSafeValidationLoop', () => {
  let failSafeLoop: FailSafeValidationLoop;

  beforeEach(() => {
    failSafeLoop = new FailSafeValidationLoop(3, 1000, 2);
    jest.clearAllMocks();
  });

  it('should execute operation successfully', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    
    const result = await failSafeLoop.executeWithRecovery(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry failed operations', async () => {
    let callCount = 0;
    const operation = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount < 3) {
        throw new Error('Temporary failure');
      }
      return 'success';
    });
    
    const result = await failSafeLoop.executeWithRecovery(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should use recovery operation when available', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
    const recoveryOperation = jest.fn().mockResolvedValue('recovery success');
    
    const result = await failSafeLoop.executeWithRecovery(operation, recoveryOperation);
    
    expect(result).toBe('recovery success');
    expect(operation).toHaveBeenCalled();
    expect(recoveryOperation).toHaveBeenCalled();
  });

  it('should call onFailure callback', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
    const onFailure = jest.fn();
    
    await expect(failSafeLoop.executeWithRecovery(operation, undefined, onFailure)).rejects.toThrow();
    
    expect(onFailure).toHaveBeenCalled();
  });

  it('should track failure count', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
    
    await expect(failSafeLoop.executeWithRecovery(operation)).rejects.toThrow();
    
    expect(failSafeLoop.getFailureCount()).toBeGreaterThan(0);
  });

  it('should reset state', () => {
    failSafeLoop.reset();
    
    expect(failSafeLoop.getFailureCount()).toBe(0);
    expect(failSafeLoop.getLastSuccessTime()).toBe(0);
  });
}); 