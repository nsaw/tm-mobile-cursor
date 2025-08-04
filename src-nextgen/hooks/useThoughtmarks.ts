import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  tags: string[];
  binId?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    wordCount: number;
    readingTime: number;
    lastAccessed?: string;
  };
}

export interface ThoughtmarksState {
  thoughtmarks: Thoughtmark[];
  isLoading: boolean;
  error: string | null;
}

export interface ThoughtmarksActions {
  fetchThoughtmarks: () => Promise<void>;
  createThoughtmark: (title: string, content: string, tags?: string[], binId?: string) => Promise<void>;
  updateThoughtmark: (id: string, updates: Partial<Thoughtmark>) => Promise<void>;
  deleteThoughtmark: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  searchThoughtmarks: (query: string) => Thoughtmark[];
  getThoughtmarksByBin: (binId: string) => Thoughtmark[];
}

const mockThoughtmarks: Thoughtmark[] = [
  {
    id: '1',
    title: 'React Native Best Practices',
    content: 'Always use TypeScript for better type safety and developer experience. Implement proper error boundaries and loading states.',
    tags: ['react-native', 'typescript', 'best-practices'],
    binId: '3',
    isPinned: true,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      wordCount: 25,
      readingTime: 1,
    },
  },
  {
    id: '2',
    title: 'Project Architecture Ideas',
    content: 'Consider implementing a modular architecture with clear separation of concerns. Use dependency injection for better testability.',
    tags: ['architecture', 'modular', 'testing'],
    binId: '2',
    isPinned: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      wordCount: 20,
      readingTime: 1,
    },
  },
  {
    id: '3',
    title: 'Personal Reflection',
    content: 'Today was productive. Learned a lot about systematic error fixing and the importance of proper validation gates.',
    tags: ['personal', 'reflection', 'learning'],
    binId: '1',
    isPinned: false,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      wordCount: 18,
      readingTime: 1,
    },
  },
];

export const useThoughtmarks = (): ThoughtmarksState & ThoughtmarksActions => {
  const [state, setState] = useState<ThoughtmarksState>({
    thoughtmarks: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    loadThoughtmarksFromStorage();
  }, []);

  const loadThoughtmarksFromStorage = async () => {
    try {
      const thoughtmarksData = await AsyncStorage.getItem('thoughtmarks');
      if (thoughtmarksData) {
        const thoughtmarks = JSON.parse(thoughtmarksData) as Thoughtmark[];
        setState(prev => ({
          ...prev,
          thoughtmarks,
          isLoading: false,
        }));
      } else {
        // Initialize with mock data
        await AsyncStorage.setItem('thoughtmarks', JSON.stringify(mockThoughtmarks));
        setState(prev => ({
          ...prev,
          thoughtmarks: mockThoughtmarks,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load thoughtmarks',
        isLoading: false,
      }));
    }
  };

  const fetchThoughtmarks = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
      await loadThoughtmarksFromStorage();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch thoughtmarks',
        isLoading: false,
      }));
    }
  }, []);

  const createThoughtmark = useCallback(async (title: string, content: string, tags: string[] = [], binId?: string) => {
    try {
      const newThoughtmark: Thoughtmark = {
        id: Date.now().toString(),
        title,
        content,
        tags,
        binId,
        isPinned: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          wordCount: content.split(' ').length,
          readingTime: Math.ceil(content.split(' ').length / 200),
        },
      };

      const updatedThoughtmarks = [...state.thoughtmarks, newThoughtmark];
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
      
      setState(prev => ({
        ...prev,
        thoughtmarks: updatedThoughtmarks,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create thoughtmark',
      }));
    }
  }, [state.thoughtmarks]);

  const updateThoughtmark = useCallback(async (id: string, updates: Partial<Thoughtmark>) => {
    try {
      const updatedThoughtmarks = state.thoughtmarks.map(thoughtmark =>
        thoughtmark.id === id
          ? {
              ...thoughtmark,
              ...updates,
              updatedAt: new Date().toISOString(),
              metadata: updates.content ? {
                ...thoughtmark.metadata,
                wordCount: updates.content.split(' ').length,
                readingTime: Math.ceil(updates.content.split(' ').length / 200),
              } : thoughtmark.metadata,
            }
          : thoughtmark
      );
      
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
      
      setState(prev => ({
        ...prev,
        thoughtmarks: updatedThoughtmarks,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update thoughtmark',
      }));
    }
  }, [state.thoughtmarks]);

  const deleteThoughtmark = useCallback(async (id: string) => {
    try {
      const updatedThoughtmarks = state.thoughtmarks.filter(thoughtmark => thoughtmark.id !== id);
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
      
      setState(prev => ({
        ...prev,
        thoughtmarks: updatedThoughtmarks,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to delete thoughtmark',
      }));
    }
  }, [state.thoughtmarks]);

  const togglePin = useCallback(async (id: string) => {
    try {
      const updatedThoughtmarks = state.thoughtmarks.map(thoughtmark =>
        thoughtmark.id === id
          ? { ...thoughtmark, isPinned: !thoughtmark.isPinned, updatedAt: new Date().toISOString() }
          : thoughtmark
      );
      
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
      
      setState(prev => ({
        ...prev,
        thoughtmarks: updatedThoughtmarks,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to toggle pin',
      }));
    }
  }, [state.thoughtmarks]);

  const toggleArchive = useCallback(async (id: string) => {
    try {
      const updatedThoughtmarks = state.thoughtmarks.map(thoughtmark =>
        thoughtmark.id === id
          ? { ...thoughtmark, isArchived: !thoughtmark.isArchived, updatedAt: new Date().toISOString() }
          : thoughtmark
      );
      
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
      
      setState(prev => ({
        ...prev,
        thoughtmarks: updatedThoughtmarks,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to toggle archive',
      }));
    }
  }, [state.thoughtmarks]);

  const searchThoughtmarks = useCallback((query: string): Thoughtmark[] => {
    const lowercaseQuery = query.toLowerCase();
    return state.thoughtmarks.filter(thoughtmark =>
      thoughtmark.title.toLowerCase().includes(lowercaseQuery) ||
      thoughtmark.content.toLowerCase().includes(lowercaseQuery) ||
      thoughtmark.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [state.thoughtmarks]);

  const getThoughtmarksByBin = useCallback((binId: string): Thoughtmark[] => {
    return state.thoughtmarks.filter(thoughtmark => thoughtmark.binId === binId);
  }, [state.thoughtmarks]);

  return {
    ...state,
    fetchThoughtmarks,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    togglePin,
    toggleArchive,
    searchThoughtmarks,
    getThoughtmarksByBin,
  };
}; 