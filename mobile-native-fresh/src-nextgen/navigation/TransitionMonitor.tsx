import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

declare const console: any;
declare const setTimeout: any;

interface TransitionEvent {
  timestamp: number;
  fromRoute: string;
  toRoute: string;
  duration: number;
  success: boolean;
}

export default function TransitionMonitor() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  // const navigation = useNavigation(); // Unused for now
  const [transitions, setTransitions] = useState<TransitionEvent[]>([]);
  const [currentTransition, setCurrentTransition] = useState<Partial<TransitionEvent> | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const fromRoute = transitions[transitions.length - 1]?.toRoute || 'initial';
    const toRoute = route?.name || 'unknown';

    if (fromRoute !== toRoute) {
      setCurrentTransition({
        timestamp: startTime,
        fromRoute,
        toRoute
      });

      // Simulate transition completion
      setTimeout(() => {
        const duration = Date.now() - startTime;
        const transitionEvent: TransitionEvent = {
          timestamp: startTime,
          fromRoute,
          toRoute,
          duration,
          success: true
        };

        setTransitions(prev => [...prev, transitionEvent]);
        setCurrentTransition(null);

        console.log('[TransitionMonitor] Transition completed:', {
          from: fromRoute,
          to: toRoute,
          duration,
          totalTransitions: transitions.length + 1
        });
      }, 100);
    }
  }, [route?.name]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transition Monitor</Text>
      <Text style={styles.info}>Current Route: {route?.name || 'undefined'}</Text>
      <Text style={styles.info}>Total Transitions: {transitions.length}</Text>
      {currentTransition && (
        <Text style={styles.transitioning}>Transitioning: {currentTransition.fromRoute} → {currentTransition.toRoute}</Text>
      )}
      {transitions.slice(-3).map((t, i) => (
        <Text key={i} style={styles.transition}>
          {t.fromRoute} → {t.toRoute} ({t.duration}ms)
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff3cd',
    margin: 5,
    borderRadius: 5
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  info: {
    fontSize: 12,
    marginBottom: 2
  },
  transitioning: {
    fontSize: 12,
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 5
  },
  transition: {
    fontSize: 11,
    color: '#666',
    marginTop: 2
  }
}); 