import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  currentRoute?: string;
  navigate?: (route: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export interface NavigationProviderProps {
  children: ReactNode;
  currentRoute?: string;
  navigate?: (route: string) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  currentRoute,
  navigate
}) => {
  const contextValue: NavigationContextType = {
    currentRoute,
    navigate
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}; 