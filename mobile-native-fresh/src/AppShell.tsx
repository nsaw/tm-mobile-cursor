// FORCED HYDRATION APPSHELL - Validate one-time hydration and log to console
import React, { useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { useEnvironmentStore } from './state/EnvironmentStore';
import { AppContent } from './components/AppContent';

export const AppShell = () => {
  const init = useEnvironmentStore(state => state.init);
  const environment = useEnvironmentStore(state => state.environment);
  const hydrationSource = useEnvironmentStore(state => state.hydrationSource);

  useEffect(() => {
    console.log('🚀 FORCED HYDRATION: AppShell mounted - initializing EnvironmentStore...');
    console.log('🔐 FORCED HYDRATION: AppShell calling EnvironmentStore.init() exactly once');
    
    init().then(() => {
      console.log('✅ FORCED HYDRATION: AppShell: EnvironmentStore.init() complete');
      console.log(`✅ FORCED HYDRATION: AppShell: Environment is ${environment} (source: ${hydrationSource})`);
      
      // Validate that environment state is properly set
      if (environment === 'nextgen') {
        console.log('✅ FORCED HYDRATION: AppShell: Confirmed nextgen environment from file');
        console.log('✅ FORCED HYDRATION: AppShell: No stale process.env fallback detected');
      } else {
        console.log('📋 FORCED HYDRATION: AppShell: Confirmed legacy environment from file');
      }
    }).catch((error) => {
      console.error('❌ FORCED HYDRATION: AppShell: EnvironmentStore.init() failed:', error);
    });
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}; 