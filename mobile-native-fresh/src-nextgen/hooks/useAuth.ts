import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../state/stores/authStore';
import { apiServiceIntegration, User } from '../services/ApiServiceIntegration';

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Sign up data interface
export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

// Auth hook return interface
export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;

  // Actions
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * useAuth Hook
 * 
 * Provides authentication functionality with Zustand store integration
 * and API service communication.
 */
export const useAuth = (): UseAuthReturn => {
  const authStore = useAuthStore();
  const [localLoading, setLocalLoading] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await apiServiceIntegration.getCurrentUser();
        if (response.success && response.data?.user) {
          authStore.setUser(response.data.user);
          authStore.setAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, [authStore]);

  // Login function
  const login = useCallback(async (user: User, token: string) => {
    try {
      setLocalLoading(true);
      authStore.setUser(user);
      authStore.setToken(token);
      authStore.setAuthenticated(true);
      authStore.clearError();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLocalLoading(true);
      await apiServiceIntegration.signOut();
      authStore.clearUser();
      authStore.setToken(null);
      authStore.setAuthenticated(false);
      authStore.clearError();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore]);

  // Sign in function
  const signIn = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLocalLoading(true);
      authStore.clearError();
      
      const response = await apiServiceIntegration.signIn(credentials);
      
      if (response.success && response.data) {
        await login(response.data.user, response.data.token);
      } else {
        throw new Error(response.error || 'Sign in failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore, login]);

  // Sign up function
  const signUp = useCallback(async (data: SignUpData) => {
    try {
      setLocalLoading(true);
      authStore.clearError();
      
      const response = await apiServiceIntegration.signUp(data);
      
      if (response.success && response.data) {
        await login(response.data.user, response.data.token);
      } else {
        throw new Error(response.error || 'Sign up failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore, login]);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLocalLoading(true);
      authStore.clearError();
      
      const response = await apiServiceIntegration.sendPasswordResetEmail(email);
      
      if (!response.success) {
        throw new Error(response.error || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore]);

  // Verify PIN function
  const verifyPIN = useCallback(async (pin: string): Promise<boolean> => {
    try {
      // This would typically call an API to verify the PIN
      // For now, we'll simulate a simple verification
      const isValid = pin.length === 4 && /^\d+$/.test(pin);
      
      if (!isValid) {
        authStore.setError('Invalid PIN format');
        return false;
      }
      
      // Simulate API call
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      
      // For demo purposes, accept any 4-digit PIN
      authStore.clearError();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'PIN verification failed';
      authStore.setError(errorMessage);
      return false;
    }
  }, [authStore]);

  // Update profile function
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      setLocalLoading(true);
      authStore.clearError();
      
      const response = await apiServiceIntegration.updateUserProfile(updates);
      
      if (response.success && response.data) {
        authStore.updateUser(response.data);
      } else {
        throw new Error(response.error || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      authStore.setError(errorMessage);
      throw error;
    } finally {
      setLocalLoading(false);
    }
  }, [authStore]);

  // Clear error function
  const clearError = useCallback(() => {
    authStore.clearError();
  }, [authStore]);

  // Set loading function
  const setLoading = useCallback((loading: boolean) => {
    authStore.setLoading(loading);
  }, [authStore]);

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading || localLoading,
    error: authStore.error,
    token: authStore.token,

    // Actions
    login,
    logout,
    signIn,
    signUp,
    resetPassword,
    verifyPIN,
    updateProfile,
    clearError,
    setLoading,
  };
};

export default useAuth;