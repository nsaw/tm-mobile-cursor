// NavigationProvider.tsx
import React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';

import RootNavigator from '../navigation/RootNavigator';

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationIndependentTree>
      <RootNavigator />
      {children}
    </NavigationIndependentTree>
  );
}; 