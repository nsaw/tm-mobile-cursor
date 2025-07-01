import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@shared/schema";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        // User is signed in with Firebase
        try {
          const user = await getCurrentUser(firebaseUser.uid);
          if (user) {
            setUser(user);
            setFirebaseUser(firebaseUser);
            setGuestMode(false);
            // Clear any demo data
            localStorage.removeItem('thoughtmarks-demo-token');
            localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
          } else {
            console.error('Could not fetch user for Firebase UID:', firebaseUser.uid);
            setUser(null);
            setFirebaseUser(null);
            setGuestMode(true);
          }
        } catch (error) {
          console.error('Error getting current user:', error);
          setUser(null);
          setFirebaseUser(null);
          setGuestMode(true);
        }
      } else {
        // No Firebase user, check for demo authentication
        const storedUser = localStorage.getItem('thoughtmarks-user');
        const storedToken = localStorage.getItem('thoughtmarks-demo-token');
        
        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setFirebaseUser(null);
            setGuestMode(false);
          } catch (error) {
            console.error('Failed to restore user from storage:', error);
            localStorage.removeItem('thoughtmarks-user');
            localStorage.removeItem('thoughtmarks-demo-token');
            setUser(null);
            setFirebaseUser(null);
            setGuestMode(true);
          }
        } else {
          // No authentication, enter guest mode
          setUser(null);
          setFirebaseUser(null);
          setGuestMode(true);
        }
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    // Listen for PIN authentication success events
    const handlePinAuthSuccess = (event: CustomEvent) => {
      const userData = event.detail.user;
      if (userData) {
        setUser(userData);
        setFirebaseUser(null);
        setGuestMode(false);
        setLoading(false);
        setAuthChecked(true);
      }
    };

    window.addEventListener('pinAuthSuccess', handlePinAuthSuccess as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('pinAuthSuccess', handlePinAuthSuccess as EventListener);
    };
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await getCurrentUser(result.user.uid);
      setUser(userData);
      setFirebaseUser(result.user);
      setGuestMode(false);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Check if this is a demo user before clearing data
      const currentUser = user;
      const isDemoUser = currentUser?.email === 'hello@thoughtmarks.app' || 
                        currentUser?.email === 'applereview@thoughtmarks.app' || 
                        currentUser?.email === 'test@thoughtmarks.app' || 
                        currentUser?.isTestUser;
      
      await auth.signOut();
      localStorage.removeItem('thoughtmarks-user');
      localStorage.removeItem('thoughtmarks-demo-token');
      
      // Clear sessionStorage for demo users to ensure fresh onboarding experience
      if (isDemoUser) {
        sessionStorage.clear();
      }
      
      setUser(null);
      setFirebaseUser(null);
      setGuestMode(false);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    guestMode,
    authChecked,
    isAuthenticated: !!user,
    login,
    logout,
  };
}