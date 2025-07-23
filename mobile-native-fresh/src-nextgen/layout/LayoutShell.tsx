// LayoutShell.tsx
import React from 'react';
import { View } from 'react-native';
import { SlotRenderer } from './SlotRenderer';

export const LayoutShell = () => {
  return (
    <View style={{ flex: 1 }}>
      <SlotRenderer />
    </View>
  );
}; 