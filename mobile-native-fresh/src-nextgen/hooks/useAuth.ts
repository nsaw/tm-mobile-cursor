import { useState, useCallback } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  loading: boolean;
  error: string | null;
}

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
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

  const verifyPIN = useCallback(async (pin: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Mock PIN verification
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      const isValid = pin === '1234'; // Mock validation
      setState(prev => ({ ...prev, loading: false }));
      return isValid;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return false;
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