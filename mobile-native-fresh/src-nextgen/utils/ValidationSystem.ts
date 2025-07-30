import { Platform } from 'react-native';
import React from 'react';

import performanceMonitor from './PerformanceMonitor';

// Circuit breaker implementation for async operations
interface CircuitBreakerState {
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  lastFailureTime: number;
  timeout: number;
  threshold: number;
}

class _CircuitBreaker {
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

class _RetryMechanism {
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
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === this.config.maxAttempts) {
          throw lastError;
        }

        const delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
          this.config.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

// Result caching for bundle stability
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
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

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

// Timeout and debounce logic
class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  setTimeout(key: string, callback: () => void, delay: number): void {
    this.clearTimeout(key);
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(key);
    }, delay);
    this.timeouts.set(key, timeout);
  }

  clearTimeout(key: string): void {
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(key);
    }
  }

  clearAll(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

class DebounceManager {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  debounce(key: string, callback: () => void, delay: number): void {
    this.clearDebounce(key);
    const timer = setTimeout(() => {
      callback();
      this.debounceTimers.delete(key);
    }, delay);
    this.debounceTimers.set(key, timer);
  }

  clearDebounce(key: string): void {
    const timer = this.debounceTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(key);
    }
  }

  clearAll(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
  }
}

export enum ValidationErrorType {
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  PERMISSION = 'permission',
  INVALID_DATA = 'invalid_data',
  PLATFORM = 'platform',
  UNKNOWN = 'unknown',
}

export interface ValidationError {
  type: ValidationErrorType;
  message: string;
  code?: string;
  retryable: boolean;
  timestamp: number;
  context?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
  timestamp: number;
  duration: number;
  retryCount: number;
  fallbackUsed: boolean;
}

export class ValidationSystem {
  private static instance: ValidationSystem;
  private validationCache: Map<string, ValidationResult>;
  private activeValidations: Set<string>;
  private validationQueue: Array<() => Promise<void>>;
  private isProcessing = false;
  private performanceMonitor: typeof performanceMonitor;
  private errorCount: Map<ValidationErrorType, number>;
  private retryCount: Map<string, number>;
  private fallbackValidations: Map<string, () => Promise<ValidationResult>>;
  private circuitBreaker: _CircuitBreaker;
  private retryMechanism: _RetryMechanism;
  private resultCache: ResultCache<any>;
  private timeoutManager: TimeoutManager;
  private debounceManager: DebounceManager;

  private constructor() {
    this.validationCache = new Map();
    this.activeValidations = new Set();
    this.validationQueue = [];
    this.performanceMonitor = performanceMonitor;
    this.errorCount = new Map();
    this.retryCount = new Map();
    this.fallbackValidations = new Map();
    this.circuitBreaker = new _CircuitBreaker(30000, 3); // 30s timeout, 3 failures
    this.retryMechanism = new _RetryMechanism({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      backoffMultiplier: 2,
    });
    this.resultCache = new ResultCache(300000); // 5 minutes TTL
    this.timeoutManager = new TimeoutManager();
    this.debounceManager = new DebounceManager();
  }

  public static getInstance(): ValidationSystem {
    if (!ValidationSystem.instance) {
      ValidationSystem.instance = new ValidationSystem();
    }
    return ValidationSystem.instance;
  }

