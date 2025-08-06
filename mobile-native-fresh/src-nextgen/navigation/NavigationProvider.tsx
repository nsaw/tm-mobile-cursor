import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppRoutes, NavigationProp } from '../types/navigation';

export interface NavigationState {
  currentRoute: keyof AppRoutes | null;
  routeHistory: (keyof AppRoutes)[];
  params: Record<string, unknown>;
}

interface NavigationContextType {
  state: NavigationState;
  navigate: <T extends keyof AppRoutes>(route: T, params?: AppRoutes[T]) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  getCurrentRoute: () => keyof AppRoutes | null;
  getParams: <T extends keyof AppRoutes>(route: T) => AppRoutes[T] | undefined;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = <T extends keyof AppRoutes>(): NavigationProp<T> => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return {
    navigate: context.navigate,
    goBack: context.goBack,
    canGoBack: context.canGoBack,
  };
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>({
    currentRoute: null,
    routeHistory: [],
    params: {},
  });

  const navigate = useCallback(<T extends keyof AppRoutes>(route: T, params?: AppRoutes[T]) => {
    setState(prev => ({
      currentRoute: route,
      routeHistory: [...prev.routeHistory, route],
      params: { ...prev.params, [route]: params },
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const newHistory = prev.routeHistory.slice(0, -1);
      const newCurrentRoute = newHistory[newHistory.length - 1] || null;
      return {
        currentRoute: newCurrentRoute,
        routeHistory: newHistory,
        params: prev.params,
      };
    });
  }, []);

  const canGoBack = useCallback(() => {
    return state.routeHistory.length > 1;
  }, [state.routeHistory.length]);

  const getCurrentRoute = useCallback(() => {
    return state.currentRoute;
  }, [state.currentRoute]);

  const getParams = useCallback(<T extends keyof AppRoutes>(route: T): AppRoutes[T] | undefined => {
    return state.params[route] as AppRoutes[T] | undefined;
  }, [state.params]);

  const contextValue: NavigationContextType = {
    state,
    navigate,
    goBack,
    canGoBack,
    getCurrentRoute,
    getParams,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}; 