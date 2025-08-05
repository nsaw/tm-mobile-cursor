import { 
  NavigationRouteDefinition, 
  NavigationEnvironment, 
  NavigationState, 
  NavigationTransition,
  NavigationValidationResult 
} from './types';

/**
 * Navigation utility functions for the hybrid renderer shell
 */

// Route registry for tracking
const routeRegistry = new Map<string, NavigationRouteDefinition>();

// State registry for tracking
const stateRegistry = new Map<string, NavigationState>();

/**
 * Register a navigation route
 */
export const registerNavigationRoute = (
  route: NavigationRouteDefinition,
  environment: NavigationEnvironment
): void => {
  const routeKey = `${environment}-${route.name}`;
  routeRegistry.set(routeKey, route);
  
  if (__DEV__) {
    console.log(`🔧 Navigation route registered: ${routeKey}`, {
      path: route.path,
      component: route.component,
      environment: route.environment
    });
  }
};

/**
 * Get navigation route by name and environment
 */
export const getNavigationRoute = (
  name: string,
  environment: NavigationEnvironment
): NavigationRouteDefinition | undefined => {
  const routeKey = `${environment}-${name}`;
  return routeRegistry.get(routeKey);
};

/**
 * Update navigation state
 */
export const updateNavigationState = (state: NavigationState): void => {
  const stateKey = `${state.environment}-${state.currentRoute}`;
  stateRegistry.set(stateKey, state);
  
  if (__DEV__) {
    console.log(`🔧 Navigation state updated: ${stateKey}`, {
      currentRoute: state.currentRoute,
      previousRoute: state.previousRoute,
      params: state.params
    });
  }
};

/**
 * Get navigation state by route and environment
 */
export const getNavigationState = (
  route: string,
  environment: NavigationEnvironment
): NavigationState | undefined => {
  const stateKey = `${environment}-${route}`;
  return stateRegistry.get(stateKey);
};

/**
 * Validate navigation definitions
 */
export const validateNavigationDefinitions = (
  routes: NavigationRouteDefinition[],
  environment: NavigationEnvironment
): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Validate routes array
  if (!routes || routes.length === 0) {
    result.warnings.push('No navigation routes defined');
  }

  // Validate each route
  for (const route of routes) {
    // Validate route name
    if (!route.name || route.name.trim() === '') {
      result.valid = false;
      result.errors.push('Route name is required');
    }

    // Validate route path
    if (!route.path || route.path.trim() === '') {
      result.valid = false;
      result.errors.push(`Route path is required for ${route.name}`);
    }

    // Validate route component
    if (!route.component || route.component.trim() === '') {
      result.valid = false;
      result.errors.push(`Route component is required for ${route.name}`);
    }

    // Validate route environment
    if (route.environment !== environment) {
      result.warnings.push(`Route ${route.name} environment mismatch: expected ${environment}, got ${route.environment}`);
    }

    // Check for route conflicts
    const existingRoute = getNavigationRoute(route.name, environment);
    if (existingRoute && existingRoute.path !== route.path) {
      result.routeConflicts.push(`Route ${route.name} path changed from ${existingRoute.path} to ${route.path}`);
    }
  }

  return result;
};

/**
 * Validate routing system
 */
export const validateRoutingSystem = (state: NavigationState): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Validate current route
  if (!state.currentRoute || state.currentRoute.trim() === '') {
    result.valid = false;
    result.errors.push('Current route is required');
  }

  // Validate environment
  if (!['legacy', 'nextgen'].includes(state.environment)) {
    result.valid = false;
    result.errors.push(`Invalid environment: ${state.environment}`);
  }

  // Validate timestamp
  if (!state.timestamp) {
    result.warnings.push('Navigation state timestamp is missing');
  }

  // Check if route exists
  const route = getNavigationRoute(state.currentRoute, state.environment);
  if (!route) {
    result.warnings.push(`Route ${state.currentRoute} not found in ${state.environment} environment`);
  }

  return result;
};

/**
 * Validate screen transition
 */
export const validateScreenTransition = (transition: NavigationTransition): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Validate transition type
  if (!['push', 'pop', 'replace', 'reset'].includes(transition.type)) {
    result.valid = false;
    result.errors.push(`Invalid transition type: ${transition.type}`);
  }

  // Validate from route
  if (!transition.from || transition.from.trim() === '') {
    result.valid = false;
    result.errors.push('From route is required');
  }

  // Validate to route
  if (!transition.to || transition.to.trim() === '') {
    result.valid = false;
    result.errors.push('To route is required');
  }

  // Validate animation
  if (transition.animation && !['slide', 'fade', 'none'].includes(transition.animation)) {
    result.warnings.push(`Invalid animation: ${transition.animation}`);
  }

  // Check for self-transition
  if (transition.from === transition.to) {
    result.warnings.push('Self-transition detected');
  }

  return result;
};

/**
 * Get navigation statistics
 */
export const getNavigationStatistics = (): {
  totalRoutes: number;
  totalStates: number;
  byEnvironment: { legacy: number; nextgen: number };
  byRoute: Record<string, number>;
} => {
  const stats = {
    totalRoutes: routeRegistry.size,
    totalStates: stateRegistry.size,
    byEnvironment: {
      legacy: 0,
      nextgen: 0
    },
    byRoute: {} as Record<string, number>
  };

  for (const route of routeRegistry.values()) {
    stats.byEnvironment[route.environment]++;
    stats.byRoute[route.name] = (stats.byRoute[route.name] || 0) + 1;
  }

  return stats;
};

/**
 * Clear navigation registries
 */
export const clearNavigationRegistries = (): void => {
  routeRegistry.clear();
  stateRegistry.clear();
  if (__DEV__) {
    console.log('🔧 Navigation registries cleared');
  }
};

/**
 * Export navigation registries for debugging
 */
export const exportNavigationRegistries = (): {
  routes: NavigationRouteDefinition[];
  states: NavigationState[];
} => {
  return {
    routes: Array.from(routeRegistry.values()),
    states: Array.from(stateRegistry.values())
  };
};

/**
 * Check if route exists
 */
export const routeExists = (
  name: string,
  environment: NavigationEnvironment
): boolean => {
  return getNavigationRoute(name, environment) !== undefined;
};

/**
 * Get all routes for environment
 */
export const getRoutesForEnvironment = (environment: NavigationEnvironment): NavigationRouteDefinition[] => {
  return Array.from(routeRegistry.values()).filter(route => route.environment === environment);
}; 