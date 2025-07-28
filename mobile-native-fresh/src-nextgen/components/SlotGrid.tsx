import React from 'react';
import { View } from 'react-native';

import { ThoughtmarkCard } from './ThoughtmarkCard';
import { TaskCard } from './TaskCard';
import { AIToolsCard } from './AIToolsCard';

export const SlotGrid = () => {
  return (
    <View style={{ gap: 16 }}>
      <ThoughtmarkCard slotType="DASHBOARD_ENTRY" />
      <TaskCard slotType="TASKS_ENTRY" />
      <AIToolsCard slotType="AI_TOOLS_ENTRY" />
    </View>
  );
}; 