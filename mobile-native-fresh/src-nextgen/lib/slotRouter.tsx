import React from 'react';
import { Text } from 'react-native';

import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { TaskCard } from '../components/TaskCard';
import { AIToolsCard } from '../components/AIToolsCard';

declare const console: any;

export function SlotRouter(slot: string): React.JSX.Element {
  console.log(`[SlotRouter] Resolving slot: ${slot}`);

  switch (slot) {
    case 'MOCK_DASHBOARD_ENTRY':
      return <ThoughtmarkCard slotType="DASHBOARD_ENTRY" />;
    case 'MOCK_TASKS_ENTRY':
      return <TaskCard slotType="TASKS_ENTRY" />;
    case 'MOCK_AI_TOOLS_ENTRY':
      return <AIToolsCard slotType="AI_TOOLS_ENTRY" />;
    default:
      return <Text>🔘 Unmapped slot: {slot}</Text>;
  }
} 