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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Dashboard</Text>
        <ThoughtmarkCard slotType="DASHBOARD_ENTRY" />
        <TaskCard slotType="TASKS_ENTRY" />
        <AIToolsCard slotType="AI_TOOLS_ENTRY" />
      </View>
    </ScrollView>
  );
}; 