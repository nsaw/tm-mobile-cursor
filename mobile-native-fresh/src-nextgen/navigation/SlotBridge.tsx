import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';

declare const console: any;

export default function SlotBridge() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();

  useEffect(() => {
    const routeName = route?.name || '[undefined]';
    if (!route?.name) {
      console.warn('⚠️ SlotBridge fallback: route.name undefined. Injected fallback triggered.');
    }
    console.log(`[SlotBridge] route: ${routeName}`);
  }, [route?.name]);

  return null;
} 