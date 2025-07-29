import React from 'react';

import performanceMonitor from '../utils/PerformanceMonitor';
import { ValidationSystem } from '../utils/ValidationSystem';

// Navigation types
export interface NavigationRoute {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
  params?: any;
}

export interface NavigationConfig {
  routes: NavigationRoute[];
  initialRouteName?: string;
  screenOptions?: any;
}

export interface NavigationStateData {
  currentRoute: string;
  params: any;
  history: string[];
  timestamp: number;
}

export class NavigationSystem {
  private static instance: NavigationSystem;
  private performanceMonitor: typeof performanceMonitor;
  private validationSystem: ValidationSystem;
  private navigationState: NavigationStateData;
  private listeners: Array<(state: NavigationStateData) => void> = [];

  private constructor() {
    this.performanceMonitor = performanceMonitor;
    this.validationSystem = ValidationSystem.getInstance();
    this.navigationState = {
      currentRoute: '',
      params: {},
      history: [],
      timestamp: Date.now(),
    };
  }

  public static getInstance(): NavigationSystem {
    if (!NavigationSystem.instance) {
      NavigationSystem.instance = new NavigationSystem();
    }
    return NavigationSystem.instance;
  }

  public async navigate(routeName: string, params?: any): Promise<void> {
    try {
      const startTime = Date.now();

      // Validate navigation using environment validation
      const validationResult = await this.validationSystem.validateEnvironment();
      if (!validationResult.isValid) {
        throw new Error(`Navigation validation failed: ${validationResult.errors.map(e => e.message).join(', ')}`);
      }

      // Update navigation state
      this.navigationState.history.push(this.navigationState.currentRoute);
      this.navigationState.currentRoute = routeName;
      this.navigationState.params = params || {};
      this.navigationState.timestamp = Date.now();

      // Record performance metrics
      const navigationTime = Date.now() - startTime;
      this.performanceMonitor.recordNavigationMetrics(routeName, navigationTime, 'nextgen');

      // Notify listeners
      this.notifyListeners();

    } catch (error) {
      console.error('Navigation failed:', error);
      throw error;
    }
  }

  public getCurrentState(): NavigationStateData {
    return { ...this.navigationState };
  }

  public addListener(listener: (state: NavigationStateData) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getCurrentState());
      } catch (error) {
        console.error('Navigation listener error:', error);
      }
    });
  }

  public destroy(): void {
    this.listeners = [];
    this.validationSystem.destroy();
  }
}

export const useNavigation = () => {
  const navigationSystem = NavigationSystem.getInstance();
  const [state, setState] = React.useState(navigationSystem.getCurrentState());

  React.useEffect(() => {
    const unsubscribe = navigationSystem.addListener(setState);
    return unsubscribe;
  }, []);

  return {
    navigate: navigationSystem.navigate.bind(navigationSystem),
    state,
  };
}; 