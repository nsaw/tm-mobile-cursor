// Shared TypeScript types and interfaces for React Native app

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  firebaseUid?: string;
  roleId?: number;
  isAdmin?: boolean;
  isPremium: boolean;
  isTestUser: boolean;
  premiumExpiresAt?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Thoughtmark {
  id: number;
  title: string;
  content: string;
  binId?: number;
  userId: number;
  tags: string[];
  aiSummary?: string;
  aiCategorySuggestions: string[];
  voiceNoteUrl?: string;
  voiceTranscription?: string;
  isArchived: boolean;
  isPinned: boolean;
  isDeleted: boolean;
  isTask: boolean;
  isCompleted: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThoughtmarkWithBin extends Thoughtmark {
  binName?: string;
}

export interface Bin {
  id: number;
  name: string;
  description?: string;
  userId: number;
  color?: string;
  icon?: string;
  isDefault: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  sortOrder: number;
  thoughtmarkCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AIInsight {
  type: 'pattern' | 'suggestion' | 'summary';
  title: string;
  description: string;
  confidence: number;
  actionable?: boolean;
  relatedThoughtmarks?: number[];
}

export interface VoiceRecording {
  uri: string;
  duration: number;
  size: number;
  transcription?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  guestMode: boolean;
}

export interface Navigation {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  replace: (screen: string, params?: any) => void;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ThoughtmarkFormData {
  title: string;
  content: string;
  binId?: number;
  tags: string[];
  voiceNoteUrl?: string;
  isPinned?: boolean;
}

export interface BinFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  biometricAuth: boolean;
  autoSync: boolean;
  offlineMode: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}