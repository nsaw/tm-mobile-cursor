import React from 'react';
import { View } from 'react-native';

import { ThoughtmarkCard } from './ThoughtmarkCard';
import { TaskCard } from './TaskCard';
import { AIToolsCard } from './AIToolsCard';

export default function SlotGrid() {
  return (
    <View style={{ gap: 16 }}>
      <ThoughtmarkCard />
      <TaskCard />
      <AIToolsCard />
    </View>
  );
} 