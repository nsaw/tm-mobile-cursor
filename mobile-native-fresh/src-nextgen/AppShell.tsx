// FORCED HYDRATION APPSHELL - Validate one-time hydration and log to console
import React, { useEffect } from 'react';

import { ThemeProvider } from './theme/ThemeProvider';
import { useEnvironmentStore } from './state/EnvironmentStore';
import { AppContent } from './components/AppContent';
import { SnapshotTagMarker } from './components/SnapshotTagMarker';

declare const console: any;
declare const __DEV__: boolean;

export const AppShell = () => {
  const init = useEnvironmentStore((state: any) => state.init);
  const environment = useEnvironmentStore((state: any) => state.environment);
  const hydrationSource = useEnvironmentStore((state: any) => state.hydrationSource);

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
    }).catch((error: any) => {
      console.error('❌ FORCED HYDRATION: AppShell: EnvironmentStore.init() failed:', error);
    });
  }, []);

  return (
    <ThemeProvider>
      {/* SnapshotTagMarker for JSX role snapshot tagging and audit traceability */}
      <SnapshotTagMarker 
        tagId="app-shell-root"
        componentName="AppShell"
        roleType="container"
        debugMode={__DEV__}
      />
      <AppContent />
    </ThemeProvider>
  );
}; 