import React, { createContext, useContext, ReactNode } from 'react';

interface ShellContextType {
  environment: 'legacy' | 'nextgen';
  version: string;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export interface ShellProviderProps {
  children: ReactNode;
  environment?: 'legacy' | 'nextgen';
  version?: string;
}

export const ShellProvider: React.FC<ShellProviderProps> = ({ 
  children, 
  environment = 'nextgen',
  version = '1.4.200'
}) => {
  const contextValue: ShellContextType = {
    environment,
    version
  };

  return (
    <ShellContext.Provider value={contextValue}>
      {children}
    </ShellContext.Provider>
  );
};

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within a ShellProvider');
  }
  return context;
}; 