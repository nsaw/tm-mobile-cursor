import { useNavigation as useRNNavigation, useRoute as useRNRoute } from '@react-navigation/native';
import { NavigationProp, RouteProp, RootStackParamList } from '../types';

export const useNavigation = <T extends keyof RootStackParamList>(): NavigationProp<T> => {
  return useRNNavigation<NavigationProp<T>>();
};

export const useRoute = <T extends keyof RootStackParamList>(): RouteProp<T> => {
  return useRNRoute() as RouteProp<T>;
};

export const useNavigationState = () => {
  const navigation = useRNNavigation();
  const state = navigation.getState();
  return {
    canGoBack: navigation.canGoBack(),
    routeNames: state?.routeNames || [],
    currentRoute: state?.routes[state.index],
  };
}; 