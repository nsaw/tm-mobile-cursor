import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NavigationState {
  currentScreen: string;
  history: string[];
}

export interface NavigationContextType {
  state: NavigationState;
  navigate: (_screen: string) => void;
  goBack: () => void;
  goToRoot: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialScreen?: string;
}

export function NavigationProvider({ children, initialScreen = 'home' }: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>({
    currentScreen: initialScreen,
    history: [initialScreen],
  });

  const navigate = (screen: string) => {
    setState(prev => ({
      currentScreen: screen,
      history: [...prev.history, screen],
    }));
  };

  const goBack = () => {
    setState(prev => {
      const newHistory = prev.history.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1] || 'home';
      
      return {
        currentScreen: previousScreen,
        history: newHistory,
      };
    });
  };

  const goToRoot = () => {
    setState({
      currentScreen: 'home',
      history: ['home'],
    });
  };

  return (
    <NavigationContext.Provider value={{ state, navigate, goBack, goToRoot }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 