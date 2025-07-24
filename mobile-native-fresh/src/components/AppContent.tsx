// PATCHED FOR SAFE STORE INIT
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeProvider';

import { SessionHydrationGuard } from './ui/SessionHydrationGuard';
import { EnvironmentDebugger } from './EnvironmentDebugger';

export const AppContent = () => {
  const { tokens: designTokens } = useTheme();

  console.log('📱 AppContent mounted');

  return (
    <SessionHydrationGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
        <StatusBar style="light" />
        <AppNavigator />
        <EnvironmentDebugger visible={true} />
      </SafeAreaView>
    </SessionHydrationGuard>
  );
}; 