import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://gpt-cursor-runner.thoughtmarks.app/status/unified-status.json')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.warn('Status fetch error', err));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <Text>Loading system status...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      {['MAIN', 'CYOPS'].map(agent => (
        <View key={agent} style={{ marginBottom: 24, borderWidth: 1, borderRadius: 12, padding: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{agent}</Text>
          <Text>🧮 Patches: {data[agent].patches.patches}</Text>
          <Text>📦 Completed: {data[agent].patches.completed}</Text>
          <Text>📜 Summaries: {data[agent].patches.summaries}</Text>
          <Text>👻 Ghost: {data[agent].ghost.status}</Text>
          <Text>📆 Updated: {data[agent].lastUpdate}</Text>
        </View>
      ))}
    </ScrollView>
  );
} 