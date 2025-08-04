import { useNavigation as useNativeNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppRouteList } from './navigation.types';

export const useTypedNavigation = <T extends keyof AppRouteList>() => {
  return useNativeNavigation<StackNavigationProp<AppRouteList, T>>();
}; 