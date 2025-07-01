export interface Thoughtmark {
  id: number;
  title: string;
  content: string;
  tags: string[];
  binId?: number;
  isPinned: boolean;
  isTask: boolean;
  isCompleted: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  userId: number;
  createdAt: string;
}

export interface User {
  id: number;
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface CreateThoughtmarkRequest {
  title: string;
  content: string;
  tags?: string[];
  binId?: number;
  isPinned?: boolean;
  isTask?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export type NavigationScreenProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  setOptions: (options: any) => void;
};

export type RootStackParamList = {
  Home: undefined;
  Create: undefined;
  Detail: { id: number };
  Profile: undefined;
  Login: undefined;
};