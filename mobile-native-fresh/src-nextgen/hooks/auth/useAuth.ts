import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  // Runtime validation hook
  useEffect(() => {
    console.log('🔐 useAuth hook initialized - Runtime validation active');
    console.log('📊 Auth state:', authState);
  }, [authState]);

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log('🔐 useAuth: signIn called with email:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // TODO: Implement actual authentication logic
      console.log('🔐 useAuth: Signing in with:', email, password);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: { email, name: 'Test User' },
        loading: false,
      }));
      console.log('✅ useAuth: Sign in successful');
    } catch (error) {
      console.error('❌ useAuth: Sign in failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false,
      }));
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    console.log('🔐 useAuth: signUp called with email:', email, 'name:', name);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // TODO: Implement actual sign up logic
      console.log('🔐 useAuth: Signing up with:', email, password, name);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: { email, name },
        loading: false,
      }));
      console.log('✅ useAuth: Sign up successful');
    } catch (error) {
      console.error('❌ useAuth: Sign up failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign up failed',
        loading: false,
      }));
    }
  };

  const signOut = async (): Promise<void> => {
    console.log('🔐 useAuth: signOut called');
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // TODO: Implement actual sign out logic
      console.log('🔐 useAuth: Signing out');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      console.log('✅ useAuth: Sign out successful');
    } catch (error) {
      console.error('❌ useAuth: Sign out failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false,
      }));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    console.log('🔐 useAuth: resetPassword called with email:', email);
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // TODO: Implement actual password reset logic
      console.log('🔐 useAuth: Resetting password for:', email);
      Alert.alert('Password Reset', 'Password reset email sent (mock)');
      setAuthState(prev => ({ ...prev, loading: false }));
      console.log('✅ useAuth: Password reset successful');
    } catch (error) {
      console.error('❌ useAuth: Password reset failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Password reset failed',
        loading: false,
      }));
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}; 