import { useState, useEffect } from 'react';

export type Environment = 'legacy' | 'nextgen';

export const useEnvironment = () => {
  const [environment, setEnvironment] = useState<Environment>('legacy');

  useEffect(() => {
    // Check environment variable or default to legacy
    const env = process.env.NEXTGEN_ENABLED === 'true' ? 'nextgen' : 'legacy';
    setEnvironment(env);
  }, []);

  const toggleEnvironment = () => {
    setEnvironment(prev => prev === 'legacy' ? 'nextgen' : 'legacy');
  };

  const setEnvironmentMode = (mode: Environment) => {
    setEnvironment(mode);
  };

  return [environment, { toggleEnvironment, setEnvironmentMode }] as const;
}; 