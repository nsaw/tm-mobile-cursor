import React, { createContext, ReactNode } from 'react';
import { SafeAreaView } from 'react-native';

interface LayoutContextType {
  navigationState?: any;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

type LayoutProps = { children: ReactNode };

export function LayoutShell({ children }: LayoutProps) {
  const contextValue: LayoutContextType = {
    navigationState: undefined,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      <SafeAreaView style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </LayoutContext.Provider>
  );
}

export { LayoutContext };

export default LayoutShell; 