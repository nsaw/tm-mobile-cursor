import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SlotGridProps {
  slots?: Array<{
    id: string;
    title: string;
    description: string;
    type: 'thoughtmark' | 'task' | 'tool';
  }>;
}

export const SlotGrid: React.FC<SlotGridProps> = ({ 
  slots = [
    { id: '1', title: 'Quick Note', description: 'Capture a thought', type: 'thoughtmark' },
    { id: '2', title: 'New Task', description: 'Create a task', type: 'task' },
    { id: '3', title: 'AI Assistant', description: 'Get help', type: 'tool' },
    { id: '4', title: 'Search', description: 'Find content', type: 'thoughtmark' },
  ]
}) => {
  const getSlotColor = (type: string) => {
    switch (type) {
      case 'thoughtmark': return '#4CAF50';
      case 'task': return '#FF9800';
      case 'tool': return '#2196F3';
      default: return '#666';
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Quick Actions</Text>
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 8,
        justifyContent: 'space-between'
      }}>
        {slots.map(slot => (
          <TouchableOpacity
            key={slot.id}
            style={{
              backgroundColor: '#333',
              padding: 16,
              borderRadius: 8,
              width: '48%',
              borderLeftWidth: 4,
              borderLeftColor: getSlotColor(slot.type),
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              {slot.title}
            </Text>
            <Text style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>
              {slot.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}; 