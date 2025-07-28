export const useEnvironmentStore = (selector: any) => {
  const state = {
    env: 'dev',
    init: () => {},
    environment: 'dev',
    hydrationSource: 'local'
  };
  return selector(state);
}; 