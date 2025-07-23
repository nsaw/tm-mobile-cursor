// NavigationProvider.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainStack } from '../navigation/stack';

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NavigationContainer>
      <MainStack />
      {children}
    </NavigationContainer>
  );
}; 