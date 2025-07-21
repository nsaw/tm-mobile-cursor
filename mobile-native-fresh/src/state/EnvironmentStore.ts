// FORCED HYDRATION ENVIRONMENT STORE - Read from env.app before render phase
// ENHANCED: Includes last-mile guard, hydration status, AppShell fallback resolver, and Zustand snapshot persistence
import { create } from 'zustand';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

let initialized = false;
let memorySnapshot: any = null;

interface EnvironmentStore {
  environment: 'legacy' | 'nextgen';
  useNextGen: boolean;
  hydrationSource: 'file' | 'process.env' | 'fallback' | 'memory' | 'cache';
  hydrationStatus: 'pending' | 'success' | 'failed' | 'blocked';
  lastHydrationAttempt: number;
  memorySnapshot: any;
  init: () => Promise<void>;
  forceHydration: () => Promise<void>;
  getHydrationStatus: () => { status: string; source: string; environment: string };
  snapshot: () => Promise<void>;
  rehydrate: () => Promise<boolean>;
  clearMemory: () => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
  environment: 'legacy',
  useNextGen: false,
  hydrationSource: 'fallback',
  hydrationStatus: 'pending',
  lastHydrationAttempt: 0,
  memorySnapshot: null,
  
  init: async () => {
    if (initialized) {
      console.log('🔄 EnvironmentStore already initialized, checking memory fallback...');
      
      // CHECK MEMORY FALLBACK: Try to restore from memory snapshot
      const currentState = get();
      if (currentState.memorySnapshot && currentState.hydrationSource === 'memory') {
        console.log('✅ FORCED HYDRATION: EnvironmentStore resolved source: memory');
        console.log(`✅ FORCED HYDRATION: Zustand snapshot restored from memory - environment=${currentState.environment}`);
        return;
      }
      
      // Try to rehydrate from cache
      const rehydrated = await get().rehydrate();
      if (rehydrated) {
        console.log('✅ FORCED HYDRATION: EnvironmentStore resolved source: cache');
        return;
      }
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
      let hydrationSource: 'file' | 'process.env' | 'fallback' | 'memory' | 'cache' = 'file';
      
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
      
      // CREATE MEMORY SNAPSHOT: Capture current state for persistence
      const snapshot = {
        environment,
        useNextGen: environment === 'nextgen',
        hydrationSource,
        hydrationStatus: 'success' as const,
        lastHydrationAttempt: Date.now(),
        timestamp: Date.now()
      };
      
      // SET ZUSTAND STATE BEFORE RENDER PHASE
      set({ 
        useNextGen: environment === 'nextgen', 
        environment,
        hydrationSource,
        hydrationStatus: 'success',
        lastHydrationAttempt: Date.now(),
        memorySnapshot: snapshot
      });
      
      // PERSIST SNAPSHOT: Save to memory and cache
      await get().snapshot();
      
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
      
      // MEMORY FALLBACK: Try to restore from memory if file read fails
      const rehydrated = await get().rehydrate();
      if (rehydrated) {
        console.log('✅ FORCED HYDRATION: EnvironmentStore resolved source: memory (fallback)');
        initialized = true;
        return;
      }
      
      // APPSHELL FALLBACK RESOLVER: Enhanced fallback logic
      const processEnvEnvironment = process.env.EXPO_PUBLIC_ENVIRONMENT;
      const fallbackEnvironment = processEnvEnvironment === 'nextgen' ? 'nextgen' : 'legacy';
      
      console.warn(`⚠️ FORCED HYDRATION: EnvironmentStore falling back to process.env (${fallbackEnvironment}) due to file read error`);
      
      // LAST-MILE GUARD FOR FALLBACK: Ensure consistency
      if (fallbackEnvironment === 'nextgen') {
        process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
        console.log('✅ FORCED HYDRATION: EnvironmentStore fallback guard overrode process.env to nextgen');
      }
      
      const snapshot = {
        environment: fallbackEnvironment,
        useNextGen: fallbackEnvironment === 'nextgen',
        hydrationSource: 'process.env' as const,
        hydrationStatus: 'failed' as const,
        lastHydrationAttempt: Date.now(),
        timestamp: Date.now()
      };
      
      set({ 
        useNextGen: fallbackEnvironment === 'nextgen', 
        environment: fallbackEnvironment,
        hydrationSource: 'process.env',
        hydrationStatus: 'failed',
        lastHydrationAttempt: Date.now(),
        memorySnapshot: snapshot
      });
      
      // PERSIST FALLBACK SNAPSHOT
      await get().snapshot();
      
      initialized = true;
    }
  },
  
