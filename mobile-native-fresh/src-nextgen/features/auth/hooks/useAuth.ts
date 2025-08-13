import { useState, useEffect } from 'react';
import { User, SignInCredentials, SignUpCredentials, PINCredentials, AuthState } from '../types/auth';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    requiresPIN: false,
    isDemoUser: false,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN && !!user,
        isDemoUser: user?.provider === 'demo',
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
      }));
    }
  };

  const signInWithEmail = async (credentials: SignInCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signInWithEmail(credentials);
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN,
        isDemoUser: user.provider === 'demo',
      });
      return user;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
      throw error;
    }
  };

  const signUpWithEmail = async (credentials: SignUpCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signUpWithEmail(credentials);
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN,
        isDemoUser: user.provider === 'demo',
      });
      return user;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign up failed',
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signInWithGoogle();
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN,
        isDemoUser: user.provider === 'demo',
      });
      return user;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Google sign in failed',
      }));
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signInWithApple();
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN,
        isDemoUser: user.provider === 'demo',
      });
      return user;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Apple sign in failed',
      }));
      throw error;
    }
  };

  const signInAsDemo = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await authService.signInAsDemo();
      const hasPIN = await authService.hasPIN();

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresPIN: hasPIN,
        isDemoUser: true,
      });
      return user;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Demo sign in failed',
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await authService.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        requiresPIN: false,
        isDemoUser: false,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
      throw error;
    }
  };

  const setupPIN = async (credentials: PINCredentials) => {
    try {
      await authService.setupPIN(credentials);
      setAuthState(prev => ({ ...prev, requiresPIN: true }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'PIN setup failed',
      }));
      throw error;
    }
  };

  const verifyPIN = async (pin: string) => {
    try {
      const isValid = await authService.verifyPIN(pin);
      if (isValid) {
        setAuthState(prev => ({ ...prev, requiresPIN: false }));
      }
      return isValid;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'PIN verification failed',
      }));
      return false;
    }
  };

  return {
    ...authState,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signInAsDemo,
    signOut,
    setupPIN,
    verifyPIN,
  };
};
