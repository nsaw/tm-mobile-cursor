import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for thoughtmarks and bins
export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  isTask?: boolean;
  isCompleted?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bin {
  id: string;
  name: string;
  description?: string;
  thoughtmarkCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppStoreState {
  isInitialized: boolean;
  version: string;
  buildNumber: string;
  lastUpdated: Date;
  thoughtmarks: Thoughtmark[];
  bins: Bin[];
  error: string | null;
  loading: boolean;
}

export interface AppActions {
  initialize: () => void;
  updateVersion: (version: string) => void;
  setLastUpdated: (date: Date) => void;
  createThoughtmark: (thoughtmark: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateThoughtmark: (id: string, updates: Partial<Thoughtmark>) => void;
  deleteThoughtmark: (id: string) => void;
  fetchThoughtmarks: () => Promise<void>;
  fetchBins: () => Promise<void>;
  createBin: (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBin: (id: string, updates: Partial<Bin>) => void;
  deleteBin: (id: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface AppStore extends AppStoreState, AppActions {}

const useAppStore = create<AppStore>()(
  persist(
    (set, _get) => ({
      isInitialized: false,
      version: '1.0.0',
      buildNumber: '1',
      lastUpdated: new Date(),
      thoughtmarks: [],
      bins: [],
      error: null,
      loading: false,
      
      initialize: () => set({ isInitialized: true }),
      updateVersion: (version: string) => set({ version }),
      setLastUpdated: (date: Date) => set({ lastUpdated: date }),
      
      createThoughtmark: (thoughtmarkData) => {
        const newThoughtmark: Thoughtmark = {
          ...thoughtmarkData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          thoughtmarks: [...state.thoughtmarks, newThoughtmark],
        }));
      },
      
      updateThoughtmark: (id, updates) => {
        set((state) => ({
          thoughtmarks: state.thoughtmarks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }));
      },
      
      deleteThoughtmark: (id) => {
        set((state) => ({
          thoughtmarks: state.thoughtmarks.map((t) =>
            t.id === id ? { ...t, isDeleted: true, updatedAt: new Date() } : t
          ),
        }));
      },
      
      fetchThoughtmarks: async () => {
        set({ loading: true, error: null });
        try {
          // Simulate API call - replace with actual implementation
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
          set({ loading: false });
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch thoughtmarks' });
        }
      },
      
      fetchBins: async () => {
        set({ loading: true, error: null });
        try {
          // Simulate API call - replace with actual implementation
          await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
          set({ loading: false });
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch bins' });
        }
      },
      
      createBin: (binData) => {
        const newBin: Bin = {
          ...binData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          bins: [...state.bins, newBin],
        }));
      },
      
      updateBin: (id, updates) => {
        set((state) => ({
          bins: state.bins.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
          ),
        }));
      },
      
      deleteBin: (id) => {
        set((state) => ({
          bins: state.bins.filter((b) => b.id !== id),
        }));
      },
      
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore; 