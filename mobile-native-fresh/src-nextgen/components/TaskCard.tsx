import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TaskCardProps {
  slotType?: string;
  task?: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
  };
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  slotType = 'DEFAULT',
  task 
}) => {
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 8,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: task?.completed ? '#4CAF50' : '#FF9800',
      }}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          {task?.title || 'Task Card'}
        </Text>
        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>
          {task?.description || 'Task description...'}
        </Text>
        <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
          Slot: {slotType} | Status: {task?.completed ? 'Completed' : 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}; 