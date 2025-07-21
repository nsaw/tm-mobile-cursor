import { NavigationRoute } from './NavigationTypes';

export const defaultRoutes: NavigationRoute[] = [
  {
    name: 'Home',
    path: '/',
    component: () => null // Placeholder
  }
];

export const getRouteByName = (name: string): NavigationRoute | undefined => {
  return defaultRoutes.find(route => route.name === name);
}; 