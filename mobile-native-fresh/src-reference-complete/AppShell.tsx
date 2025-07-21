// THEME WRAPPED APPSHELL ENTRY
import React, { useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { useEnvironmentStore } from './state/EnvironmentStore';
import { AppContent } from './components/AppContent';

export const AppShell = () => {
  const init = useEnvironmentStore(state => state.init);

  useEffect(() => {
    console.log('🚀 AppShell mounted - initializing EnvironmentStore...');
    init().then(() => console.log('✅ AppShell: EnvironmentStore.init() complete'));
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}; 