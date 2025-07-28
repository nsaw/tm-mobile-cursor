import React from 'react';
import { View, Text } from 'react-native';

import { useSlotMode } from '../state/slotMode';
declare const console: any;

type Props = { slotType: string };

export const TaskCard = ({ slotType }: Props) => {
  const [slotMode] = useSlotMode();
  const isMock = slotMode === 'mock';
  console.log(`TaskCard: [${slotType}] Rendering (${slotMode} mode)`);
  const tasks = isMock ? [{ id: 't1', title: 'Refactor ghost bridge' }] : [];
  return (
    <View style={{ backgroundColor: '#444', padding: 12, borderRadius: 12 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>✅ Tasks</Text>
      {tasks.map(task => (
        <Text key={task.id} style={{ color: 'white', marginTop: 4 }}>• {task.title}</Text>
      ))}
    </View>
  );
}; 