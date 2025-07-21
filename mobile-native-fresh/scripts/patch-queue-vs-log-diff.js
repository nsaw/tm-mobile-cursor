import React from 'react';
import { View, Text } from 'react-native';
export default function DummyTracer() {
  console.log('[Tracer] DummyTracer.tsx mounted');
  return <View><Text testID="DummyTracer">Tracer Active</Text></View>;
}
