interface EnvironmentState {
  env: string;
  init: () => Promise<void>;
  environment: string;
  hydrationSource: string;
}

export const useEnvironmentStore = (selector: (state: EnvironmentState) => any) => {
  const state: EnvironmentState = {
    env: 'dev',
    init: async () => {
      // Initialize environment
    },
    environment: 'dev',
    hydrationSource: 'local'
  };
  return selector(state);
}; 