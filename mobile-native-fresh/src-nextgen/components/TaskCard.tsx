import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

declare const console: any;

export const TaskCard = () => {
  useEffect(() => console.log('✅ Slot type: task'), []);
  return (
    <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#444' }}>
      <Text style={{ color: 'white' }}>✅ TaskCard</Text>
    </View>
  );
}; 