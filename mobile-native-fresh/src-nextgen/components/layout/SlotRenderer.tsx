// ✅ SlotRenderer: auto-wired to LayoutShell
import React from 'react';
import TopSlot from './TopSlot';
import BottomSlot from './BottomSlot';
import { View, SafeAreaView } from 'react-native';

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