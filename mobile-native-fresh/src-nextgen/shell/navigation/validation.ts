import { 
  NavigationRouteDefinition, 
  NavigationEnvironment, 
  NavigationState, 
  NavigationTransition,
  NavigationValidationResult 
} from './types';

/**
 * Navigation validation utilities for the hybrid renderer shell
 */

/**
 * Validate navigation route definition
 */
export const validateNavigationRouteDefinition = (route: NavigationRouteDefinition): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Validate route name
  if (!route.name || route.name.trim() === '') {
    result.valid = false;
    result.errors.push('Route name is required');
  }

  // Validate route path
  if (!route.path || route.path.trim() === '') {
    result.valid = false;
    result.errors.push('Route path is required');
  }

  // Validate route component
  if (!route.component || route.component.trim() === '') {
    result.valid = false;
    result.errors.push('Route component is required');
  }

  // Validate route environment
  if (!['legacy', 'nextgen'].includes(route.environment)) {
    result.valid = false;
    result.errors.push(`Invalid environment: ${route.environment}`);
  }

  // Validate route path format
  if (route.path && !route.path.startsWith('/')) {
    result.warnings.push('Route path should start with /');
  }

  // Validate route options
  if (route.options) {
    if (route.options.animation && !['slide', 'fade', 'none'].includes(route.options.animation)) {
      result.warnings.push(`Invalid animation: ${route.options.animation}`);
    }
  }

  return result;
};

/**
 * Validate navigation state
 */
export const validateNavigationState = (state: NavigationState): NavigationValidationResult => {
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

  // Validate params
  if (state.params && typeof state.params !== 'object') {
    result.warnings.push('Navigation params should be an object');
  }

  return result;
};

/**
 * Validate navigation transition
 */
export const validateNavigationTransition = (transition: NavigationTransition): NavigationValidationResult => {
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

  // Validate params
  if (transition.params && typeof transition.params !== 'object') {
    result.warnings.push('Transition params should be an object');
  }

  return result;
};

/**
 * Validate navigation consistency across environments
 */
export const validateNavigationConsistency = (
  legacyRoutes: NavigationRouteDefinition[],
  nextgenRoutes: NavigationRouteDefinition[]
): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Create maps for comparison
  const legacyRouteMap = new Map(legacyRoutes.map(route => [route.name, route]));
  const nextgenRouteMap = new Map(nextgenRoutes.map(route => [route.name, route]));

  // Check for missing routes
  for (const [name, legacyRoute] of legacyRouteMap) {
    if (!nextgenRouteMap.has(name)) {
      result.warnings.push(`Route ${name} missing in nextgen environment`);
    }
  }

  for (const [name, nextgenRoute] of nextgenRouteMap) {
    if (!legacyRouteMap.has(name)) {
      result.warnings.push(`Route ${name} missing in legacy environment`);
    }
  }

  // Check for path mismatches
  for (const [name, legacyRoute] of legacyRouteMap) {
    const nextgenRoute = nextgenRouteMap.get(name);
    if (nextgenRoute && legacyRoute.path !== nextgenRoute.path) {
      result.routeConflicts.push(`Route ${name} path mismatch: legacy=${legacyRoute.path}, nextgen=${nextgenRoute.path}`);
    }
  }

  return result;
};

/**
 * Get navigation route suggestions
 */
export const getNavigationRouteSuggestions = (routeName: string): Partial<NavigationRouteDefinition> => {
  const suggestions = {
    home: {
      path: '/home',
      component: 'HomeScreen',
      options: {
        title: 'Home',
        headerShown: true,
        tabBarVisible: true,
        gestureEnabled: true,
        animation: 'slide' as const
      }
    },
    dashboard: {
      path: '/dashboard',
      component: 'DashboardScreen',
      options: {
        title: 'Dashboard',
        headerShown: true,
        tabBarVisible: true,
        gestureEnabled: true,
        animation: 'slide' as const
      }
    },
    search: {
      path: '/search',
      component: 'SearchScreen',
      options: {
        title: 'Search',
        headerShown: true,
        tabBarVisible: true,
        gestureEnabled: true,
        animation: 'slide' as const
      }
    },
    profile: {
      path: '/profile',
      component: 'ProfileScreen',
      options: {
        title: 'Profile',
        headerShown: true,
        tabBarVisible: true,
        gestureEnabled: true,
        animation: 'slide' as const
      }
    },
    settings: {
      path: '/settings',
      component: 'SettingsScreen',
      options: {
        title: 'Settings',
        headerShown: true,
        tabBarVisible: false,
        gestureEnabled: true,
        animation: 'slide' as const
      }
    },
    auth: {
      path: '/auth',
      component: 'AuthScreen',
      options: {
        title: 'Authentication',
        headerShown: false,
        tabBarVisible: false,
        gestureEnabled: false,
        animation: 'fade' as const
      }
    },
    modal: {
      path: '/modal',
      component: 'ModalScreen',
      options: {
        title: 'Modal',
        headerShown: true,
        tabBarVisible: false,
        gestureEnabled: true,
        animation: 'fade' as const
      }
    }
  };

  return suggestions[routeName as keyof typeof suggestions] || {
    path: `/${routeName}`,
    component: `${routeName.charAt(0).toUpperCase() + routeName.slice(1)}Screen`,
    options: {
      title: routeName.charAt(0).toUpperCase() + routeName.slice(1),
      headerShown: true,
      tabBarVisible: true,
      gestureEnabled: true,
      animation: 'slide' as const
    }
  };
};

/**
 * Validate navigation hierarchy
 */
export const validateNavigationHierarchy = (
  parentRoute: NavigationRouteDefinition,
  childRoute: NavigationRouteDefinition
): NavigationValidationResult => {
  const result: NavigationValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    routeConflicts: [],
    paramMismatches: []
  };

  // Define navigation hierarchy rules
  const hierarchyRules = {
    home: ['dashboard', 'search', 'profile', 'settings'],
    dashboard: ['search', 'profile', 'settings'],
    search: ['profile', 'settings'],
    profile: ['settings'],
    settings: [],
    auth: ['home', 'dashboard'],
    modal: ['home', 'dashboard', 'search', 'profile', 'settings']
  };

  const allowedChildren = hierarchyRules[parentRoute.name as keyof typeof hierarchyRules] || [];
  
  if (!allowedChildren.includes(childRoute.name)) {
    result.warnings.push(`Route ${parentRoute.name} should not contain ${childRoute.name} directly`);
    result.suggestions.push(`Consider using an intermediate ${allowedChildren[0] || 'home'} route`);
  }

  return result;
}; 