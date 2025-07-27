// src-nextgen/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from './providers/ThemeProvider';
import { NavigationProvider } from './providers/NavigationProvider';
import { SafeAreaProvider as NextGenSafeAreaProvider } from './providers/SafeAreaProvider';
import { SlotZoneProvider } from './hooks/useSlotZone';
import LayoutShell from './layout/LayoutShell';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NextGenSafeAreaProvider>
          <NavigationProvider>
            <SlotZoneProvider>
              <LayoutShell>
                {/* App content will be rendered here */}
                <></>
              </LayoutShell>
            </SlotZoneProvider>
          </NavigationProvider>
        </NextGenSafeAreaProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
} 