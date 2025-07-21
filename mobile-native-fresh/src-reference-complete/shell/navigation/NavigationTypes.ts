export interface NavigationRoute {
  name: string;
  path: string;
  component: React.ComponentType<any>;
}

export interface NavigationState {
  currentRoute: string;
  routes: NavigationRoute[];
} 