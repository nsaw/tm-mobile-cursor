import { useState } from 'react';
import { signIn, signUp, resetPassword } from '../services/authService';

export interface AuthContextValue {
  token?: string;
  isLoading: boolean;
  error: string | null;
  user?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
  };
  signIn: typeof signIn;
  signUp: typeof signUp;
  resetPassword: typeof resetPassword;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  verifyPIN: (pin: string) => Promise<void>;
}

export function useAuth(): AuthContextValue {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_token, setToken] = useState<string|undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const verifyPIN = async (pin: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual PIN verification logic
      if (pin === '123456') {
        setToken('mock-token');
      } else {
        throw new Error('Invalid PIN');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual sign out logic
      setToken(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual Google sign in logic
      setToken('mock-google-token');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    token: _token, 
    isLoading, 
    error, 
    user: _token ? { displayName: 'Test User', email: 'test@example.com', photoURL: undefined } : undefined,
    signIn, 
    signUp, 
    resetPassword, 
    signInWithGoogle,
    signOut,
    verifyPIN 
  };
} 