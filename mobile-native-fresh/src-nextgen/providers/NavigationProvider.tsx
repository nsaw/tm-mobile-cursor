// NavigationProvider.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from '../navigation/RootNavigator';

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContainer>
      <RootNavigator />
      {children}
    </NavigationContainer>
  );
}; 