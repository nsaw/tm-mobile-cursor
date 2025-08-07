import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../state/stores/authStore';
import { useThemeStore } from '../state/stores/themeStore';
import { useUIStore } from '../state/stores/uiStore';
import { apiServiceIntegration } from '../services/ApiServiceIntegration';
import { useAuth } from './useAuth';
import { useTheme } from './useTheme';
import { useThoughtmarks } from './useThoughtmarks';

// App Integration Hook
export const useAppIntegration = (): {
  // Auth integration
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<boolean>;
  
  // Theme integration
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Data integration
  createThoughtmark: (data: Omit<import('../types/DataTypes').Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateThoughtmark: (id: string, data: Partial<Omit<import('../types/DataTypes').Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteThoughtmark: (id: string) => Promise<void>;
  
  // UI integration
  showModal: (modalType: string, data?: Record<string, unknown>) => void;
  hideModal: () => void;
  setLoading: (loading: boolean) => void;
  
  // System integration
  initialize: () => Promise<void>;
  cleanup: () => Promise<void>;
  healthCheck: () => Promise<boolean>;
} => {
  // Zustand Stores
  const authStore = useAuthStore();
  const themeStore = useThemeStore();
  const uiStore = useUIStore();

  // Custom Hooks
  const authHook = useAuth();
  const themeHook = useTheme();
  const thoughtmarksHook = useThoughtmarks();

  // Auth Integration
  const signIn = useCallback(async (credentials: { email: string; password: string }) => {
    try {
      uiStore.setLoading(true);
      const response = await apiServiceIntegration.signIn(credentials);
      if (response.success) {
        authStore.setUser(response.data?.user || null);
        authStore.setAuthenticated(true);
      } else {
        throw new Error(response.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      uiStore.setLoading(false);
    }
  }, [authStore, uiStore]);

  // System Integration (moved up to fix cleanup dependency)
  const cleanup = useCallback(async () => {
    try {
      await apiServiceIntegration.cleanup();
      console.log('✅ App integration cleaned up successfully');
    } catch (error) {
      console.error('❌ Failed to cleanup app integration:', error);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      uiStore.setLoading(true);
      await apiServiceIntegration.signOut();
      authStore.clearUser();
      authStore.setAuthenticated(false);
      await cleanup();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      uiStore.setLoading(false);
    }
  }, [authStore, uiStore, cleanup]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      uiStore.setLoading(true);
      const response = await apiServiceIntegration.sendPasswordResetEmail(email);
      if (!response.success) {
        throw new Error(response.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    } finally {
      uiStore.setLoading(false);
    }
  }, [uiStore]);

  const verifyPIN = useCallback(async (pin: string): Promise<boolean> => {
    try {
      return await authHook.verifyPIN(pin);
    } catch (error) {
      console.error('PIN verification error:', error);
      return false;
    }
  }, [authHook]);

  // Theme Integration
  const toggleTheme = useCallback(() => {
    themeStore.toggleDarkMode();
    themeHook.toggleTheme();
  }, [themeStore, themeHook]);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    themeStore.setTheme(theme);
    themeHook.setTheme(theme);
  }, [themeStore, themeHook]);

  // Data Integration
  const createThoughtmark = useCallback(async (data: Omit<import('../types/DataTypes').Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      uiStore.setLoading(true);
      await thoughtmarksHook.createThoughtmark(data);
    } catch (error) {
      console.error('Create thoughtmark error:', error);
      throw error;
    } finally {
      uiStore.setLoading(false);
    }
  }, [thoughtmarksHook, uiStore]);

  const updateThoughtmark = useCallback(async (id: string, data: Partial<Omit<import('../types/DataTypes').Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      uiStore.setLoading(true);
      await thoughtmarksHook.updateThoughtmark(id, data);
    } catch (error) {
      console.error('Update thoughtmark error:', error);
      throw error;
    } finally {
      uiStore.setLoading(false);
    }
  }, [thoughtmarksHook, uiStore]);

  const deleteThoughtmark = useCallback(async (id: string) => {
    try {
      uiStore.setLoading(true);
      await thoughtmarksHook.deleteThoughtmark(id);
    } catch (error) {
      console.error('Delete thoughtmark error:', error);
      throw error;
    } finally {
      uiStore.setLoading(false);
    }
  }, [thoughtmarksHook, uiStore]);

  // UI Integration
  const showModal = useCallback((modalType: string, data?: Record<string, unknown>) => {
    uiStore.showModal(modalType, data);
  }, [uiStore]);

  const hideModal = useCallback(() => {
    uiStore.hideModal();
  }, [uiStore]);

  const setLoading = useCallback((loading: boolean) => {
    uiStore.setLoading(loading);
  }, [uiStore]);

  // System Integration
  const initialize = useCallback(async () => {
    try {
      await apiServiceIntegration.initialize();
      console.log('✅ App integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app integration:', error);
      throw error;
    }
  }, []);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiServiceIntegration.healthCheck();
      return response.success;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }, []);

  // Initialize app integration
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize API services
        await apiServiceIntegration.initialize();

        // Check if user is already authenticated
        const response = await apiServiceIntegration.getCurrentUser();
        if (response.success && response.data?.user) {
          authStore.setUser(response.data.user);
          authStore.setAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize app integration:', error);
      }
    };

    initializeApp();
  }, [authStore, uiStore]);

  return {
    signIn,
    signOut,
    resetPassword,
    verifyPIN,
    toggleTheme,
    setTheme,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    showModal,
    hideModal,
    setLoading,
    initialize,
    cleanup,
    healthCheck,
  };
}; 