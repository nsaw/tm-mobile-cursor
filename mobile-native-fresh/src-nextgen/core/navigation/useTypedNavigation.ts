import { useNavigation as useNativeNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppRouteList } from './navigation.types';

export const useTypedNavigation = <T extends keyof AppRouteList>() => {
  return useNativeNavigation<NativeStackNavigationProp<AppRouteList, T>>();
}; 