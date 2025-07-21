// FINALIZED AUTOHYDRATE + LOG BLOCK PATCH
import { create } from 'zustand';
import { hydrateEnvFromAppFile } from '../utils/env';

let initialized = false;

export const useEnvironmentStore = create<{
  environment: 'legacy' | 'nextgen';
  useNextGen: boolean;
  init: () => Promise<void>;
}>(() => ({
  environment: 'legacy',
  useNextGen: false,
  init: async () => {
    if (initialized) return;
    console.log('🔄 Initializing environment store from file...');
    const hydrated = await hydrateEnvFromAppFile();
    if (hydrated === 'nextgen') {
      console.log('✅ Hydrated environment from file: nextgen');
      useEnvironmentStore.setState({ useNextGen: true, environment: 'nextgen' });
      console.log('✅ Setting environment to nextgen from file');
    } else {
      console.warn('⚠️ File hydration defaulted to legacy');
    }
    initialized = true;
  }
})); 