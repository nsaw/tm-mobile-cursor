import React, { useState, useEffect, createContext, useContext } from 'react';
declare const console: any;

interface User {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  isPremium: boolean;
  isTestUser: boolean;
  isAdmin?: boolean;
  displayName?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  guestMode: boolean;
  login: () => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => void;
  signInWithDemo: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  const login = () => {
    console.log('[AUTH] login triggered');
    const demoUser: User = {
      id: '123',
      name: 'Nick',
      email: 'nick@thoughtmarks.com',
      firstName: 'Nick',
      lastName: 'User',
      isPremium: false,
      isTestUser: true,
      isAdmin: false,
      displayName: 'Nick User',
      createdAt: new Date().toISOString()
    };
    setUser(demoUser);
    setIsAuthenticated(true);
    setGuestMode(false);
  };

  const logout = () => {
    console.log('[AUTH] logout triggered');
    setUser(null);
    setIsAuthenticated(false);
    setGuestMode(false);
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AUTH] signIn triggered', email);
    // Simulate async sign in
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
    login();
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('[AUTH] signUp triggered', email, firstName, lastName);
    // Simulate async sign up
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
    login();
  };

  const signOut = () => {
    console.log('[AUTH] signOut triggered');
    logout();
  };

  const signInWithDemo = () => {
    console.log('[AUTH] signInWithDemo triggered');
    login();
  };

  useEffect(() => {
    console.log('[AUTH] AuthProvider mounted');
    // Simulate initial auth check
    setTimeout(() => {
      setLoading(false);
      console.log('[AUTH] Initial auth check complete');
    }, 1000);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      guestMode,
      login, 
      logout, 
      signIn, 
      signUp, 
      signOut, 
      signInWithDemo 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
