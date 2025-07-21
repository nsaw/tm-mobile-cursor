// FORCED HYDRATION ENVIRONMENT STORE - Read from env.app before render phase
import { create } from 'zustand';
import * as FileSystem from 'expo-file-system';

let initialized = false;

export const useEnvironmentStore = create<{
  environment: 'legacy' | 'nextgen';
  useNextGen: boolean;
  hydrationSource: 'file' | 'process.env' | 'fallback';
  init: () => Promise<void>;
}>(() => ({
  environment: 'legacy',
  useNextGen: false,
  hydrationSource: 'fallback',
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
      
      // SET ZUSTAND STATE BEFORE RENDER PHASE
      useEnvironmentStore.setState({ 
        useNextGen: environment === 'nextgen', 
        environment,
        hydrationSource
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
      // Fallback to process.env but log warning
      const processEnvEnvironment = process.env.EXPO_PUBLIC_ENVIRONMENT;
      const fallbackEnvironment = processEnvEnvironment === 'nextgen' ? 'nextgen' : 'legacy';
      
      console.warn(`⚠️ FORCED HYDRATION: EnvironmentStore falling back to process.env (${fallbackEnvironment}) due to file read error`);
      
      useEnvironmentStore.setState({ 
        useNextGen: fallbackEnvironment === 'nextgen', 
        environment: fallbackEnvironment,
        hydrationSource: 'process.env'
      });
      
      initialized = true;
    }
  }
})); 