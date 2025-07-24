// PATCHED TO MOUNT GUARANTEED APPSHELL
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src/theme/ThemeProvider';
import DualMountBootstrap from './src/utils/dualMountBootstrap';
import { AppShell } from './src/AppShell';

export default function App() {
  console.log('🌍 App root mounted');
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DualMountBootstrap>
          <AppShell />
        </DualMountBootstrap>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
