import React from 'react';

export interface NavigationRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  params?: Record<string, any>;
  options?: {
    headerShown?: boolean;
    title?: string;
    tabBarVisible?: boolean;
  };
}

export interface NavigationState {
  currentRoute: string;
  routes: NavigationRoute[];
  history: string[];
  params: Record<string, any>;
}

export interface ScreenTransition {
  from: string;
  to: string;
  type: 'push' | 'pop' | 'replace' | 'reset';
  params?: Record<string, any>;
  animation?: 'slide' | 'fade' | 'none';
}

export class NavigationSystem {
  private routes: Map<string, NavigationRoute> = new Map();
  private state: NavigationState = {
    currentRoute: '',
    routes: [],
    history: [],
    params: {}
  };

  private listeners: Set<(state: NavigationState) => void> = new Set();

  addRoute(route: NavigationRoute): void {
    this.routes.set(route.name, route);
    this.state.routes = Array.from(this.routes.values());
    this.notifyListeners();
  }

  removeRoute(routeName: string): void {
    this.routes.delete(routeName);
    this.state.routes = Array.from(this.routes.values());
    this.notifyListeners();
  }

  navigate(routeName: string, params?: Record<string, any>): void {
    if (!this.routes.has(routeName)) {
      throw new Error(`Route ${routeName} not found`);
    }

    this.state.history.push(this.state.currentRoute);
    this.state.currentRoute = routeName;
    this.state.params = params || {};
    this.notifyListeners();
  }

  goBack(): void {
    if (this.state.history.length > 0) {
      this.state.currentRoute = this.state.history.pop() || '';
      this.notifyListeners();
    }
  }

  getCurrentRoute(): NavigationRoute | undefined {
    return this.routes.get(this.state.currentRoute);
  }

  getNavigationState(): NavigationState {
    return { ...this.state };
  }

  addListener(listener: (state: NavigationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getNavigationState()));
  }

  validateRoute(routeName: string): boolean {
    return this.routes.has(routeName);
  }

  validateTransition(from: string, to: string): boolean {
    return this.routes.has(from) && this.routes.has(to);
  }
}

export const navigationSystem = new NavigationSystem(); 