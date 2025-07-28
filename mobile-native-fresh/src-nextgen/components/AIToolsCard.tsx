import React from 'react';
import { View, Text } from 'react-native';

import { useSlotMode } from '../state/slotMode';
declare const console: any;

type Props = { slotType: string };

export const AIToolsCard = ({ slotType }: Props) => {
  const [slotMode] = useSlotMode();
  const isMock = slotMode === 'mock';
  console.log(`AIToolsCard: [${slotType}] Rendering (${slotMode} mode)`);
  const tools = isMock ? [{ id: 'ai1', name: 'Claude View' }] : [];
  return (
    <View style={{ backgroundColor: '#555', padding: 12, borderRadius: 12 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>🤖 AI Tools</Text>
      {tools.map(tool => (
        <Text key={tool.id} style={{ color: 'white', marginTop: 4 }}>• {tool.name}</Text>
      ))}
    </View>
  );
}; 