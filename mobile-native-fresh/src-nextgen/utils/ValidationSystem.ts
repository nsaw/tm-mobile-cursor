import * as React from 'react';
import { Platform } from 'react-native';

// Circuit breaker implementation for async operations
interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  timeout: number;
  threshold: number;
}

class CircuitBreaker {
  private state: CircuitBreakerState;
  private readonly timeout: number;
  private readonly threshold: number;

  constructor(timeout = 60000, threshold = 5) {
    this.timeout = timeout;
    this.threshold = threshold;
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      timeout: this.timeout,
      threshold: this.threshold,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state.state === 'OPEN') {
      if (Date.now() - this.state.lastFailureTime > this.timeout) {
        this.state.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.state.failureCount = 0;
    this.state.state = 'CLOSED';
  }

  private onFailure(): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    if (this.state.failureCount >= this.threshold) {
      this.state.state = 'OPEN';
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }

  reset(): void {
    this.state = {
      state: 'CLOSED',
      failureCount: 0,
      lastFailureTime: 0,
      timeout: this.timeout,
      threshold: this.threshold,
    };
  }
}

// Retry mechanism with exponential backoff
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

class RetryMechanism {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 10000,
      backoffMultiplier: config.backoffMultiplier || 2,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === this.config.maxAttempts) {
          break;
        }

        const delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
          this.config.maxDelay
        );

        await new Promise<void>(resolve => setTimeout(resolve, delay));
      }
    }

    if (lastError) {
      throw lastError;
    }
    throw new Error('Validation failed after all retry attempts');
  }
}

// Result caching with TTL
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

class ResultCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private readonly defaultTTL: number;

  constructor(defaultTTL = 300000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

class TimeoutManager {
  private timeouts: Map<string, ReturnType<typeof setTimeout>> = new Map();

  setTimeout(key: string, callback: () => void, delay: number): void {
    this.clearTimeout(key);
    const timeoutId = setTimeout(() => {
      callback();
      this.timeouts.delete(key);
    }, delay);
    this.timeouts.set(key, timeoutId);
  }

  clearTimeout(key: string): void {
    const timeoutId = this.timeouts.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(key);
    }
  }

  clearAll(): void {
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeouts.clear();
  }
}

class DebounceManager {
  private debounceTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  debounce(key: string, callback: () => void, delay: number): void {
    this.clearDebounce(key);
    const timerId = setTimeout(() => {
      callback();
      this.debounceTimers.delete(key);
    }, delay);
    this.debounceTimers.set(key, timerId);
  }

  clearDebounce(key: string): void {
    const timerId = this.debounceTimers.get(key);
    if (timerId) {
      clearTimeout(timerId);
      this.debounceTimers.delete(key);
    }
  }

