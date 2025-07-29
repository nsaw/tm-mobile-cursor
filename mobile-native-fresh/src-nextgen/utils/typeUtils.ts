import React from 'react';

// Replace any types with proper TypeScript types
export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type NavigationProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message: string;
};

export type ApiError = {
  error: string;
  status: number;
  details?: unknown;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Thoughtmark = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type Bin = {
  id: string;
  name: string;
  description?: string;
  thoughtmarkIds: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type AppState = {
  user: User | null;
  thoughtmarks: Thoughtmark[];
  bins: Bin[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
};

export type UIState = {
  theme: 'light' | 'dark';
  language: string;
  sidebarOpen: boolean;
  modalOpen: boolean;
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duration?: number;
  timestamp?: number;
};

export type PerformanceMetrics = {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
}; 