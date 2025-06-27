import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';

import { 
  onAuthStateChanged, 
  getCurrentUser, 
  User as AuthUser 
} from '../lib/firebaseAuth';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: AuthUser | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!firebaseUser;
  const isGuest = !firebaseUser;

  // Sync user data from backend
  const syncUserToBackend = async (user: FirebaseUser) => {
    try {
      // TODO: Implement API call to sync user data
      // const response = await fetch(`/api/users/by-firebase/${user.uid}`);
      // const userData = await response.json();
      // setDbUser(userData);
      
      // For now, create a basic user object
      const userData: AuthUser = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        role: 'free',
        isPremium: false,
        subscriptionStatus: 'free',
        createdAt: user.metadata.creationTime,
        updatedAt: user.metadata.lastSignInTime,
      };
      setDbUser(userData);
    } catch (error) {
      console.error('Failed to sync user to backend:', error);
      // Fallback to basic user data
      const userData: AuthUser = {
        id: user.uid,
        email: user.email || '',
        displayName: user.displayName || undefined,
        role: 'free',
        isPremium: false,
        subscriptionStatus: 'free',
        createdAt: user.metadata.creationTime,
        updatedAt: user.metadata.lastSignInTime,
      };
      setDbUser(userData);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (firebaseUser) {
      await syncUserToBackend(firebaseUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        await syncUserToBackend(user);
      } else {
        setDbUser(null);
      }
      
      setLoading(false);
    });

    // Check for existing user on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFirebaseUser(currentUser);
      syncUserToBackend(currentUser);
    }
    
    setLoading(false);

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    firebaseUser,
    dbUser,
    isGuest,
    isAuthenticated,
    loading,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 