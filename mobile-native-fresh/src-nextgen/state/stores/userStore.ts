import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium?: boolean;
  isTestUser?: boolean;
  preferences: Record<string, unknown>;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  updatePreferences: (preferences: Record<string, unknown>) => void;
}

export interface UserStore extends UserState, UserActions {}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user: User) => set({ 
        currentUser: user, 
        isAuthenticated: true 
      }),
      
      clearUser: () => set({ 
        currentUser: null, 
        isAuthenticated: false 
      }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      updatePreferences: (preferences: Record<string, unknown>) => {
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              preferences: { ...currentUser.preferences, ...preferences }
            }
          });
        }
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore; 