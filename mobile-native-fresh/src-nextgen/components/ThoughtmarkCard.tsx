import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

declare const console: any;

export const ThoughtmarkCard = () => {
  useEffect(() => console.log('🧠 Slot type: thoughtmark'), []);
  return (
    <View style={{ padding: 16, borderRadius: 12, backgroundColor: '#222' }}>
      <Text style={{ color: 'white' }}>🧠 ThoughtmarkCard</Text>
    </View>
  );
}; 