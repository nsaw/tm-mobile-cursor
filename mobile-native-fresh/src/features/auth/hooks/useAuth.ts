import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { apiService } from '../../../services/api';
import type { User, AuthState } from '../../../types';

const STORAGE_KEYS = {
  USER: '@thoughtmarks_user',
  TOKEN: '@thoughtmarks_token',
  REFRESH_TOKEN: '@thoughtmarks_refresh_token',
};

// Pull your client IDs from app.json → expo.extra
const {
  googleIosClientId,
  googleAndroidClientId,
  googleWebClientId,
} = (Constants.expoConfig?.extra ?? {}) as {
  googleIosClientId?: string;
  googleAndroidClientId?: string;
  googleWebClientId?: string;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    guestMode: false,
  });

  // Google OAuth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:   googleIosClientId,
    androidClientId: googleAndroidClientId,
    webClientId:     googleWebClientId,
    expoClientId:    googleWebClientId, // for Expo Go
  });

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response.authentication?.accessToken);
    }
  }, [response]);

  const initializeAuth = async () => {
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
      ]);

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser) as User;
        await validateAndSetUser(user, storedToken);
      } else {
        setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
    }
  };

  const validateAndSetUser = async (user: User, token: string) => {
    try {
      const res = await apiService.validateToken(token);
      if (res.success && res.data) {
        setAuthState({
          user: res.data,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
      } else {
        await clearAuthData();
        setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      await clearAuthData();
      setAuthState(prev => ({ ...prev, loading: false, guestMode: true }));
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const res = await apiService.signIn(email, password);
      if (res.success && res.data) {
        await storeAuthData(res.data.user, res.data.token);
        setAuthState({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
        return res.data.user;
      }
      throw new Error(res.error || 'Sign in failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const res = await apiService.signUp(email, password, firstName, lastName);
      if (res.success && res.data) {
        await storeAuthData(res.data.user, res.data.token);
        setAuthState({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
        return res.data.user;
      }
      throw new Error(res.error || 'Sign up failed');
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await promptAsync();
    if (result.type !== 'success') {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error('Google sign in was cancelled');
    }
  };

  const handleGoogleAuthSuccess = async (accessToken?: string) => {
    if (!accessToken) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw new Error('No access token received from Google');
    }
    try {
      const res = await apiService.signInWithGoogle(accessToken);
      if (res.success && res.data) {
        await storeAuthData(res.data.user, res.data.token);
        setAuthState({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
      } else {
        throw new Error(res.error || 'Google sign in failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const signInWithApple = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const res = await apiService.signInWithApple(credential);
      if (res.success && res.data) {
        await storeAuthData(res.data.user, res.data.token);
        setAuthState({
          user: res.data.user,
          isAuthenticated: true,
          loading: false,
          guestMode: false,
        });
        return res.data.user;
      }
      throw new Error(res.error || 'Apple sign in failed');
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, loading: false }));
      if (error.code === 'ERR_REQUEST_CANCELED') {
        throw new Error('Apple sign in was cancelled');
      }
      throw error;
    }
  };

  const signOut = async () => {
    await clearAuthData();
    setAuthState({ user: null, isAuthenticated: false, loading: false, guestMode: true });
  };

  // Helpers
  const storeAuthData = async (user: User, token: string) => {
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
  };
};
