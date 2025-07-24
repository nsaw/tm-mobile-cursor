import { useState, useEffect } from 'react';

import { toggleEnvironment as toggleDualMount, setEnvironment as setDualMountEnvironment } from '../utils/dualMountToggle';

export type Environment = 'legacy' | 'nextgen';

interface EnvironmentState {
  currentEnvironment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  toggleEnvironment: () => Promise<void>;
  setEnvironment: (env: Environment) => Promise<void>;
}

export const useEnvironment = (): EnvironmentState => {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>('legacy');
  const [isDevelopment, setIsDevelopment] = useState(true);

  useEffect(() => {
    // Check if we're in development mode
    const isDev = __DEV__ || process.env.NODE_ENV === 'development';
    setIsDevelopment(isDev);

    // Get initial environment from environment variables or default to legacy
    const envFromVar = process.env.EXPO_PUBLIC_ENVIRONMENT as Environment;
    if (envFromVar && (envFromVar === 'legacy' || envFromVar === 'nextgen')) {
      setCurrentEnvironment(envFromVar);
    }
  }, []);

  const toggleEnvironment = async () => {
    try {
      const result = await toggleDualMount();
      if (result.success) {
        setCurrentEnvironment(result.currentEnvironment);
      }
    } catch (error) {
      console.error('Failed to toggle environment:', error);
    }
  };

  const setEnvironment = async (env: Environment) => {
    try {
      const result = await setDualMountEnvironment(env);
      if (result.success) {
        setCurrentEnvironment(result.currentEnvironment);
      }
    } catch (error) {
      console.error('Failed to set environment:', error);
    }
  };

  return {
    currentEnvironment,
    isDevelopment,
    isProduction: !isDevelopment,
    toggleEnvironment,
    setEnvironment,
  };
}; 