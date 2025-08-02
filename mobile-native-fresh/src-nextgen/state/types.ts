export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  tags: string[];
  binId: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isPinned: boolean;
}

export interface Bin {
  id: string;
  name: string;
  description?: string;
  color: string;
  thoughtmarkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  currentEnvironment: 'legacy' | 'nextgen';
  isFirstLaunch: boolean;
  onboardingCompleted: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  analytics: boolean;
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
  };
}

export interface RootState {
  auth: AuthState;
  thoughtmarks: Thoughtmark[];
  bins: Bin[];
  tasks: Task[];
  app: AppState;
  ui: UIState;
} 