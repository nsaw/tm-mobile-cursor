import React from 'react';

import performanceMonitor from '../utils/PerformanceMonitor';
import { ValidationSystem } from '../utils/ValidationSystem';

// State types
export interface StateNode<T = any> {
  key: string;
  value: T;
  timestamp: number;
  version: number;
}

export interface StateUpdate<T = any> {
  key: string;
  value: T;
  timestamp: number;
  source: string;
}

export interface StateConfig {
  persistence?: boolean;
  validation?: boolean;
  performance?: boolean;
  maxHistory?: number;
}

export class StateManagementSystem {
  private static instance: StateManagementSystem;
  private performanceMonitor: typeof performanceMonitor;
  private validationSystem: ValidationSystem;
  private state: Map<string, StateNode> = new Map();
  private history: StateUpdate[] = [];
  private listeners: Map<string, Array<(value: any) => void>> = new Map();
  private config: StateConfig;

  private constructor(config: StateConfig = {}) {
    this.performanceMonitor = performanceMonitor;
    this.validationSystem = ValidationSystem.getInstance();
    this.config = {
      persistence: true,
      validation: true,
      performance: true,
      maxHistory: 100,
      ...config,
    };
  }

  public static getInstance(config?: StateConfig): StateManagementSystem {
    if (!StateManagementSystem.instance) {
      StateManagementSystem.instance = new StateManagementSystem(config);
    }
    return StateManagementSystem.instance;
  }

  public async setState<T>(key: string, value: T, source = 'unknown'): Promise<void> {
    try {
      const startTime = Date.now();

      // Validate state update if enabled
      if (this.config.validation) {
        const validationResult = await this.validationSystem.validateEnvironment();
        if (!validationResult.isValid) {
          throw new Error(`State validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
        }
      }

      // Create state update
      const update: StateUpdate<T> = {
        key,
        value,
        timestamp: Date.now(),
        source,
      };

      // Update state
      const existingNode = this.state.get(key);
      const newNode: StateNode<T> = {
        key,
        value,
        timestamp: update.timestamp,
        version: existingNode ? existingNode.version + 1 : 1,
      };

      this.state.set(key, newNode);

      // Add to history
      this.history.push(update);
      if (this.history.length > (this.config.maxHistory || 100)) {
        this.history.shift();
      }

      // Record performance metrics if enabled
      if (this.config.performance) {
        const updateTime = Date.now() - startTime;
        this.performanceMonitor.recordStateUpdateMetrics(key, updateTime, 'nextgen');
      }

      // Notify listeners
      this.notifyListeners(key, value);

    } catch (error) {
      console.error('State update failed:', error);
      throw error;
    }
  }

  public getState<T>(key: string): T | null {
    const node = this.state.get(key);
    return node ? node.value : null;
  }

  public getStateHistory(key: string): StateUpdate[] {
    return this.history.filter(update => update.key === key);
  }

  public subscribe(key: string, listener: (value: any) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    this.listeners.get(key)!.push(listener);

    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        const index = keyListeners.indexOf(listener);
        if (index > -1) {
          keyListeners.splice(index, 1);
        }
      }
    };
  }

  private notifyListeners(key: string, value: any): void {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => {
        try {
          listener(value);
        } catch (error) {
          console.error('State listener error:', error);
        }
      });
    }
  }

  public clearState(key?: string): void {
    if (key) {
      this.state.delete(key);
      this.listeners.delete(key);
    } else {
      this.state.clear();
      this.listeners.clear();
    }
  }

  public destroy(): void {
    this.state.clear();
    this.listeners.clear();
    this.history = [];
    this.validationSystem.destroy();
  }
}

export const useState = <T>(key: string, initialValue?: T) => {
  const stateSystem = StateManagementSystem.getInstance();
  const [value, setValue] = React.useState<T | null>(() => {
    const existing = stateSystem.getState<T>(key);
    return existing !== null ? existing : initialValue || null;
  });

  React.useEffect(() => {
    const unsubscribe = stateSystem.subscribe(key, (newValue: T) => {
      setValue(newValue);
    });
    return unsubscribe;
  }, [key]);

  const updateValue = React.useCallback(async (newValue: T, source?: string) => {
    await stateSystem.setState(key, newValue, source);
  }, [key]);

  return [value, updateValue] as const;
}; 