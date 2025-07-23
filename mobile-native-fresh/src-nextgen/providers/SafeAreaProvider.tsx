// SafeAreaProvider.tsx
import React from 'react';
import { SafeAreaProvider as RNProvider } from 'react-native-safe-area-context';

export const SafeAreaProvider = ({ children }: { children: React.ReactNode }) => {
  return <RNProvider>{children}</RNProvider>;
}; 