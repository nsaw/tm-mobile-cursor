// SlotRenderer.tsx (updated)
import React from 'react';
import { View, Text } from 'react-native';
import { TopSlot } from './TopSlot';
import { BottomSlot } from './BottomSlot';

export const SlotRenderer = () => {
  return (
    <View style={{ flex: 1 }}>
      <TopSlot />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>🔧 SlotRenderer Active</Text>
      </View>
      <BottomSlot />
    </View>
  );
}; 