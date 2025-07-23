// CenterSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { useCenterSlotContent } from '../hooks/useSlotZone';

export const CenterSlot = () => {
  const content = useCenterSlotContent();
  
  if (!content) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>🔧 SlotRenderer Active</Text>
      </View>
    );
  }
  
  return <View style={{ paddingVertical: 8 }}>{content}</View>;
}; 