export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'apple' | 'email' | 'demo';
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresPIN: boolean;
  isDemoUser: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface PINCredentials {
  pin: string;
  confirmPin?: string;
}