  public async validateComponent(component: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    const cacheKey = `component_${component.name}_${JSON.stringify(props)}`;
    
    // Check cache first
    const cachedResult = this.resultCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Use circuit breaker with retry mechanism
    const result = await this.circuitBreaker.execute(async () => {
      return await this.retryMechanism.execute(async () => {
        return await this.performComponentValidation(component, props);
      });
    });

    // Cache the result
    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performComponentValidation(component: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Set timeout for validation
      const validationPromise = this.executeValidation(component, props);
      const timeoutPromise = new Promise<never>((_, reject) => {
        this.timeoutManager.setTimeout('component_validation', () => {
          reject(new Error('Component validation timeout'));
        }, 10000); // 10 second timeout
      });

      const result = await Promise.race([validationPromise, timeoutPromise]);
      
      // Clear timeout
      this.timeoutManager.clearTimeout('component_validation');
      
      return {
        ...result,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.timeoutManager.clearTimeout('component_validation');
      throw error;
    }
  }

  public async validateScreen(screen: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    const cacheKey = `screen_${screen.name}_${JSON.stringify(props)}`;
    
    // Check cache first
    const cachedResult = this.resultCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Use circuit breaker with retry mechanism
    const result = await this.circuitBreaker.execute(async () => {
      return await this.retryMechanism.execute(async () => {
        return await this.performScreenValidation(screen, props);
      });
    });

    // Cache the result
    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performScreenValidation(screen: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Set timeout for validation
      const validationPromise = this.executeScreenValidation(screen, props);
      const timeoutPromise = new Promise<never>((_, reject) => {
        this.timeoutManager.setTimeout('screen_validation', () => {
          reject(new Error('Screen validation timeout'));
        }, 15000); // 15 second timeout
      });

      const result = await Promise.race([validationPromise, timeoutPromise]);
      
      // Clear timeout
      this.timeoutManager.clearTimeout('screen_validation');
      
      return {
        ...result,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.timeoutManager.clearTimeout('screen_validation');
      throw error;
    }
  }

  public async validateBundle(bundle: any): Promise<ValidationResult> {
    const cacheKey = `bundle_${JSON.stringify(bundle)}`;
    
    // Check cache first
    const cachedResult = this.resultCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Use circuit breaker with retry mechanism
    const result = await this.circuitBreaker.execute(async () => {
      return await this.retryMechanism.execute(async () => {
        return await this.performBundleValidation(bundle);
      });
    });

    // Cache the result
    this.resultCache.set(cacheKey, result);
    return result;
  }

  private async performBundleValidation(bundle: any): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      // Set timeout for validation
      const validationPromise = this.executeBundleValidation(bundle);
      const timeoutPromise = new Promise<never>((_, reject) => {
        this.timeoutManager.setTimeout('bundle_validation', () => {
          reject(new Error('Bundle validation timeout'));
        }, 30000); // 30 second timeout
      });

      const result = await Promise.race([validationPromise, timeoutPromise]);
      
      // Clear timeout
      this.timeoutManager.clearTimeout('bundle_validation');
      
      return {
        ...result,
        duration: Date.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      this.timeoutManager.clearTimeout('bundle_validation');
      throw error;
    }
  }

  // Queue-based validation for batch processing
  async queueValidation(validationFn: () => Promise<ValidationResult>): Promise<void> {
    this.validationQueue.push(validationFn);
    
    if (!this.isProcessing) {
      this.processValidationQueue();
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
          try {
            await validationFn();
          } catch (error) {
            console.error('Validation in queue failed:', error);
          }
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  // Debounced validation for frequent updates
  debouncedValidation(key: string, validationFn: () => Promise<ValidationResult>, delay = 500): void {
    this.debounceManager.debounce(key, async () => {
      try {
        await validationFn();
      } catch (error) {
        console.error('Debounced validation failed:', error);
      }
    }, delay);
  }

  // Circuit breaker status
  getCircuitBreakerState(): CircuitBreakerState {
    return this.circuitBreaker.getState();
  }

  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  // Cache management
  getCacheSize(): number {
    return this.resultCache.size();
  }

  clearCache(): void {
    this.resultCache.clear();
  }

  // Cleanup
  destroy(): void {
    this.timeoutManager.clearAll();
    this.debounceManager.clearAll();
    this.validationQueue = [];
    this.isProcessing = false;
  }

  public async validateEnvironment(): Promise<ValidationResult> {
    const validationId = 'environment_validation';
    
    if (this.activeValidations.has(validationId)) {
      return this.waitForValidation(validationId);
    }

    this.activeValidations.add(validationId);

    try {
      const result = await this.executeValidationWithRetry(
        () => this.performEnvironmentValidation(),
        validationId,
        'Environment validation'
      );

      this.validationCache.set(validationId, result);
      return result;
    } finally {
      this.activeValidations.delete(validationId);
    }
  }

  public async validateNavigation(routeName: string, params?: any): Promise<ValidationResult> {
    return this.executeValidationWithRetry(
      async () => {
        const startTime = Date.now();
        
        try {
          // Basic navigation validation
          if (!routeName || typeof routeName !== 'string') {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: 'Invalid route name', retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          // Validate route exists (basic check)
          const validRoutes = ['Home', 'Dashboard', 'Profile', 'Settings', 'Login', 'Signup'];
          if (!validRoutes.includes(routeName)) {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: `Route ${routeName} not found`, retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          return {
            isValid: true,
            errors: [],
            warnings: [],
            timestamp: Date.now(),
            duration: Date.now() - startTime,
            retryCount: 0,
            fallbackUsed: false,
          };
        } catch (error) {
          return this.handleValidationError(error as Error, 'navigation_validation', 'Navigation validation');
        }
      },
      'navigation_validation',
      'Navigation validation'
    );
  }

  public async validateStateUpdate(key: string, value: any): Promise<ValidationResult> {
    return this.executeValidationWithRetry(
      async () => {
        const startTime = Date.now();
        
        try {
          // Basic state validation
          if (!key || typeof key !== 'string') {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: 'Invalid state key', retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          // Validate value is not undefined
          if (value === undefined) {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: 'State value cannot be undefined', retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          return {
            isValid: true,
            errors: [],
            warnings: [],
            timestamp: Date.now(),
            duration: Date.now() - startTime,
            retryCount: 0,
            fallbackUsed: false,
          };
        } catch (error) {
          return this.handleValidationError(error as Error, 'state_validation', 'State validation');
        }
      },
      'state_validation',
      'State validation'
    );
  }

  public async validateErrorHandling(errorInfo: any): Promise<ValidationResult> {
    return this.executeValidationWithRetry(
      async () => {
        const startTime = Date.now();
        
        try {
          // Basic error validation
          if (!errorInfo || !errorInfo.error) {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: 'Invalid error info', retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          // Validate error structure
          if (!(errorInfo.error instanceof Error)) {
            return {
              isValid: false,
              errors: [{ type: ValidationErrorType.INVALID_DATA, message: 'Error must be an Error instance', retryable: false, timestamp: Date.now() }],
              warnings: [],
              timestamp: Date.now(),
              duration: Date.now() - startTime,
              retryCount: 0,
              fallbackUsed: false,
            };
          }

          return {
            isValid: true,
            errors: [],
            warnings: [],
            timestamp: Date.now(),
            duration: Date.now() - startTime,
            retryCount: 0,
            fallbackUsed: false,
          };
        } catch (error) {
          return this.handleValidationError(error as Error, 'error_validation', 'Error validation');
        }
      },
      'error_validation',
      'Error validation'
    );
  }

  private async executeValidationWithRetry(
    validationFn: () => Promise<ValidationResult>,
    validationId: string,
    errorContext: string
  ): Promise<ValidationResult> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await validationFn();
        const duration = Date.now() - startTime;

        return {
          ...result,
          duration,
          retryCount: attempt - 1,
          timestamp: Date.now(),
        };
      } catch (error) {
        lastError = error as Error;
        this.incrementErrorCount(this.classifyError(error as Error));

        if (attempt === maxRetries) {
          return this.handleValidationError(lastError, validationId, errorContext);
        }

        // Wait before retry with exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await this.delay(backoffDelay);
      }
    }

    return this.handleValidationError(lastError, validationId, errorContext);
  }

  private async performEnvironmentValidation(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validate platform compatibility
    if (!this.validatePlatformCompatibility()) {
      errors.push({
        type: ValidationErrorType.PLATFORM,
        message: 'Platform compatibility validation failed',
        retryable: false,
        timestamp: Date.now(),
      });
    }

    // Validate performance monitor
    if (!this.validatePerformanceMonitor()) {
      warnings.push('Performance monitor validation failed');
    }

    // Validate network connectivity
    const networkResult = await this.validateNetworkConnectivity();
    if (!networkResult.isValid) {
      errors.push(...networkResult.errors);
    }

    // Validate storage availability
    if (!this.validateStorageAvailability()) {
      errors.push({
        type: ValidationErrorType.PLATFORM,
        message: 'Storage availability validation failed',
        retryable: false,
        timestamp: Date.now(),
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      timestamp: Date.now(),
      duration: 0,
      retryCount: 0,
      fallbackUsed: false,
    };
  }

  private validatePlatformCompatibility(): boolean {
    try {
      // Check if running on supported platform
      const supportedPlatforms = ['ios', 'android', 'web'];
      return supportedPlatforms.includes(Platform.OS);
    } catch (error) {
      console.error('Platform compatibility validation failed:', error);
      return false;
    }
  }

  private validatePerformanceMonitor(): boolean {
    try {
      // Check if performance monitor is available and working
      return this.performanceMonitor !== null && typeof this.performanceMonitor.getMetrics === 'function';
    } catch (error) {
      console.error('Performance monitor validation failed:', error);
      return false;
    }
  }

  private async validateNetworkConnectivity(): Promise<ValidationResult> {
    try {
      // Mock network connectivity check
      // In real implementation, this would check actual network connectivity
      const isConnected = true; // Mock result
      
      if (!isConnected) {
        return {
          isValid: false,
          errors: [{
            type: ValidationErrorType.NETWORK,
            message: 'Network connectivity validation failed',
            retryable: true,
            timestamp: Date.now(),
          }],
          warnings: [],
          timestamp: Date.now(),
          duration: 0,
          retryCount: 0,
          fallbackUsed: false,
        };
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        timestamp: Date.now(),
        duration: 0,
        retryCount: 0,
        fallbackUsed: false,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          type: ValidationErrorType.NETWORK,
          message: 'Network connectivity check failed',
          retryable: true,
          timestamp: Date.now(),
        }],
        warnings: [],
        timestamp: Date.now(),
        duration: 0,
        retryCount: 0,
        fallbackUsed: false,
      };
    }
  }

  private validateStorageAvailability(): boolean {
    try {
      // Mock storage availability check
      // In real implementation, this would check actual storage availability
      return true; // Mock result
    } catch (error) {
      console.error('Storage availability validation failed:', error);
      return false;
    }
  }

  private isRetryableError(error: Error): boolean {
    const retryableErrorTypes = [
      ValidationErrorType.NETWORK,
      ValidationErrorType.TIMEOUT,
    ];

    const errorType = this.classifyError(error);
    return retryableErrorTypes.includes(errorType);
  }

  private getRetryCount(validationId: string): number {
    return this.retryCount.get(validationId) || 0;
  }

  private async createTimeoutPromise(timeout: number, message: string): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(message));
      }, timeout);
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeFallbackValidation(
    validationId: string,
    error: Error | null,
    context: string
  ): Promise<ValidationResult> {
    const fallbackFn = this.fallbackValidations.get(validationId);
    
    if (fallbackFn) {
      try {
        const fallbackResult = await fallbackFn();
        return {
          ...fallbackResult,
          fallbackUsed: true,
          timestamp: Date.now(),
        };
      } catch (fallbackError) {
        console.error(`Fallback validation failed for ${context}:`, fallbackError);
      }
    }

    return this.handleValidationError(error, validationId, context);
  }

  private async waitForValidation(validationId: string): Promise<ValidationResult> {
    const maxWaitTime = 30000; // 30 seconds
    const checkInterval = 100; // 100ms
    let elapsedTime = 0;

    while (elapsedTime < maxWaitTime) {
      const cachedResult = this.validationCache.get(validationId);
      if (cachedResult) {
        return cachedResult;
      }

      await this.delay(checkInterval);
      elapsedTime += checkInterval;
    }

    return {
      isValid: false,
      errors: [{
        type: ValidationErrorType.TIMEOUT,
        message: 'Validation wait timeout',
        retryable: false,
        timestamp: Date.now(),
      }],
      warnings: [],
      timestamp: Date.now(),
      duration: elapsedTime,
      retryCount: 0,
      fallbackUsed: false,
    };
  }

  private handleValidationError(
    error: Error | null,
    validationId: string,
    context: string
  ): ValidationResult {
    const errorType = this.classifyError(error);
    const errorMessage = error?.message || `Validation failed for ${context}`;

    return {
      isValid: false,
      errors: [{
        type: errorType,
        message: errorMessage,
        retryable: this.isRetryableError(error as Error),
        timestamp: Date.now(),
        context: {
          validationId,
          context,
          error: error?.stack,
        },
      }],
      warnings: [],
      timestamp: Date.now(),
      duration: 0,
      retryCount: this.getRetryCount(validationId),
      fallbackUsed: false,
    };
  }

  private classifyError(error: Error | null): ValidationErrorType {
    if (!error) return ValidationErrorType.UNKNOWN;

    const message = error.message.toLowerCase();
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return ValidationErrorType.TIMEOUT;
    }
    
    if (message.includes('network') || message.includes('connection')) {
      return ValidationErrorType.NETWORK;
    }
    
    if (message.includes('permission') || message.includes('access')) {
      return ValidationErrorType.PERMISSION;
    }
    
    if (message.includes('invalid') || message.includes('data')) {
      return ValidationErrorType.INVALID_DATA;
    }
    
    if (message.includes('platform') || message.includes('unsupported')) {
      return ValidationErrorType.PLATFORM;
    }
    
    return ValidationErrorType.UNKNOWN;
  }

  private incrementErrorCount(errorType: ValidationErrorType): void {
    const currentCount = this.errorCount.get(errorType) || 0;
    this.errorCount.set(errorType, currentCount + 1);
  }

  public getValidationStats(): {
    totalErrors: number;
    errorBreakdown: Record<ValidationErrorType, number>;
    cacheSize: number;
    activeValidations: number;
  } {
    const errorBreakdown: Record<ValidationErrorType, number> = {};
    
    Object.values(ValidationErrorType).forEach(type => {
      errorBreakdown[type] = this.errorCount.get(type) || 0;
    });

    return {
      totalErrors: Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0),
      errorBreakdown,
      cacheSize: this.validationCache.size,
      activeValidations: this.activeValidations.size,
    };
  }

