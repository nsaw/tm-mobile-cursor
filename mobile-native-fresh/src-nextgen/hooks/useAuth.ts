import { useState, useCallback } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  loading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<{ requiresPin: boolean }>;
  signUp: (email: string, password: string) => Promise<{ requiresPin: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPIN: (pin: string, purpose?: string) => Promise<{ success: boolean }>;
  verifyPin: (pin: string, purpose?: string) => Promise<{ success: boolean }>;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const signIn = useCallback(async (email: string, _password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock authentication logic
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      setState({
        isAuthenticated: true,
        user: { email },
        loading: false,
        error: null,
      });
      
      // Return auth flow result for useAuthFlow compatibility
      return { requiresPin: false };
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
      
      // Return auth flow result even on error for useAuthFlow compatibility
      return { requiresPin: false };
    }
  }, []);

  const signUp = useCallback(async (email: string, _password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock sign up logic
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      setState({
        isAuthenticated: true,
        user: { email },
        loading: false,
        error: null,
      });
      
      // Return auth flow result for useAuthFlow compatibility
      return { requiresPin: false };
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      
      // Return auth flow result even on error for useAuthFlow compatibility
      return { requiresPin: false };
    }
  }, []);

  const signOut = useCallback(async () => {
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Mock password reset logic
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }));
    }
  }, []);

  const verifyPIN = useCallback(async (pin: string, _purpose?: string): Promise<{ success: boolean }> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Mock PIN verification
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      const isValid = pin === '1234'; // Mock validation
      setState(prev => ({ ...prev, loading: false }));
      return { success: isValid };
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return { success: false };
    }
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    verifyPIN,
    verifyPin: verifyPIN, // Alias for compatibility
    isLoading: state.loading,
  };
};