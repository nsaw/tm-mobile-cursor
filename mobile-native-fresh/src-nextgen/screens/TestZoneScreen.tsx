// ✅ TestZoneScreen dynamically injecting into TopSlot, CenterSlot, and BottomSlot
import React from 'react';
import { View, Text } from 'react-native';

import useSlotZone from '../hooks/useSlotZone';

const TestZoneScreen = () => {
  useSlotZone('top', <Text>📣 Projected into TopSlot!</Text>);
  useSlotZone('center', <Text>🎯 Center Slot Injected</Text>);
  useSlotZone('bottom', <Text>🔽 Injected Bottom</Text>);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🧪 This is TestZoneScreen</Text>
      <Text>Testing TopSlot, CenterSlot, and BottomSlot projection</Text>
    </View>
  );
};

export default TestZoneScreen; 