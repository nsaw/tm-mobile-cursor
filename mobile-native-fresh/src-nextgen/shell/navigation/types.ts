import React from 'react';

/**
 * Navigation route types
 */
export type NavigationRoute = 
  | 'home'
  | 'dashboard'
  | 'search'
  | 'profile'
  | 'settings'
  | 'auth'
  | 'onboarding'
  | 'modal';

/**
 * Navigation environment types
 */
export type NavigationEnvironment = 'legacy' | 'nextgen';

/**
 * Navigation route interface
 */
export interface NavigationRouteDefinition {
  name: NavigationRoute;
  path: string;
  component: string;
  environment: NavigationEnvironment;
  params?: Record<string, unknown>;
  options?: NavigationRouteOptions;
}

/**
 * Navigation route options interface
 */
export interface NavigationRouteOptions {
  title?: string;
  headerShown?: boolean;
  tabBarVisible?: boolean;
  gestureEnabled?: boolean;
  animation?: 'slide' | 'fade' | 'none';
}

/**
 * Navigation param types
 */
export interface NavigationParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Navigation state interface
 */
export interface NavigationState {
  currentRoute: NavigationRoute;
  previousRoute?: NavigationRoute;
  params: NavigationParams;
  environment: NavigationEnvironment;
  timestamp: string;
}

/**
 * Navigation transition interface
 */
export interface NavigationTransition {
  from: NavigationRoute;
  to: NavigationRoute;
  type: 'push' | 'pop' | 'replace' | 'reset';
  params?: NavigationParams;
  animation?: 'slide' | 'fade' | 'none';
}

/**
 * Navigation definitions props interface
 */
export interface NavigationDefinitionsProps {
  routes: NavigationRouteDefinition[];
  environment: NavigationEnvironment;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
  _testID?: string;
}

/**
 * Routing system props interface
 */
export interface RoutingSystemProps {
  state: NavigationState;
  onNavigate: (route: NavigationRoute, params?: NavigationParams) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
  _testID?: string;
}

/**
 * Screen transitions props interface
 */
export interface ScreenTransitionsProps {
  transition: NavigationTransition;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
  _testID?: string;
}

/**
 * Navigation validation result
 */
export interface NavigationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  routeConflicts: string[];
  paramMismatches: string[];
} 