import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import ContextValidator from './ContextValidator';
import TransitionMonitor from './TransitionMonitor';
import DeepNestingTest from './DeepNestingTest';

declare const console: any;

export default function SlotBridge() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();

  useEffect(() => {
    try {
      if (!route || !route.name) {
        console.warn('⚠️ SlotBridge fallback: route or route.name undefined. Skipping logic.');
      } else {
        console.log(`[SlotBridge] Active route: ${route.name}`);
        console.log(`[SlotBridge] Route params:`, route.params);
        console.log(`[SlotBridge] Context validation started`);
      }
    } catch (e) {
      console.warn('🛑 SlotBridge: Context access error:', e);
    }
  }, [route?.name, route?.params]);

  // If we can't access navigation context, show fallback UI with validation
  if (!route || !route.name) {
    return (
      <View style={{ padding: 20, backgroundColor: '#ffe6e6' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'red' }}>
          Navigation context unavailable
        </Text>
        <Text style={{ fontSize: 12, marginTop: 5 }}>
          Fallback mode activated - context validation disabled
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ContextValidator />
      <TransitionMonitor />
      <DeepNestingTest />
    </View>
  );
} 