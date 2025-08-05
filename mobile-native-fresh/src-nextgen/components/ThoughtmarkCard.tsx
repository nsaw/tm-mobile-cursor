import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ThoughtmarkCardProps {
  slotType?: string;
  thoughtmark?: {
    id: string;
    title: string;
    content: string;
  };
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({ 
  slotType = 'DEFAULT',
  thoughtmark 
}) => {
  return (
    <TouchableOpacity 
      style={{
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 8,
        marginVertical: 4,
      }}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <View>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          {thoughtmark?.title || 'Thoughtmark Card'}
        </Text>
        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>
          {thoughtmark?.content || 'Content preview...'}
        </Text>
        <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
          Slot: {slotType}
        </Text>
      </View>
    </TouchableOpacity>
  );
}; 