import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SignInCredentials, SignUpCredentials, PINCredentials } from '../types/auth';

const AUTH_STORAGE_KEY = '@thoughtmarks_auth';
const PIN_STORAGE_KEY = '@thoughtmarks_pin';

class AuthService {
  private currentUser: User | null = null;

  async signInWithEmail(credentials: SignInCredentials): Promise<User> {
    try {
      console.log('Signing in with email:', credentials.email);
      // Simulate API call
      await this.delay(1000);

      const user: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        name: credentials.email.split('@')[0],
        provider: 'email',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: {
            dataSharing: false,
            analytics: true,
          },
        },
      };

      this.currentUser = user;
      await this.saveAuthState(user);
      return user;
    } catch (error) {
      console.error('Email sign in failed:', error);
      throw new Error('Invalid email or password');
    }
  }

  async signUpWithEmail(credentials: SignUpCredentials): Promise<User> {
    try {
      console.log('Signing up with email:', credentials.email);
      // Simulate API call
      await this.delay(1500);

      const user: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        name: credentials.name,
        provider: 'email',
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: {
            dataSharing: false,
            analytics: true,
          },
        },
      };

      this.currentUser = user;
      await this.saveAuthState(user);
      return user;
    } catch (error) {
      console.error('Email sign up failed:', error);
      throw new Error('Failed to create account');
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      console.log('Signing in with Google');
      // Simulate Google OAuth
      await this.delay(2000);

      const user: User = {
        id: 'google_user_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        avatar: 'https://via.placeholder.com/150',
        provider: 'google',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: {
            dataSharing: false,
            analytics: true,
          },
        },
      };

      this.currentUser = user;
      await this.saveAuthState(user);
      return user;
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw new Error('Google sign in failed');
    }
  }

  async signInWithApple(): Promise<User> {
    try {
      console.log('Signing in with Apple');
      // Simulate Apple OAuth
      await this.delay(2000);

      const user: User = {
        id: 'apple_user_' + Date.now(),
        email: 'user@icloud.com',
        name: 'Apple User',
        avatar: 'https://via.placeholder.com/150',
        provider: 'apple',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: {
            dataSharing: false,
            analytics: true,
          },
        },
      };

      this.currentUser = user;
      await this.saveAuthState(user);
      return user;
    } catch (error) {
      console.error('Apple sign in failed:', error);
      throw new Error('Apple sign in failed');
    }
  }

  async signInAsDemo(): Promise<User> {
    try {
      console.log('Signing in as demo user');
      await this.delay(500);

      const user: User = {
        id: 'demo_user',
        email: 'demo@thoughtmarks.app',
        name: 'Demo User',
        provider: 'demo',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          theme: 'system',
          notifications: true,
          privacy: {
            dataSharing: false,
            analytics: true,
          },
        },
      };

      this.currentUser = user;
      await this.saveAuthState(user);
      return user;
    } catch (error) {
      console.error('Demo sign in failed:', error);
      throw new Error('Demo sign in failed');
    }
  }

  async signOut(): Promise<void> {
    try {
      console.log('Signing out');
      this.currentUser = null;
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  async setupPIN(credentials: PINCredentials): Promise<void> {
    try {
      if (credentials.pin !== credentials.confirmPin) {
        throw new Error('PINs do not match');
      }

      if (credentials.pin.length !== 4) {
        throw new Error('PIN must be 4 digits');
      }

      await AsyncStorage.setItem(PIN_STORAGE_KEY, credentials.pin);
      console.log('PIN setup successful');
    } catch (error) {
      console.error('PIN setup failed:', error);
      throw error;
    }
  }

  async verifyPIN(pin: string): Promise<boolean> {
    try {
      const storedPIN = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      return storedPIN === pin;
    } catch (error) {
      console.error('PIN verification failed:', error);
      return false;
    }
  }

  async hasPIN(): Promise<boolean> {
    try {
      const pin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      return !!pin;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  private async saveAuthState(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save auth state:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const authService = new AuthService();
