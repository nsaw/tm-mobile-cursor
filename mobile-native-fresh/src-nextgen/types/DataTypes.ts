export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  binId: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  isPinned: boolean;
  isPublic: boolean;
  likes: number;
  comments: number;
  shares: number;
}

export interface Bin {
  id: string;
  name: string;
  color: string;
  thoughtmarkCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
} 