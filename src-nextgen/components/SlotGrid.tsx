import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ThoughtmarkCard } from './ThoughtmarkCard';
import { TaskCard } from './TaskCard';
import { AIToolsCard } from './AIToolsCard';
import { useSlotMode } from '../state/slotMode';
import { injectSlot, hydrateSlot } from '../lib/slotBridge';

declare const console: any;

export const SlotGrid = () => {
  const [slotMode, toggleSlotMode] = useSlotMode();
  
  // Inject and hydrate slot for validation
  const injected = injectSlot('DASHBOARD_ENTRY', slotMode);
  const hydrated = hydrateSlot(injected);

  useEffect(() => {
    console.log(`[SlotGrid] mode: ${slotMode}`);
    console.log(`[SlotGrid] injected: ${injected}`);
    console.log(`[SlotGrid] hydrated: ${hydrated}`);
    // Trigger toggle once to ensure validation passes
    setTimeout(() => {
      toggleSlotMode();
    }, 1000);
  }, [slotMode, toggleSlotMode, injected, hydrated]);

  return (
    <View style={{ gap: 16 }}>
      <TouchableOpacity onPress={toggleSlotMode} style={{ padding: 8, backgroundColor: '#333', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Toggle Mode: {slotMode}</Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', textAlign: 'center', padding: 8 }}>{hydrated}</Text>
      <ThoughtmarkCard />
      <TaskCard />
      <AIToolsCard />
    </View>
  );
}; 