  public clearCache(): void {
    this.validationCache.clear();
    this.errorCount.clear();
    this.retryCount.clear();
  }

  public destroy(): void {
    this.clearCache();
    this.activeValidations.clear();
    this.validationQueue = [];
    this.isProcessing = false;
  }

  // Search-specific validation methods
  public validateSearchQuery(query: string): boolean {
    if (!query || typeof query !== 'string') {
      return false;
    }
    
    // Basic search query validation
    const trimmedQuery = query.trim();
    if (trimmedQuery.length === 0) {
      return false;
    }
    
    // Check for minimum length
    if (trimmedQuery.length < 1) {
      return false;
    }
    
    // Check for maximum length
    if (trimmedQuery.length > 1000) {
      return false;
    }
    
    return true;
  }

  public validateSearchResult(result: any): boolean {
    if (!result) {
      return false;
    }
    
    // Basic search result validation
    if (typeof result !== 'object') {
      return false;
    }
    
    // Check if result has required properties
    if (!result.id || !result.title) {
      return false;
    }
    
    return true;
  }

  public validateSearchSuggestion(suggestion: any): boolean {
    if (!suggestion) {
      return false;
    }
    
    // Basic search suggestion validation
    if (typeof suggestion !== 'object') {
      return false;
    }
    
    // Check if suggestion has required properties
    if (!suggestion.label || !suggestion.type) {
      return false;
    }
    
    return true;
  }

