import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const useAuth = (): {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; requiresPin: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; requiresPin: boolean; error?: string }>;
  signOut: () => Promise<void>;
  verifyPin: (pin: string, purpose: 'verification' | 'setup') => Promise<{ success: boolean; requiresPin: boolean; error?: string }>;
  verifyPIN: (pin: string, purpose: 'verification' | 'setup') => Promise<{ success: boolean; requiresPin: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
} => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    signIn: async (email: string, password: string) => {
      // TODO: Implement actual sign in logic
      setIsLoading(true);
      setError(null);
      try {
        console.log('Sign in:', email, password);
        setIsAuthenticated(true);
        setUser({ id: '1', email, name: 'User' });
        return { success: true, requiresPin: false };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign in failed');
        return { success: false, requiresPin: false, error: err instanceof Error ? err.message : 'Sign in failed' };
      } finally {
        setIsLoading(false);
      }
    },
    signUp: async (email: string, password: string) => {
      // TODO: Implement actual sign up logic
      setIsLoading(true);
      setError(null);
      try {
        console.log('Sign up:', email, password);
        setIsAuthenticated(true);
        setUser({ id: '1', email, name: 'User' });
        return { success: true, requiresPin: false };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign up failed');
        return { success: false, requiresPin: false, error: err instanceof Error ? err.message : 'Sign up failed' };
      } finally {
        setIsLoading(false);
      }
    },
    signOut: async () => {
      // TODO: Implement actual sign out logic
      console.log('Sign out');
      setIsAuthenticated(false);
      setUser(null);
    },
    verifyPin: async (pin: string, purpose: 'verification' | 'setup') => {
      // TODO: Implement actual PIN verification logic
      setIsLoading(true);
      setError(null);
      try {
        console.log('Verify PIN:', pin, purpose);
        return { success: true, requiresPin: false };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'PIN verification failed');
        return { success: false, requiresPin: false, error: err instanceof Error ? err.message : 'PIN verification failed' };
      } finally {
        setIsLoading(false);
      }
    },
    verifyPIN: async (pin: string, purpose: 'verification' | 'setup') => {
      // Alias for verifyPin for backward compatibility
      setIsLoading(true);
      setError(null);
      try {
        console.log('Verify PIN:', pin, purpose);
        return { success: true, requiresPin: false };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'PIN verification failed');
        return { success: false, requiresPin: false, error: err instanceof Error ? err.message : 'PIN verification failed' };
      } finally {
        setIsLoading(false);
      }
    },
    resetPassword: async (email: string) => {
      // TODO: Implement actual password reset logic
      setIsLoading(true);
      setError(null);
      try {
        console.log('Reset password:', email);
        return { success: true };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Password reset failed');
        return { success: false, error: err instanceof Error ? err.message : 'Password reset failed' };
      } finally {
        setIsLoading(false);
      }
    },
  };
};

// TODO: Implement full feature after navigation unblocked 