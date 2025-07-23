// src-nextgen/App.tsx
import React from 'react';

import { useAppState } from './state/store';
import { ThemeProvider } from './providers/ThemeProvider';
import { NavigationProvider } from './providers/NavigationProvider';
import { SafeAreaProvider } from './providers/SafeAreaProvider';
import { SlotZoneProvider } from './hooks/useSlotZone';
import { LayoutShell } from './layout/LayoutShell';

export default function NextGenApp() {
  useAppState();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationProvider>
          <SlotZoneProvider>
            <LayoutShell />
          </SlotZoneProvider>
        </NavigationProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
} 