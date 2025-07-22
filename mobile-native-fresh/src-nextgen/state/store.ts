// Zustand root store scaffold
import { create } from 'zustand';

type AppState = {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
};

export const useAppState = create<AppState>((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
})); 