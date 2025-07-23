// BottomSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { useBottomSlotContent } from '../hooks/useSlotZone';

export const BottomSlot = () => {
  const content = useBottomSlotContent();
  
  if (!content) {
    return (
      <View style={{ height: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Bottom Slot Placeholder</Text>
      </View>
    );
  }
  
  return <View style={{ paddingBottom: 12 }}>{content}</View>;
}; 