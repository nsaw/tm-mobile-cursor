import { useState, useEffect } from 'react';

export type Environment = 'legacy' | 'nextgen';

interface EnvironmentState {
  currentEnvironment: Environment;
  isDevelopment: boolean;
  isProduction: boolean;
  toggleEnvironment: () => void;
  setEnvironment: (env: Environment) => void;
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

  const toggleEnvironment = () => {
    setCurrentEnvironment(prev => prev === 'legacy' ? 'nextgen' : 'legacy');
  };

  const setEnvironment = (env: Environment) => {
    setCurrentEnvironment(env);
  };

  return {
    currentEnvironment,
    isDevelopment,
    isProduction: !isDevelopment,
    toggleEnvironment,
    setEnvironment,
  };
}; 