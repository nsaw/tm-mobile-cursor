// TopSlot.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { useTopSlotContent } from '../hooks/useSlotZone';

export const TopSlot = () => {
  const content = useTopSlotContent();
  
  if (!content) {
    return (
      <View style={{ height: 50, backgroundColor: 'lightgray', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Top Slot Placeholder</Text>
      </View>
    );
  }
  
  return <View style={{ paddingTop: 12 }}>{content}</View>;
}; 