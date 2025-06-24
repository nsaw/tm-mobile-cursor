import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { apiService } from '../../../services/api';
import type { User, AuthState } from '../../../types';

const STORAGE_KEYS = {
  USER: '@thoughtmarks_user',
  TOKEN: '@thoughtmarks_token',
  REFRESH_TOKEN: '@thoughtmarks_refresh_token',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    guestMode: false,
  });

  // Initialize auth state from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User type
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          isPremium: false, // Default to false, can be updated from backend
          isTestUser: false,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        };

        // Get custom token from backend for API access
        try {
          const token = await firebaseUser.getIdToken();
          const res = await apiService.validateToken(token);
          if (res.success && res.data) {
            // Update user with backend data (premium status, etc.)
            const updatedUser = { ...user, ...res.data };
            await storeAuthData(updatedUser, token);
            setAuthState({
              user: updatedUser,
              isAuthenticated: true,
              loading: false,
              guestMode: false,
            });
          } else {
            // Use Firebase user data if backend validation fails
            await storeAuthData(user, token);
            setAuthState({
              user,
              isAuthenticated: true,
              loading: false,
              guestMode: false,
            });
          }
        } catch (error) {
          console.error('Failed to validate token with backend:', error);
          // Use Firebase user data as fallback
          const token = await firebaseUser.getIdToken();
          await storeAuthData(user, token);
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
            guestMode: false,
          });
        }
      } else {
        // No Firebase user, try demo login for development
        try {
          await signInWithDemo();
        } catch (error) {
          console.error('Demo login failed:', error);
          setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
        }
      }
    });
    return unsubscribe;
  }, []);

  const signInWithDemo = async () => {
    try {
      const res = await apiService.demoLogin();
      console.log('Demo login response:', JSON.stringify(res, null, 2));
      
      if (res.success && res.data && res.data.user && res.data.token) {
        console.log('Storing auth data:', { 
          user: res.data.user, 
          token: res.data.token,
          userType: typeof res.data.user,
          tokenType: typeof res.data.token
        });
        await storeAuthData(res.data.user, res.data.token);
        setAuthState({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
      } else {
        console.log('Demo login failed or missing data:', {
          success: res.success,
          hasData: !!res.data,
          hasUser: !!(res.data && res.data.user),
          hasToken: !!(res.data && res.data.token),
          dataKeys: res.data ? Object.keys(res.data) : 'no data'
        });
        setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
      }
    } catch (error) {
      console.error('Failed to sign in with demo:', error);
      setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error(error.message || 'Sign in failed');
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (firstName || lastName) {
        const displayName = [firstName, lastName].filter(Boolean).join(' ');
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error(error.message || 'Sign up failed');
    }
  };

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // TODO: Use expo-auth-session to get Google ID token
      // Then use: signInWithCredential(auth, googleCredential)
      throw new Error('Google sign-in not implemented. Use expo-auth-session and pass credential to signInWithCredential(auth, credential).');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error(error.message || 'Google sign in failed');
    }
  };

  const signInWithApple = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      // TODO: Use expo-apple-authentication to get Apple ID token
      // Then use: signInWithCredential(auth, appleCredential)
      throw new Error('Apple sign-in not implemented. Use expo-apple-authentication and pass credential to signInWithCredential(auth, credential).');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error(error.message || 'Apple sign in failed');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await clearAuthData();
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        guestMode: true,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  };

  const enableGuestMode = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      guestMode: true,
    });
  };

  const disableGuestMode = () => {
    setAuthState(prev => ({ ...prev, guestMode: false }));
  };

  const storeAuthData = async (user: User, token: string) => {
    if (!user || !token) {
      console.error('Cannot store auth data: user or token is null/undefined', { user, token });
      throw new Error('User and token are required for storing auth data');
    }
    
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
    ]);
  };

  const clearAuthData = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  };

  return {
    ...authState,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    enableGuestMode,
    disableGuestMode,
    signInWithDemo,
  };
};
