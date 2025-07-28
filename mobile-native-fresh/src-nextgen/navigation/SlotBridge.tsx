import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

declare const console: any;

export default function SlotBridge() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();

  useEffect(() => {
    try {
      if (!route || !route.name) {
        console.warn('⚠️ SlotBridge fallback: route or route.name undefined. Skipping logic.');
      } else {
        console.log(`[SlotBridge] Active route: ${route.name}`);
      }
    } catch (e) {
      console.warn('🛑 SlotBridge: Context access error:', e);
    }
  }, [route?.name]);

  // If we can't access navigation context, show fallback UI
  if (!route || !route.name) {
    return <View><Text>Navigation context unavailable</Text></View>;
  }

  return null;
} 