  clearAll(): void {
    this.debounceTimers.forEach(timerId => clearTimeout(timerId));
    this.debounceTimers.clear();
  }
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duration?: number;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export class ValidationSystem {
  private circuitBreaker: CircuitBreaker;
  private retryMechanism: RetryMechanism;
  private resultCache: ResultCache<ValidationResult>;
  private timeoutManager: TimeoutManager;
  private debounceManager: DebounceManager;
  private validationQueue: Array<() => Promise<ValidationResult>> = [];
  private isProcessing = false;

  public get validateQueue(): number {
    return this.validationQueue.length;
  }

  public async validateWithTimeout<T>(
    operation: () => Promise<T>,
    timeout = 5000
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, timeout);

      operation()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  constructor() {
    this.circuitBreaker = new CircuitBreaker();
    this.retryMechanism = new RetryMechanism();
    this.resultCache = new ResultCache<ValidationResult>();
    this.timeoutManager = new TimeoutManager();
    this.debounceManager = new DebounceManager();
  }

  async validateComponent(component: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    const cacheKey = `component:${component.name}:${JSON.stringify(props)}`;
    const cached = this.resultCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.circuitBreaker.execute(() => 
      this.performComponentValidation(component, props)
    );

    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performComponentValidation(component: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executeValidation(component, props);
      result.duration = Date.now() - startTime;
      result.timestamp = Date.now();
      return result;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation failed: ${(error as Error).message}`],
        warnings: [],
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
  }

  async validateScreen(screen: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    const cacheKey = `screen:${screen.name}:${JSON.stringify(props)}`;
    const cached = this.resultCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.circuitBreaker.execute(() => 
      this.performScreenValidation(screen, props)
    );

    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performScreenValidation(screen: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executeScreenValidation(screen, props);
      result.duration = Date.now() - startTime;
      result.timestamp = Date.now();
      return result;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Screen validation failed: ${(error as Error).message}`],
        warnings: [],
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
  }

  async validateBundle(bundle: Record<string, unknown>): Promise<ValidationResult> {
    const cacheKey = `bundle:${JSON.stringify(bundle)}`;
    const cached = this.resultCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.circuitBreaker.execute(() => 
      this.performBundleValidation(bundle)
    );

    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performBundleValidation(bundle: Record<string, unknown>): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.executeBundleValidation(bundle);
      result.duration = Date.now() - startTime;
      result.timestamp = Date.now();
      return result;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Bundle validation failed: ${(error as Error).message}`],
        warnings: [],
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    }
  }

  private async executeValidation(component: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic component validation
      if (!component) {
        errors.push('Component is required');
      }

      // Props validation
      if (props && typeof props !== 'object') {
        errors.push('Props must be an object');
      }

      // Platform-specific validation
      if (Platform.OS === 'ios') {
        // iOS-specific validation logic
        if (props?.style && typeof props.style !== 'object') {
          warnings.push('Style prop should be an object on iOS');
        }
      } else if (Platform.OS === 'android') {
        // Android-specific validation logic
        if (props?.accessibilityLabel && typeof props.accessibilityLabel !== 'string') {
          warnings.push('Accessibility label should be a string on Android');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metadata: {
          platform: Platform.OS,
          componentName: component.name || 'Anonymous',
          propsKeys: props ? Object.keys(props) : [],
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${(error as Error).message}`],
        warnings: [],
        metadata: {
          error: (error as Error).message,
          stack: (error as Error).stack,
        },
      };
    }
  }

  private async executeScreenValidation(screen: React.ComponentType<unknown>, props: Record<string, unknown>): Promise<ValidationResult> {
    try {
      // Screen-specific validation
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!screen) {
        errors.push('Screen component is required');
      }

      // Validate screen props
      if (props && typeof props !== 'object') {
        errors.push('Screen props must be an object');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metadata: {
          screenName: screen.name || 'Anonymous',
          propsKeys: props ? Object.keys(props) : [],
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Screen validation error: ${(error as Error).message}`],
        warnings: [],
        metadata: {
          error: (error as Error).message,
        },
      };
    }
  }

  private async executeBundleValidation(bundle: Record<string, unknown>): Promise<ValidationResult> {
    try {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Bundle structure validation
      if (!bundle || typeof bundle !== 'object') {
        errors.push('Bundle must be an object');
        return {
          isValid: false,
          errors,
          warnings,
        };
      }

      // Validate bundle keys
      const requiredKeys = ['version', 'components', 'screens'];
      for (const key of requiredKeys) {
        if (!(key in bundle)) {
          errors.push(`Bundle missing required key: ${key}`);
        }
      }

      // Validate bundle version
      if (bundle.version && typeof bundle.version !== 'string') {
        warnings.push('Bundle version should be a string');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        metadata: {
          bundleKeys: Object.keys(bundle),
          hasVersion: 'version' in bundle,
          hasComponents: 'components' in bundle,
          hasScreens: 'screens' in bundle,
        },
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Bundle validation error: ${(error as Error).message}`],
        warnings: [],
        metadata: {
          error: (error as Error).message,
        },
      };
    }
  }

  async queueValidation(validationFn: () => Promise<ValidationResult>): Promise<void> {
    this.validationQueue.push(validationFn);
    
    if (!this.isProcessing) {
      await this.processValidationQueue();
    }
  }

  private async processValidationQueue(): Promise<void> {
    if (this.isProcessing || this.validationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.validationQueue.length > 0) {
        const validationFn = this.validationQueue.shift();
        if (validationFn) {
          await this.retryMechanism.execute(validationFn);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  debouncedValidation(key: string, validationFn: () => Promise<ValidationResult>, delay = 500): void {
    this.debounceManager.debounce(key, async () => {
      try {
        await validationFn();
      } catch (error) {
        console.error('Debounced validation failed:', error);
      }
    }, delay);
  }

  getCircuitBreakerState(): CircuitBreakerState {
    return this.circuitBreaker.getState();
  }

  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  getCacheSize(): number {
    return this.resultCache.size();
  }

  clearCache(): void {
    this.resultCache.clear();
  }

  destroy(): void {
    this.timeoutManager.clearAll();
    this.debounceManager.clearAll();
    this.validationQueue.length = 0;
    this.isProcessing = false;
  }
}

export class FailSafeValidationLoop {
  private circuitBreaker: CircuitBreaker;
  private retryMechanism: RetryMechanism;
  private maxConsecutiveFailures: number;
  private failureCount = 0;
  private lastSuccessTime = 0;

  constructor(
    maxConsecutiveFailures = 5,
    circuitBreakerTimeout = 60000,
    circuitBreakerThreshold = 3
  ) {
    this.maxConsecutiveFailures = maxConsecutiveFailures;
    this.circuitBreaker = new CircuitBreaker(circuitBreakerTimeout, circuitBreakerThreshold);
    this.retryMechanism = new RetryMechanism();
  }

  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    recoveryOperation?: () => Promise<T>,
    onFailure?: (error: Error, attempt: number) => void
  ): Promise<T> {
    try {
      const result = await this.circuitBreaker.execute(() => 
        this.retryMechanism.execute(operation)
      );
      
      this.failureCount = 0;
      this.lastSuccessTime = Date.now();
      
      return result;
    } catch (error) {
      this.failureCount++;
      
      if (onFailure) {
        onFailure(error as Error, this.failureCount);
      }

      if (this.failureCount >= this.maxConsecutiveFailures) {
        console.error('Max consecutive failures reached, attempting recovery...');
        
        if (recoveryOperation) {
          try {
            return await recoveryOperation();
          } catch (recoveryError) {
            console.error('Recovery operation failed:', recoveryError);
            throw recoveryError;
          }
        }
      }

      throw error;
    }
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  getLastSuccessTime(): number {
    return this.lastSuccessTime;
  }

  reset(): void {
    this.failureCount = 0;
    this.lastSuccessTime = 0;
    this.circuitBreaker.reset();
  }
} 