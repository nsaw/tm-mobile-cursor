import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import ContextValidator from './ContextValidator';
import TransitionMonitor from './TransitionMonitor';
import DeepNestingTest from './DeepNestingTest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [route]);

  // If we can't access navigation context, show fallback UI with validation
  if (!route || !route.name) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackTitle}>
          Navigation context unavailable
        </Text>
        <Text style={styles.fallbackSubtitle}>
          Fallback mode activated - context validation disabled
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ContextValidator />
      <TransitionMonitor />
      <DeepNestingTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fallbackContainer: {
    padding: 20,
    backgroundColor: '#ffe6e6'
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red'
  },
  fallbackSubtitle: {
    fontSize: 12,
    marginTop: 5
  }
}); 