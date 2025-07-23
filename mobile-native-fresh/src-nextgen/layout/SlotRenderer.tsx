// SlotRenderer.tsx (updated)
import React from 'react';
import { View } from 'react-native';
import { TopSlot } from './TopSlot';
import { CenterSlot } from './CenterSlot';
import { BottomSlot } from './BottomSlot';

export const SlotRenderer = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopSlot />
      <CenterSlot />
      <BottomSlot />
    </View>
  );
}; 