  // Mock validation execution methods
  private async executeValidation(component: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    // Mock component validation
    return {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
      duration: 0,
      retryCount: 0,
      fallbackUsed: false,
    };
  }

  private async executeScreenValidation(screen: React.ComponentType<any>, props: any): Promise<ValidationResult> {
    // Mock screen validation
    return {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
      duration: 0,
      retryCount: 0,
      fallbackUsed: false,
    };
  }

  private async executeBundleValidation(bundle: any): Promise<ValidationResult> {
    // Mock bundle validation
    return {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
      duration: 0,
      retryCount: 0,
      fallbackUsed: false,
    };
  }
}

// Fail-safe loop with recovery and retry controls
export class FailSafeValidationLoop {
  private circuitBreaker: _CircuitBreaker;
  private retryMechanism: _RetryMechanism;
  private maxConsecutiveFailures: number;
  private failureCount = 0;
  private lastSuccessTime = 0;

  constructor(
    maxConsecutiveFailures = 5,
    circuitBreakerTimeout = 60000,
    circuitBreakerThreshold = 3
  ) {
    this.maxConsecutiveFailures = maxConsecutiveFailures;
    this.circuitBreaker = new _CircuitBreaker(circuitBreakerTimeout, circuitBreakerThreshold);
    this.retryMechanism = new _RetryMechanism({
      maxAttempts: 3,
      baseDelay: 2000,
      maxDelay: 10000,
      backoffMultiplier: 2,
    });
  }

  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    recoveryOperation?: () => Promise<T>,
    onFailure?: (error: Error, attempt: number) => void
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxConsecutiveFailures; attempt++) {
      try {
        const result = await this.circuitBreaker.execute(async () => {
          return await this.retryMechanism.execute(async () => {
            return await operation();
          });
        });

        // Success - reset failure count
        this.failureCount = 0;
        this.lastSuccessTime = Date.now();
        return result;
      } catch (error) {
        lastError = error as Error;
        this.failureCount++;

        if (onFailure) {
          onFailure(lastError, attempt);
        }

        // Try recovery operation if provided
        if (recoveryOperation && attempt === Math.floor(this.maxConsecutiveFailures / 2)) {
          try {
            console.log('Attempting recovery operation...');
            const recoveryResult = await recoveryOperation();
            this.failureCount = 0;
            this.lastSuccessTime = Date.now();
            return recoveryResult;
          } catch (recoveryError) {
            console.error('Recovery operation failed:', recoveryError);
          }
        }

        if (attempt === this.maxConsecutiveFailures) {
          throw new Error(`Operation failed after ${this.maxConsecutiveFailures} attempts: ${lastError.message}`);
        }

        // Exponential backoff between attempts
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }

    throw lastError!;
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