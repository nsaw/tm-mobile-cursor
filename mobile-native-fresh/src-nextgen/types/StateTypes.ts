import { User, Thoughtmark, Bin, Task } from './DataTypes';

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
    data: any;
  };
  sidebar: {
    isOpen: boolean;
  };
  search: {
    query: string;
    isActive: boolean;
    results: any[];
    filters: SearchFilters;
  };
  toast: {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration: number;
  };
}

export interface SearchFilters {
  bins: string[];
  tags: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  sortBy: 'created' | 'updated' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

export interface RootState {
  app: AppState;
  auth: AuthState;
  ui: UIState;
  thoughtmarks: Thoughtmark[];
  bins: Bin[];
  tasks: Task[];
} 