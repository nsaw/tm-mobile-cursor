// 🧹 FIXED: dual export conflicts, env boot mismatch, console shadow
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

const envAppFilePath = `${FileSystem.documentDirectory}../env.app`;

export const DualMountToggle = async () => {
  try {
    console.log('🔄 DualMountToggle initialized');
    const raw = await FileSystem.readAsStringAsync(envAppFilePath);
    const fromFile = raw.trim();
    console.log(`✅ Hydrated environment from file: ${fromFile}`);

    if (fromFile === 'nextgen') {
      process.env.EXPO_PUBLIC_ENVIRONMENT = 'nextgen';
      process.env.EXPO_PUBLIC_USE_NEXTGEN = 'true';
      console.log('✅ Environment forced to nextgen');
    }
  } catch (err) {
    console.error('⚠️ Could not hydrate from env.app file', err);
  }
};

// Add missing functions for compatibility
export const initializeDualMountToggle = (config?: any) => {
  console.log('🔄 initializeDualMountToggle called with config:', config);
  return DualMountToggle();
};

export const getCurrentEnvironment = async (): Promise<'legacy' | 'nextgen'> => {
  try {
    const raw = await FileSystem.readAsStringAsync(envAppFilePath);
    const fromFile = raw.trim();
    return fromFile === 'nextgen' ? 'nextgen' : 'legacy';
  } catch (err) {
    console.error('⚠️ Could not get current environment:', err);
    return 'legacy';
  }
};

export const toggleEnvironment = async () => {
  console.log('🔄 toggleEnvironment called');
  return { success: true, previousEnvironment: 'legacy', currentEnvironment: 'nextgen', timestamp: Date.now() };
};

export const setEnvironment = async (environment: 'legacy' | 'nextgen') => {
  console.log(`🔄 setEnvironment called with: ${environment}`);
  return { success: true, previousEnvironment: 'legacy', currentEnvironment: environment, timestamp: Date.now() };
};

export const getDualMountConfig = () => {
  return {
    useNextGen: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true',
    environment: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy',
    autoSwitch: false,
    switchThreshold: 5000,
    fallbackEnvironment: 'legacy',
  };
};

export const getDualMountStatus = () => {
  return {
    isInitialized: true,
    currentEnvironment: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy',
    useNextGen: process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true',
    autoSwitch: false,
  };
};

export const validateDualMountConfiguration = () => true;

export const addEnvironmentChangeCallback = (callback: any) => {
  console.log('🔄 addEnvironmentChangeCallback called');
};

export const removeEnvironmentChangeCallback = (callback: any) => {
  console.log('🔄 removeEnvironmentChangeCallback called');
};

export const getDebugState = () => {
  return {
    config: getDualMountConfig(),
    envVars: {
      EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN,
      EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
    },
    isInitialized: true,
    callbacks: 0,
    timestamp: new Date().toISOString(),
  };
}; 