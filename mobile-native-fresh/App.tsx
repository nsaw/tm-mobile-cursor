// PATCHED TO MOUNT GUARANTEED APPSHELL
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-reference/theme/ThemeProvider';
import DualMountBootstrap from '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-reference/utils/dualMountBootstrap';
import { AppShell } from '/Users/sawyer/gitSync/tm-mobile-cursor/mobile-native-fresh/src-reference/AppShell';

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
