// src/utils/envValidation.ts
// Environment validation and flag management system

export interface EnvironmentFlags {
  // Dual-mount flags
  USE_NEXTGEN: boolean;
  ENVIRONMENT: 'legacy' | 'nextgen';
  DEBUG_MODE: boolean;
  
  // Feature flags
  ENABLE_VOICE_RECORDING: boolean;
  ENABLE_AI_FEATURES: boolean;
  ENABLE_PREMIUM_FEATURES: boolean;
  
  // App configuration
  APP_NAME: string;
  APP_VERSION: string;
  API_URL: string;
  
  // Development settings
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_ANALYTICS: boolean;
  
  // User-specific flags
  USER_ID: string;
  USER_ROLE: 'user' | 'admin' | 'premium';
  USER_HAS_PREMIUM: boolean;
  USER_HAS_VOICE_ACCESS: boolean;
  USER_HAS_AI_ACCESS: boolean;
  
  // User preferences
  USER_THEME: 'light' | 'dark';
  USER_LANGUAGE: string;
  USER_TIMEZONE: string;
  
  // Account settings
  USER_NOTIFICATIONS: boolean;
  USER_AUTO_BACKUP: boolean;
  USER_SYNC_ENABLED: boolean;
}

// Default values for environment flags
const DEFAULT_FLAGS: EnvironmentFlags = {
  // Dual-mount flags
  USE_NEXTGEN: false,
  ENVIRONMENT: 'legacy',
  DEBUG_MODE: true,
  
  // Feature flags
  ENABLE_VOICE_RECORDING: true,
  ENABLE_AI_FEATURES: true,
  ENABLE_PREMIUM_FEATURES: false,
  
  // App configuration
  APP_NAME: 'Thoughtmarks',
  APP_VERSION: '1.4.1',
  API_URL: 'https://api.thoughtmarks.app',
  
  // Development settings
  LOG_LEVEL: 'debug',
  ENABLE_ANALYTICS: false,
  
  // User-specific flags
  USER_ID: '',
  USER_ROLE: 'user',
  USER_HAS_PREMIUM: false,
  USER_HAS_VOICE_ACCESS: true,
  USER_HAS_AI_ACCESS: true,
  
  // User preferences
  USER_THEME: 'dark',
  USER_LANGUAGE: 'en',
  USER_TIMEZONE: 'UTC',
  
  // Account settings
  USER_NOTIFICATIONS: true,
  USER_AUTO_BACKUP: true,
  USER_SYNC_ENABLED: true,
};

// Environment validation function
export function validateEnvironmentFlags(): EnvironmentFlags {
  const flags: Partial<EnvironmentFlags> = {};
  
  // Dual-mount flags
  flags.USE_NEXTGEN = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
  flags.ENVIRONMENT = (process.env.EXPO_PUBLIC_ENVIRONMENT as 'legacy' | 'nextgen') || 'legacy';
  flags.DEBUG_MODE = process.env.EXPO_PUBLIC_DEBUG_MODE === 'true';
  
  // Feature flags
  flags.ENABLE_VOICE_RECORDING = process.env.EXPO_PUBLIC_ENABLE_VOICE_RECORDING !== 'false';
  flags.ENABLE_AI_FEATURES = process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES !== 'false';
  flags.ENABLE_PREMIUM_FEATURES = process.env.EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES === 'true';
  
  // App configuration
  flags.APP_NAME = process.env.EXPO_PUBLIC_APP_NAME || 'Thoughtmarks';
  flags.APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION || '1.4.1';
  flags.API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.thoughtmarks.app';
  
  // Development settings
  flags.LOG_LEVEL = (process.env.EXPO_PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'debug';
  flags.ENABLE_ANALYTICS = process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true';
  
  // User-specific flags
  flags.USER_ID = process.env.EXPO_PUBLIC_USER_ID || '';
  flags.USER_ROLE = (process.env.EXPO_PUBLIC_USER_ROLE as 'user' | 'admin' | 'premium') || 'user';
  flags.USER_HAS_PREMIUM = process.env.EXPO_PUBLIC_USER_HAS_PREMIUM === 'true';
  flags.USER_HAS_VOICE_ACCESS = process.env.EXPO_PUBLIC_USER_HAS_VOICE_ACCESS !== 'false';
  flags.USER_HAS_AI_ACCESS = process.env.EXPO_PUBLIC_USER_HAS_AI_ACCESS !== 'false';
  
  // User preferences
  flags.USER_THEME = (process.env.EXPO_PUBLIC_USER_THEME as 'light' | 'dark') || 'dark';
  flags.USER_LANGUAGE = process.env.EXPO_PUBLIC_USER_LANGUAGE || 'en';
  flags.USER_TIMEZONE = process.env.EXPO_PUBLIC_USER_TIMEZONE || 'UTC';
  
  // Account settings
  flags.USER_NOTIFICATIONS = process.env.EXPO_PUBLIC_USER_NOTIFICATIONS !== 'false';
  flags.USER_AUTO_BACKUP = process.env.EXPO_PUBLIC_USER_AUTO_BACKUP !== 'false';
  flags.USER_SYNC_ENABLED = process.env.EXPO_PUBLIC_USER_SYNC_ENABLED !== 'false';
  
  // Merge with defaults
  return { ...DEFAULT_FLAGS, ...flags };
}

// Flag validation function
export function validateFlag(flagName: keyof EnvironmentFlags, value: any): boolean {
  const flags = validateEnvironmentFlags();
  
  switch (flagName) {
    case 'USE_NEXTGEN':
    case 'DEBUG_MODE':
    case 'ENABLE_VOICE_RECORDING':
    case 'ENABLE_AI_FEATURES':
    case 'ENABLE_PREMIUM_FEATURES':
    case 'ENABLE_ANALYTICS':
    case 'USER_HAS_PREMIUM':
    case 'USER_HAS_VOICE_ACCESS':
    case 'USER_HAS_AI_ACCESS':
    case 'USER_NOTIFICATIONS':
    case 'USER_AUTO_BACKUP':
    case 'USER_SYNC_ENABLED':
      return typeof value === 'boolean';
    
    case 'ENVIRONMENT':
      return ['legacy', 'nextgen'].includes(value);
    
    case 'LOG_LEVEL':
      return ['debug', 'info', 'warn', 'error'].includes(value);
    
    case 'USER_ROLE':
      return ['user', 'admin', 'premium'].includes(value);
    
    case 'USER_THEME':
      return ['light', 'dark'].includes(value);
    
    default:
      return true; // String values are always valid
  }
}

// Get environment flags
export function getEnvironmentFlags(): EnvironmentFlags {
  return validateEnvironmentFlags();
}

// Check if a feature is enabled
export function isFeatureEnabled(featureName: keyof EnvironmentFlags): boolean {
  const flags = getEnvironmentFlags();
  return Boolean(flags[featureName]);
}

// Log environment configuration
export function logEnvironmentConfig(): void {
  if (__DEV__) {
    const flags = getEnvironmentFlags();
    console.log('🔧 Environment Configuration:', {
      USE_NEXTGEN: flags.USE_NEXTGEN,
      ENVIRONMENT: flags.ENVIRONMENT,
      DEBUG_MODE: flags.DEBUG_MODE,
      ENABLE_VOICE_RECORDING: flags.ENABLE_VOICE_RECORDING,
      ENABLE_AI_FEATURES: flags.ENABLE_AI_FEATURES,
      ENABLE_PREMIUM_FEATURES: flags.ENABLE_PREMIUM_FEATURES,
    });
  }
} 