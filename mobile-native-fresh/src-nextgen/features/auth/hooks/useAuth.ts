import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isPremium: boolean;
  isTestUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  guestMode: boolean;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  enableGuestMode: () => void;
  disableGuestMode: () => void;
  verifyPIN?: (pin: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
}

const STORAGE_KEYS = {
  USER: '@thoughtmarks_user',
  TOKEN: '@thoughtmarks_token',
  REFRESH_TOKEN: '@thoughtmarks_refresh_token',
  LAST_ACTIVE: '@thoughtmarks_last_active',
};

export const useAuth = (): AuthContextValue => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    guestMode: false,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (userData) {
          const user = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            guestMode: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (_email: string, _password: string): Promise<User> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Mock authentication - replace with actual auth logic
      const user: User = {
        id: 'mock-user-id',
        email: _email,
        firstName: 'Mock',
        lastName: 'User',
        isPremium: false,
        isTestUser: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        guestMode: false,
      });

      return user;
    } catch (error: unknown) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error((error as Error).message || 'Sign in failed');
    }
  };

  const signUp = async (_email: string, _password: string, firstName?: string, lastName?: string): Promise<User> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // Mock user creation - replace with actual signup logic
      const user: User = {
        id: 'mock-user-id',
        email: _email,
        firstName: firstName || 'New',
        lastName: lastName || 'User',
        isPremium: false,
        isTestUser: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        guestMode: false,
      });

      return user;
    } catch (error: unknown) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error((error as Error).message || 'Sign up failed');
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.LAST_ACTIVE,
      ]);

      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        guestMode: false,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const enableGuestMode = (): void => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      guestMode: true,
    });
  };

  const disableGuestMode = (): void => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      guestMode: false,
    });
  };

  const resetPassword = async (_email: string): Promise<void> => {
    // Mock password reset for now
    console.log('Password reset requested for:', _email);
  };

  const signInWithGoogle = async (): Promise<void> => {
    // Mock Google sign in for now
    console.log('Google sign in requested');
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    enableGuestMode,
    disableGuestMode,
    isLoading: authState.loading,
    error: null,
  } as AuthContextValue;
}; 