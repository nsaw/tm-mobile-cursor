import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppStoreState {
  isInitialized: boolean;
  version: string;
  buildNumber: string;
  lastUpdated: Date;
}

export interface AppActions {
  initialize: () => void;
  updateVersion: (version: string) => void;
  setLastUpdated: (date: Date) => void;
}

export interface AppStore extends AppStoreState, AppActions {}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isInitialized: false,
      version: '1.0.0',
      buildNumber: '1',
      lastUpdated: new Date(),
      
      initialize: () => set({ isInitialized: true }),
      updateVersion: (version: string) => set({ version }),
      setLastUpdated: (date: Date) => set({ lastUpdated: date }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore; 