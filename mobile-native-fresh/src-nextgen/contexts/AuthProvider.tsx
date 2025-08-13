import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isPremium?: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth state check
    const checkAuthState = async () => {
      try {
        // TODO: Implement actual auth state check
        // For now, simulate no user
        setUser(null);
      } catch (error) {
        console.error('Auth state check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual sign in
      console.log('Sign in:', email, password);
      // Simulate successful sign in
      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        isPremium: false,
        createdAt: new Date(),
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual sign up
      console.log('Sign up:', email, password, name);
      // Simulate successful sign up
      const mockUser: User = {
        id: '1',
        email,
        name,
        isPremium: false,
        createdAt: new Date(),
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual sign out
      console.log('Sign out');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // TODO: Implement actual password reset
      console.log('Reset password:', email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
