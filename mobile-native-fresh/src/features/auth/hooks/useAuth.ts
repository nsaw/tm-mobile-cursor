import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, type AppStateStatus } from 'react-native';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

import { auth } from '../../../config/firebase';
import { apiService } from '../../../services/api';
import type { User, AuthState } from '../../../types';

const STORAGE_KEYS = {
  USER: '@thoughtmarks_user',
  TOKEN: '@thoughtmarks_token',
  REFRESH_TOKEN: '@thoughtmarks_refresh_token',
  LAST_ACTIVE: '@thoughtmarks_last_active',
};

// Idle timeout in minutes
const IDLE_TIMEOUT_MINUTES = 30;

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    guestMode: false,
  });

  // Initialize auth state from Firebase
  useEffect(() => {
    console.log('🔐 Auth: Initializing authentication...');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔐 Auth: Firebase auth state changed:', firebaseUser ? 'User logged in' : 'No user');
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
        console.log('🔐 Auth: No Firebase user, attempting demo login...');
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

  // App state listener for idle logout (30 minutes timeout)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('🔐 Auth: App state changed to:', nextAppState);
      
      if (nextAppState === 'active') {
        // App became active, check if user was idle too long
        await checkIdleTimeout();
        // Update last active timestamp
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App going to background, store current timestamp
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString());
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initialize last active timestamp if not exists
    AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVE).then((lastActive) => {
      if (!lastActive) {
        AsyncStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, Date.now().toString()).catch(console.error);
      }
    }).catch(console.error);

    return () => {
      subscription?.remove();
    };
  }, [authState.isAuthenticated]);

  const checkIdleTimeout = async () => {
    if (!authState.isAuthenticated) return;

    try {
      const lastActiveStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
      if (!lastActiveStr) return;

      const lastActive = parseInt(lastActiveStr, 10);
      const now = Date.now();
      const idleTimeMinutes = (now - lastActive) / (1000 * 60);

      if (idleTimeMinutes > IDLE_TIMEOUT_MINUTES) {
        console.log('🔐 Auth: User idle for', idleTimeMinutes.toFixed(1), 'minutes, logging out...');
        await signOut();
      }
    } catch (error) {
      console.error('Error checking idle timeout:', error);
    }
  };

  const signInWithDemo = async () => {
    console.log('🔐 Auth: Starting demo login...');
    try {
      const res = await apiService.demoLogin();
      console.log('🔐 Auth: Demo login response:', JSON.stringify(res, null, 2));
      
      if (res.success && res.data && res.data.user && res.data.token) {
        // Ensure token is a string and user is an object
        const token = String(res.data.token);
        const user = res.data.user as User;
        
        console.log('🔐 Auth: Storing auth data:', { 
          user: user, 
          token: token,
          userType: typeof user,
          tokenType: typeof token
        });
        await storeAuthData(user, token);
        setAuthState({
          user: user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
        console.log('🔐 Auth: Demo login successful!');
      } else {
        console.log('🔐 Auth: Demo login failed or missing data:', {
          success: res.success,
          hasData: !!res.data,
          hasUser: !!(res.data && res.data.user),
          hasToken: !!(res.data && res.data.token),
          dataKeys: res.data ? Object.keys(res.data) : 'no data'
        });
        setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
      }
    } catch (error) {
      console.error('🔐 Auth: Failed to sign in with demo:', error);
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

  const refreshUser = async () => {
    if (!authState.isAuthenticated || !authState.user) {
      console.log('🔐 Auth: Cannot refresh user - not authenticated');
      return;
    }

    try {
      console.log('🔐 Auth: Refreshing user data...');
      const response = await apiService.getUserProfile();
      
      if (response.success && response.data) {
        const updatedUser = response.data;
        await storeAuthData(updatedUser, await AsyncStorage.getItem(STORAGE_KEYS.TOKEN) || '');
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
        
        console.log('🔐 Auth: User data refreshed successfully');
      } else {
        console.error('🔐 Auth: Failed to refresh user data:', response.error);
      }
    } catch (error) {
      console.error('🔐 Auth: Error refreshing user data:', error);
    }
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
    refreshUser,
  };
};
