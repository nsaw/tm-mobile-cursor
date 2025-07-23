// ✅ TestZoneScreen dynamically injecting into TopSlot and BottomSlot
import React from 'react';
import { View, Text } from 'react-native';

import useSlotZone from '../hooks/useSlotZone';

const TestZoneScreen = () => {
  useSlotZone('top', <Text>📣 Projected into TopSlot!</Text>);
  useSlotZone('bottom', <Text>🔽 Injected Bottom</Text>);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>🧪 This is TestZoneScreen</Text>
      <Text>Testing both TopSlot and BottomSlot projection</Text>
    </View>
  );
};

export default TestZoneScreen; 