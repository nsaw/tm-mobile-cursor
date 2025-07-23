// ✅ TestZoneScreen dynamically injecting into TopSlot
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import useSlotZone from '../hooks/useSlotZone';

const TestZoneScreen = () => {
  useSlotZone('top', <Text>📣 Projected into TopSlot!</Text>);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🧪 This is TestZoneScreen</Text>
    </View>
  );
};

export default TestZoneScreen; 