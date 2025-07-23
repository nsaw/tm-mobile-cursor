import type { RouteProp } from '@react-navigation/native';

export type AppRouteList = {
  Home: undefined;
  Settings: { section: string };
  Profile: { userId: string };
};

export type NavigationParam<T extends keyof AppRouteList> = RouteProp<AppRouteList, T>; 