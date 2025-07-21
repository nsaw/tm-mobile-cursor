// FORCED HYDRATION ENVIRONMENT STORE - Read from env.app before render phase
// ENHANCED: Includes last-mile guard, hydration status, and AppShell fallback resolver
import { create } from 'zustand';
import * as FileSystem from 'expo-file-system';

let initialized = false;

interface EnvironmentStore {
  environment: 'legacy' | 'nextgen';
  useNextGen: boolean;
  hydrationSource: 'file' | 'process.env' | 'fallback';
  hydrationStatus: 'pending' | 'success' | 'failed' | 'blocked';
  lastHydrationAttempt: number;
  init: () => Promise<void>;
  forceHydration: () => Promise<void>;
  getHydrationStatus: () => { status: string; source: string; environment: string };
}

export const useEnvironmentStore = create<EnvironmentStore>(() => ({
  environment: 'legacy',
  useNextGen: false,
  hydrationSource: 'fallback',
  hydrationStatus: 'pending',
  lastHydrationAttempt: 0,
  init: async () => {
    if (initialized) {
      console.log('🔄 EnvironmentStore already initialized, skipping...');
      return;
    }
    
    console.log('🔐 FORCED HYDRATION: EnvironmentStore.init() - Reading from env.app file...');
    
    try {
      // FORCE READ FROM ENV.APP FILE (source of truth)
      const envPath = `${FileSystem.documentDirectory}env.app`;
      const fileContents = await FileSystem.readAsStringAsync(envPath);
      
      console.log('✅ FORCED HYDRATION: Successfully read env.app file in EnvironmentStore');
      
      // Parse environment from file content
      const lines = fileContents.split('\n');
      let environment: 'legacy' | 'nextgen' = 'legacy';
      let hydrationSource: 'file' | 'process.env' | 'fallback' = 'file';
      
      for (const line of lines) {
        if (line.startsWith('EXPO_PUBLIC_ENVIRONMENT=')) {
          const envValue = line.split('=')[1]?.trim();
          if (envValue === 'nextgen') {
            environment = 'nextgen';
            console.log('✅ FORCED HYDRATION: EnvironmentStore setting nextgen from file');
            break;
          }
        }
      }
      
      // BLOCK PROCESS.ENV FALLBACK
      const processEnvEnvironment = process.env.EXPO_PUBLIC_ENVIRONMENT;
      if (processEnvEnvironment && processEnvEnvironment !== environment) {
        console.warn(`⚠️ FORCED HYDRATION: EnvironmentStore blocking stale process.env value (${processEnvEnvironment}) in favor of file value (${environment})`);
      }
      
      // LAST-MILE GUARD: Ensure process.env is overridden for runtime consistency
      if (environment === 'nextgen' && process.env.EXPO_PUBLIC_ENVIRONMENT !== 'nextgen') {
        process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
        console.log('✅ FORCED HYDRATION: EnvironmentStore last-mile guard overrode process.env to nextgen');
      }
      
      // SET ZUSTAND STATE BEFORE RENDER PHASE
      useEnvironmentStore.setState({ 
        useNextGen: environment === 'nextgen', 
        environment,
        hydrationSource,
        hydrationStatus: 'success',
        lastHydrationAttempt: Date.now()
      });
      
      if (environment === 'nextgen') {
        console.log('✅ FORCED HYDRATION: EnvironmentStore hydrated nextgen from file');
        console.log('✅ FORCED HYDRATION: Setting environment to nextgen from file');
      } else {
        console.log('📋 FORCED HYDRATION: EnvironmentStore hydrated legacy from file');
      }
      
      initialized = true;
      console.log('✅ FORCED HYDRATION: EnvironmentStore.init() complete');
      
    } catch (error) {
      console.error('❌ FORCED HYDRATION: EnvironmentStore.init() failed:', error);
      
      // APPSHELL FALLBACK RESOLVER: Enhanced fallback logic
      const processEnvEnvironment = process.env.EXPO_PUBLIC_ENVIRONMENT;
      const fallbackEnvironment = processEnvEnvironment === 'nextgen' ? 'nextgen' : 'legacy';
      
      console.warn(`⚠️ FORCED HYDRATION: EnvironmentStore falling back to process.env (${fallbackEnvironment}) due to file read error`);
      
      // LAST-MILE GUARD FOR FALLBACK: Ensure consistency
      if (fallbackEnvironment === 'nextgen') {
        process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
        console.log('✅ FORCED HYDRATION: EnvironmentStore fallback guard overrode process.env to nextgen');
      }
      
      useEnvironmentStore.setState({ 
        useNextGen: fallbackEnvironment === 'nextgen', 
        environment: fallbackEnvironment,
        hydrationSource: 'process.env',
        hydrationStatus: 'failed',
        lastHydrationAttempt: Date.now()
      });
      
      initialized = true;
    }
  },
  
  forceHydration: async () => {
    console.log('🔄 FORCED HYDRATION: EnvironmentStore.forceHydration() called...');
    
    try {
      // Reset hydration state
      useEnvironmentStore.setState({
        hydrationStatus: 'pending',
        lastHydrationAttempt: Date.now()
      });
      
      // Force re-read from file
      const envPath = `${FileSystem.documentDirectory}env.app`;
      const fileContents = await FileSystem.readAsStringAsync(envPath);
      
      const lines = fileContents.split('\n');
      let environment: 'legacy' | 'nextgen' = 'legacy';
      
      for (const line of lines) {
        if (line.startsWith('EXPO_PUBLIC_ENVIRONMENT=')) {
          const envValue = line.split('=')[1]?.trim();
          if (envValue === 'nextgen') {
            environment = 'nextgen';
            break;
          }
        }
      }
      
      // Force process.env override
      if (environment === 'nextgen') {
        process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
        console.log('✅ FORCED HYDRATION: forceHydration overrode process.env to nextgen');
      }
      
      useEnvironmentStore.setState({
        environment,
        useNextGen: environment === 'nextgen',
        hydrationSource: 'file',
        hydrationStatus: 'success',
        lastHydrationAttempt: Date.now()
      });
      
      console.log(`✅ FORCED HYDRATION: forceHydration completed - environment=${environment}`);
      
    } catch (error) {
      console.error('❌ FORCED HYDRATION: forceHydration failed:', error);
      useEnvironmentStore.setState({
        hydrationStatus: 'failed',
        lastHydrationAttempt: Date.now()
      });
    }
  },
  
  getHydrationStatus: (): { status: string; source: string; environment: string } => {
    const state = useEnvironmentStore.getState();
    return {
      status: state.hydrationStatus,
      source: state.hydrationSource,
      environment: state.environment
    };
  }
})); 