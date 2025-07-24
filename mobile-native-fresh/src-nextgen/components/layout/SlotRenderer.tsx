// ✅ SlotRenderer: auto-wired to LayoutShell
import React from 'react';
import { View, SafeAreaView } from 'react-native';

import TopSlot from './TopSlot';
import BottomSlot from './BottomSlot';

const SlotRenderer = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopSlot />
      <View style={{ flex: 1 }} />
      <BottomSlot />
    </SafeAreaView>
  );
};

export default SlotRenderer; 