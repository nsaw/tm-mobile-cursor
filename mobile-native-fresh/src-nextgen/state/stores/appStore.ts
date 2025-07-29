import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppState } from '../types';

export interface AppStore extends AppState {
  // Actions
  setEnvironment: (environment: 'legacy' | 'nextgen') => void;
  setFirstLaunch: (isFirstLaunch: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (enabled: boolean) => void;
  setAnalytics: (enabled: boolean) => void;
  resetApp: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      currentEnvironment: 'legacy',
      isFirstLaunch: true,
      onboardingCompleted: false,
      theme: 'system',
      notifications: true,
      analytics: true,

      // Actions
      setEnvironment: (currentEnvironment) =>
        set({ currentEnvironment }),

      setFirstLaunch: (isFirstLaunch) =>
        set({ isFirstLaunch }),

      setOnboardingCompleted: (onboardingCompleted) =>
        set({ onboardingCompleted }),

      setTheme: (theme) =>
        set({ theme }),

      setNotifications: (notifications) =>
        set({ notifications }),

      setAnalytics: (analytics) =>
        set({ analytics }),

      resetApp: () =>
        set({
          currentEnvironment: 'legacy',
          isFirstLaunch: true,
          onboardingCompleted: false,
          theme: 'system',
          notifications: true,
          analytics: true,
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentEnvironment: state.currentEnvironment,
        isFirstLaunch: state.isFirstLaunch,
        onboardingCompleted: state.onboardingCompleted,
        theme: state.theme,
        notifications: state.notifications,
        analytics: state.analytics,
      }),
    }
  )
); 