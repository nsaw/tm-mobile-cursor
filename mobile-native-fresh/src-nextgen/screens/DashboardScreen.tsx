import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { TaskCard } from '../components/TaskCard';
import { AIToolsCard } from '../components/AIToolsCard';

export const DashboardScreen = (): React.JSX.Element => {
  const { thoughtmarks: _thoughtmarks } = useThoughtmarks();
  const { bins: _bins } = useBins();

  // Mock thoughtmark for dashboard entry
  const mockThoughtmark = {
    id: 'dashboard-entry',
    title: 'Welcome to Thoughtmarks',
    content: 'Start creating and organizing your thoughts with our powerful tools.',
    author: 'System',
    tags: ['welcome', 'getting-started'],
    binId: 'default',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 0,
    comments: 0,
    shares: 0,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Dashboard</Text>
        <ThoughtmarkCard thoughtmark={mockThoughtmark} slotType="DASHBOARD_ENTRY" />
        <TaskCard slotType="TASKS_ENTRY" />
        <AIToolsCard slotType="AI_TOOLS_ENTRY" />
      </View>
    </ScrollView>
  );
}; 