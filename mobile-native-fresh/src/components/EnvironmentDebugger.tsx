import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useEnvironmentStore } from '../state/EnvironmentStore';

export const EnvironmentDebugger: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const [debugState, setDebugState] = useState<any>(null);
  const [toggleCount, setToggleCount] = useState(0);
  const { environment, useNextGen } = useEnvironmentStore();

  useEffect(() => {
    setDebugState({ environment, useNextGen });
  }, [environment, useNextGen]);

  if (!visible) return null;

  const envText = environment ? environment.toUpperCase() : 'UNKNOWN';

  return (
    <View role="Wrapper" style={{ padding: 16 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>🔍 Environment Debugger</Text>
      <Text style={{ color: 'white' }}>Current: {envText}</Text>
      <Text style={{ color: 'white' }}>useNextGen: {String(useNextGen)}</Text>
      <Text style={{ color: 'white' }}>Toggle Count: {toggleCount}</Text>
    </View>
  );
}; 