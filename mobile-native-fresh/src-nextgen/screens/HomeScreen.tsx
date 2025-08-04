import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { ThoughtmarkCard } from '../components/ThoughtmarkCard';
import { SlotGrid } from '../components/SlotGrid';

export const HomeScreen = () => {
  const { thoughtmarks } = useThoughtmarks();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ padding: 16, gap: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Home</Text>
        <SlotGrid />
        {thoughtmarks.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Recent Thoughtmarks</Text>
            {thoughtmarks.slice(0, 3).map(tm => (
              <ThoughtmarkCard key={tm.id} slotType="HOME_RECENT" />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}; 