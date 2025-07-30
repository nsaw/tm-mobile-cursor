import { useState, useCallback } from 'react';

import { AuthError } from '../types/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  verifyPIN: (pin: string) => Promise<void>;
  resetPassword: {
    sendResetEmail: (email: string) => Promise<void>;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
  };
  validateResetToken: (email: string, token: string) => Promise<boolean>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual authentication
      console.log('Sign in attempt:', { email, password });
      setState(prev => ({ ...prev, isAuthenticated: true, user: { email }, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'AUTH_ERROR',
        message: error instanceof Error ? error.message : 'Authentication failed',
        timestamp: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, error: authError, isLoading: false }));
      throw authError;
    }
  }, []);

  const signUp = useCallback(async (userData: any) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual registration
      console.log('Sign up attempt:', userData);
      setState(prev => ({ ...prev, isAuthenticated: true, user: userData, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'AUTH_ERROR',
        message: error instanceof Error ? error.message : 'Registration failed',
        timestamp: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, error: authError, isLoading: false }));
      throw authError;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      // TODO: Implement actual sign out
      console.log('Sign out attempt');
      setState(prev => ({ ...prev, isAuthenticated: false, user: null, isLoading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const verifyPIN = useCallback(async (pin: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual PIN verification
      console.log('PIN verification attempt:', pin);
      setState(prev => ({ ...prev, isAuthenticated: true, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'PIN_ERROR',
        message: error instanceof Error ? error.message : 'PIN verification failed',
        timestamp: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, error: authError, isLoading: false }));
      throw authError;
    }
  }, []);

  const sendResetEmail = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual password reset email
      console.log('Password reset email sent:', email);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'RESET_ERROR',
        message: error instanceof Error ? error.message : 'Failed to send reset email',
        timestamp: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, error: authError, isLoading: false }));
      throw authError;
    }
  }, []);

  const resetPasswordWithToken = useCallback(async (email: string, token: string, newPassword: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // TODO: Implement actual password reset with token
      console.log('Password reset with token:', { email, token, newPassword });
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const authError: AuthError = {
        code: 'RESET_ERROR',
        message: error instanceof Error ? error.message : 'Failed to reset password',
        timestamp: new Date().toISOString(),
      };
      setState(prev => ({ ...prev, error: authError, isLoading: false }));
      throw authError;
    }
  }, []);

  const validateResetToken = useCallback(async (email: string, token: string): Promise<boolean> => {
    try {
      // TODO: Implement actual token validation
      console.log('Validating reset token:', { email, token });
      // For now, return true if token is 6 characters
      return token.length === 6;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    verifyPIN,
    resetPassword: {
      sendResetEmail,
      resetPassword: resetPasswordWithToken,
    },
    validateResetToken,
  };
} 