  forceHydration: async () => {
    console.log('🔄 FORCED HYDRATION: EnvironmentStore.forceHydration() called...');
    
    try {
      // Reset hydration state
      set({
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
      
      const snapshot = {
        environment,
        useNextGen: environment === 'nextgen',
        hydrationSource: 'file' as const,
        hydrationStatus: 'success' as const,
        lastHydrationAttempt: Date.now(),
        timestamp: Date.now()
      };
      
      set({
        environment,
        useNextGen: environment === 'nextgen',
        hydrationSource: 'file',
        hydrationStatus: 'success',
        lastHydrationAttempt: Date.now(),
        memorySnapshot: snapshot
      });
      
      // PERSIST UPDATED SNAPSHOT
      await get().snapshot();
      
      console.log(`✅ FORCED HYDRATION: forceHydration completed - environment=${environment}`);
      
    } catch (error) {
      console.error('❌ FORCED HYDRATION: forceHydration failed:', error);
      set({
        hydrationStatus: 'failed',
        lastHydrationAttempt: Date.now()
      });
    }
  },
  
  snapshot: async () => {
    try {
      const state = get();
      const snapshot = {
        environment: state.environment,
        useNextGen: state.useNextGen,
        hydrationSource: state.hydrationSource,
        hydrationStatus: state.hydrationStatus,
        lastHydrationAttempt: state.lastHydrationAttempt,
        timestamp: Date.now()
      };
      
      // SAVE TO MEMORY
      memorySnapshot = snapshot;
      
      // SAVE TO ASYNC STORAGE
      await AsyncStorage.setItem('environment_store_snapshot', JSON.stringify(snapshot));
      
      console.log(`✅ FORCED HYDRATION: Zustand snapshot saved - environment=${snapshot.environment}, source=${snapshot.hydrationSource}`);
      
    } catch (error) {
      console.error('❌ FORCED HYDRATION: Snapshot save failed:', error);
    }
  },
  
  rehydrate: async (): Promise<boolean> => {
    try {
      // TRY MEMORY FIRST
      if (memorySnapshot && memorySnapshot.timestamp) {
        const age = Date.now() - memorySnapshot.timestamp;
        if (age < 300000) { // 5 minutes
          set({
            environment: memorySnapshot.environment,
            useNextGen: memorySnapshot.useNextGen,
            hydrationSource: 'memory',
            hydrationStatus: memorySnapshot.hydrationStatus,
            lastHydrationAttempt: memorySnapshot.lastHydrationAttempt,
            memorySnapshot
          });
          
          console.log(`✅ FORCED HYDRATION: Zustand snapshot restored from memory - environment=${memorySnapshot.environment}`);
          return true;
        }
      }
      
      // TRY ASYNC STORAGE
      const stored = await AsyncStorage.getItem('environment_store_snapshot');
      if (stored) {
        const snapshot = JSON.parse(stored);
        const age = Date.now() - snapshot.timestamp;
        
        if (age < 300000) { // 5 minutes
          set({
            environment: snapshot.environment,
            useNextGen: snapshot.useNextGen,
            hydrationSource: 'cache',
            hydrationStatus: snapshot.hydrationStatus,
            lastHydrationAttempt: snapshot.lastHydrationAttempt,
            memorySnapshot: snapshot
          });
          
          // RESTORE MEMORY SNAPSHOT
          memorySnapshot = snapshot;
          
          console.log(`✅ FORCED HYDRATION: Zustand snapshot restored from cache - environment=${snapshot.environment}`);
          return true;
        }
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ FORCED HYDRATION: Rehydrate failed:', error);
      return false;
    }
  },
  
  clearMemory: () => {
    memorySnapshot = null;
    AsyncStorage.removeItem('environment_store_snapshot').catch(console.error);
    console.log('🧹 FORCED HYDRATION: Environment memory cleared');
  },
  
  getHydrationStatus: (): { status: string; source: string; environment: string } => {
    const state = get();
    return {
      status: state.hydrationStatus,
      source: state.hydrationSource,
      environment: state.environment
    };
  }
})); 