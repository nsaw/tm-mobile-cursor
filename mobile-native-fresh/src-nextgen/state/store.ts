import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email?: string;
  name?: string;
  isPremium?: boolean;
  isTestUser?: boolean;
}

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  guestMode: boolean;
  // App state
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  // Actions
  setUser: (user: User) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setGuestMode: (guest: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      loading: false,
      guestMode: false,
      theme: 'system',
      notifications: true,
      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (loading) => set({ loading }),
      setGuestMode: (guestMode) => set({ guestMode }),
      setTheme: (theme) => set({ theme }),
      setNotifications: (notifications) => set({ notifications }),
      logout: () => set({ user: null, isAuthenticated: false, guestMode: false }),
    }),
    {
      name: 'app-storage',
    }
  )
);
