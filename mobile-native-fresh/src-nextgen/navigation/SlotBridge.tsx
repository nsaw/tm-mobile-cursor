import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';

declare const console: any;

export default function SlotBridge() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  
  useEffect(() => {
    if (!route?.name) console.error('SlotBridge missing route context');
  }, [route?.name]);
  
  return null;
} 