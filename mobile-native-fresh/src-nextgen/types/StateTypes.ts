export interface AppState {
  currentEnvironment: 'legacy' | 'nextgen';
  isFirstLaunch: boolean;
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  analytics: boolean;
  version: string;
  buildNumber: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: string | null;
}

export interface UIState {
  isLoading: boolean;
  error: string | null;
  modal: {
    isVisible: boolean;
    type: string | null;
    data: unknown;
  };
  sidebar: {
    isOpen: boolean;
  };
  search: {
    query: string;
    isActive: boolean;
    results: unknown[];
    filters: {
      bins: string[];
      tags: string[];
      dateRange: { start: string | null; end: string | null };
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    };
  };
  toast: {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  };
}

// Import User type for AuthState
import { User } from './DataTypes'; 