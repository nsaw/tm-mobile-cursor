// Inject LayoutShell that wraps SlotRenderer with TopSlot and BottomSlot
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SlotRenderer } from './SlotRenderer';

export const LayoutShell = () => (
  <SafeAreaProvider>
    <SlotRenderer />
  </SafeAreaProvider>
); 