import React from 'react';
import { View, Text } from 'react-native';

import { useSlotMode } from '../state/slotMode';
declare const console: any;

type Props = { slotType: string };

export const ThoughtmarkCard = ({ slotType }: Props) => {
  const [slotMode] = useSlotMode();
  const isMock = slotMode === 'mock';
  console.log(`ThoughtmarkCard: [${slotType}] Rendering (${slotMode} mode)`);
  const thoughtmarks = isMock ? [{ id: 'tm1', title: '📌 Quantum Theory' }] : [];
  return (
    <View style={{ backgroundColor: '#222', padding: 12, borderRadius: 12 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>🧠 Thoughtmarks</Text>
      {thoughtmarks.map(tm => (
        <Text key={tm.id} style={{ color: 'white', marginTop: 4 }}>{tm.title}</Text>
      ))}
    </View>
  );
}; 