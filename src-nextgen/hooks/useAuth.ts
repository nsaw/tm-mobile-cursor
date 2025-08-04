import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://via.placeholder.com/150',
  isPremium: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useAuth = (): AuthState & AuthActions => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData) as User;
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load user data',
        isLoading: false,
      }));
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      
      const user = { ...mockUser, email };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Sign in failed',
        isLoading: false,
      }));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      
      const user = { ...mockUser, email, name };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Sign up failed',
        isLoading: false,
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user');
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Sign out failed',
      }));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate Google sign in
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      
      const user = { ...mockUser, email: 'google@example.com' };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Google sign in failed',
        isLoading: false,
      }));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate password reset
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Password reset failed',
        isLoading: false,
      }));
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = { ...state.user, ...updates, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Profile update failed',
      }));
    }
  }, [state.user]);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
  };
}; 