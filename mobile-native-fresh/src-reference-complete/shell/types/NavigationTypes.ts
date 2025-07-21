// Navigation contract types
export interface NavigationRoute {
  name: string;
  path: string;
  component: any; // React.ComponentType<any> without React import
}

export interface NavigationState {
  currentRoute: string;
  routes: NavigationRoute[];
}

// Navigation contract types
export interface NavigationContract {
  routeId: string;
  path: string;
  component: any; // React.ComponentType<any> without React import
  layoutRole?: string;
  environment: 'legacy' | 'nextgen';
  validationRules: NavigationValidationRules;
}

export interface NavigationValidationRules {
  allowedEnvironments: string[];
  requiredRoles: string[];
  conflicts: string[];
}

export interface RouteDefinition {
  name: string;
  path: string;
  component: any; // React.ComponentType<any> without React import
  layoutRole?: string;
  environment: 'legacy' | 'nextgen';
  validationRules?: NavigationValidationRules;
} 