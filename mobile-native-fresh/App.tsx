import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './src-nextgen/providers/ThemeProvider';
import { NavigationProvider } from './src-nextgen/providers/NavigationProvider';
import { SafeAreaProvider as NextGenSafeAreaProvider } from './src-nextgen/providers/SafeAreaProvider';
import { SlotZoneProvider } from './src-nextgen/hooks/useSlotZone';
import { startRuntimeValidator } from './src/lib/runtimeValidator';

// Initialize runtime validator
startRuntimeValidator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NextGenSafeAreaProvider>
          <NavigationProvider>
            <SlotZoneProvider>
              {/* LayoutShell is now rendered inside RootNavigator's LayoutRoot screen */}
              <></>
            </SlotZoneProvider>
          </NavigationProvider>
        </NextGenSafeAreaProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
