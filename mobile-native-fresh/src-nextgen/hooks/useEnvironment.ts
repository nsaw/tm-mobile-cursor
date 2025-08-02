import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PerformanceMonitor } from '../utils/PerformanceMonitor';

// Environment configuration
const ENVIRONMENT_STORAGE_KEY = '@thoughtmarks_environment';
const ENVIRONMENT_TOGGLE_TIMEOUT = 5000; // 5 seconds
const ENVIRONMENT_RETRY_ATTEMPTS = 3;
const ENVIRONMENT_RETRY_DELAY = 1000; // 1 second

// Environment types
export type Environment = 'legacy' | 'nextgen';

export interface EnvironmentState {
  current: Environment;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  retryCount: number;
  validationStatus: 'pending' | 'validating' | 'valid' | 'invalid';
}

export interface EnvironmentToggleResult {
  success: boolean;
  previousEnvironment: Environment;
  newEnvironment: Environment;
  error?: string;
  duration: number;
  validationPassed: boolean;
}

export const useEnvironment = () => {
  const [state, setState] = useState<EnvironmentState>({
    current: 'legacy',
    isLoading: true,
    error: null,
    lastUpdated: Date.now(),
    retryCount: 0,
    validationStatus: 'pending',
  });

  const performanceMonitor = useRef(PerformanceMonitor.getInstance());
  const toggleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load environment from storage
  const loadEnvironment = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const storedEnvironment = await AsyncStorage.getItem(ENVIRONMENT_STORAGE_KEY);
      const environment: Environment = (storedEnvironment as Environment) || 'legacy';
      
      // Validate environment
      const validationResult = await validateEnvironment(environment);
      
      setState(prev => ({
        ...prev,
        current: environment,
        isLoading: false,
        validationStatus: validationResult.isValid ? 'valid' : 'invalid',
        lastUpdated: Date.now(),
      }));
      
      // Record performance metrics
      performanceMonitor.current.recordComponentMetrics('useEnvironment', Date.now() - state.lastUpdated, 'nextgen');
    } catch (error) {
      console.warn('Failed to load environment:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load environment',
        validationStatus: 'invalid',
      }));
    }
  }, []);

  // Validate environment
  const validateEnvironment = useCallback(async (environment: Environment): Promise<{ isValid: boolean; errors: string[] }> => {
    try {
      setState(prev => ({ ...prev, validationStatus: 'validating' }));
      
      // Basic environment validation
      const errors: string[] = [];
      
      // Check if environment is valid
      if (!['legacy', 'nextgen'].includes(environment)) {
        errors.push('Invalid environment type');
      }
      
      // Platform-specific validation
      if (environment === 'nextgen') {
        const nextgenValidation = await validateNextgenEnvironment();
        if (!nextgenValidation.isValid) {
          errors.push(...nextgenValidation.errors);
        }
      }
      
      return { isValid: errors.length === 0, errors };
    } catch (error) {
      console.warn('Environment validation failed:', error);
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
      };
    }
  }, []);

  // Validate nextgen environment
  const validateNextgenEnvironment = useCallback(async (): Promise<{ isValid: boolean; errors: string[] }> => {
    try {
      // Check if nextgen components are available
      const nextgenComponents = [
        'src-nextgen/components',
        'src-nextgen/hooks',
        'src-nextgen/utils',
      ];
      
      // This is a simplified check - in a real implementation, you'd check actual component availability
      const errors: string[] = [];
      
      // Check platform compatibility
      if (!['ios', 'android', 'web'].includes(Platform.OS)) {
        errors.push('Platform not supported for nextgen environment');
      }
      
      return { isValid: errors.length === 0, errors };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Nextgen validation failed'],
      };
    }
  }, []);

  // Toggle environment with retry mechanism
  const toggleEnvironment = useCallback(async (): Promise<EnvironmentToggleResult> => {
    const startTime = Date.now();
    const previousEnvironment = state.current;
    const newEnvironment: Environment = previousEnvironment === 'legacy' ? 'nextgen' : 'legacy';
    
    try {
      // Clear any existing timeouts
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      // Set timeout for toggle operation
      const togglePromise = new Promise<EnvironmentToggleResult>((resolve, reject) => {
        toggleTimeoutRef.current = setTimeout(() => {
          reject(new Error('Environment toggle timeout'));
        }, ENVIRONMENT_TOGGLE_TIMEOUT);
      });
      
      // Execute toggle with retry
      const result = await executeToggleWithRetry(newEnvironment, previousEnvironment);
      
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
      
      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
      
      console.error('Environment toggle failed:', error);
      return {
        success: false,
        previousEnvironment,
        newEnvironment,
        error: error instanceof Error ? error.message : 'Toggle failed',
        duration: Date.now() - startTime,
        validationPassed: false,
      };
    }
  }, [state.current]);

  // Execute toggle with retry mechanism
  const executeToggleWithRetry = useCallback(async (
    newEnvironment: Environment,
    previousEnvironment: Environment
  ): Promise<EnvironmentToggleResult> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= ENVIRONMENT_RETRY_ATTEMPTS; attempt++) {
      try {
        // Validate new environment
        const validationResult = await validateEnvironment(newEnvironment);
        
        if (!validationResult.isValid) {
          throw new Error(`Environment validation failed: ${validationResult.errors.join(', ')}`);
        }
        
        // Save to storage
        await AsyncStorage.setItem(ENVIRONMENT_STORAGE_KEY, newEnvironment);
        
        // Update state
        setState(prev => ({
          ...prev,
          current: newEnvironment,
          error: null,
          lastUpdated: Date.now(),
          retryCount: 0,
          validationStatus: 'valid',
        }));
        
        return {
          success: true,
          previousEnvironment,
          newEnvironment,
          duration: 0,
          validationPassed: true,
        };
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === ENVIRONMENT_RETRY_ATTEMPTS) {
          break;
        }
        
        // Wait before retry
        await new Promise<void>(resolve => {
          retryTimeoutRef.current = setTimeout(() => resolve(), ENVIRONMENT_RETRY_DELAY * (attempt + 1)) as ReturnType<typeof setTimeout>;
        });
        
        console.warn(`Environment toggle retry attempt ${attempt + 1}/${ENVIRONMENT_RETRY_ATTEMPTS}:`, error);
      }
    }
    
    // All retries failed
    setState(prev => ({
      ...prev,
      error: lastError?.message || 'Toggle failed after all retries',
      retryCount: prev.retryCount + 1,
      validationStatus: 'invalid',
    }));
    
    throw lastError || new Error('Toggle failed after all retries');
  }, [validateEnvironment]);

  // Reset environment to default
  const resetEnvironment = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(ENVIRONMENT_STORAGE_KEY);
      await loadEnvironment();
    } catch (error) {
      console.error('Failed to reset environment:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Reset failed',
      }));
    }
  }, [loadEnvironment]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load environment on mount
  useEffect(() => {
    loadEnvironment();
    
    // Cleanup on unmount
    return () => {
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [loadEnvironment]);

  return {
    ...state,
    toggleEnvironment,
    resetEnvironment,
    clearError,
    reloadEnvironment: loadEnvironment,
  };
}; 