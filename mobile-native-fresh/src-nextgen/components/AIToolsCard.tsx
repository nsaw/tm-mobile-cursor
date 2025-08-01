import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface AIToolsCardProps {
  slotType?: string;
  tool?: {
    id: string;
    name: string;
    description: string;
    status: 'available' | 'busy' | 'offline';
  };
}

export const AIToolsCard: React.FC<AIToolsCardProps> = ({ 
  slotType = 'DEFAULT',
  tool 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <TouchableOpacity 
      style={{
        backgroundColor: '#333',
        padding: 16,
        borderRadius: 8,
        marginVertical: 4,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(tool?.status || 'offline'),
      }}
    >
      <View>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          {tool?.name || 'AI Tool'}
        </Text>
        <Text style={{ color: '#ccc', fontSize: 14, marginTop: 4 }}>
          {tool?.description || 'AI tool description...'}
        </Text>
        <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
          Slot: {slotType} | Status: {tool?.status || 'offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}; 