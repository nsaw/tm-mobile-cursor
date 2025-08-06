import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Thoughtmark } from '../types/DataTypes';

export interface UseThoughtmarksReturn {
  thoughtmarks: Thoughtmark[];
  isLoading: boolean;
  loading: boolean; // Alias for isLoading for backward compatibility
  error: string | null;
  fetchThoughtmarks: () => Promise<void>;
  createThoughtmark: (thoughtmark: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateThoughtmark: (id: string, updates: Partial<Thoughtmark>) => Promise<void>;
  deleteThoughtmark: (id: string) => Promise<void>;
  likeThoughtmark: (id: string) => Promise<void>;
  unlikeThoughtmark: (id: string) => Promise<void>;
  searchThoughtmarks: (query: string) => Promise<Thoughtmark[]>;
  getThoughtmarkById: (id: string) => Thoughtmark | undefined;
}

// Re-export Thoughtmark for convenience
export { Thoughtmark } from '../types/DataTypes';

// Mock data for development
const mockThoughtmarks: Thoughtmark[] = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare',
    content: 'Artificial intelligence is revolutionizing healthcare delivery, from diagnostic imaging to personalized treatment plans. The integration of AI systems promises to improve patient outcomes while reducing costs and increasing efficiency across the healthcare ecosystem.',
    author: 'Dr. Sarah Chen',
    createdAt: '2024-07-28T10:30:00Z',
    updatedAt: '2024-07-28T10:30:00Z',
    tags: ['AI', 'Healthcare', 'Technology'],
    binId: 'default',
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 42,
    comments: 8,
    shares: 12,
  },
  {
    id: '2',
    title: 'Sustainable Urban Planning',
    content: 'Cities around the world are embracing sustainable urban planning principles to create more livable, environmentally friendly communities. Green infrastructure, renewable energy, and smart transportation systems are key components of this transformation.',
    author: 'Marcus Rodriguez',
    createdAt: '2024-07-27T15:45:00Z',
    updatedAt: '2024-07-27T15:45:00Z',
    tags: ['Urban Planning', 'Sustainability', 'Cities'],
    binId: 'default',
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 28,
    comments: 5,
    shares: 7,
  },
  {
    id: '3',
    title: 'The Psychology of Habit Formation',
    content: 'Understanding how habits are formed and maintained is crucial for personal development and behavior change. Research shows that consistent routines, environmental cues, and reward systems play essential roles in building lasting habits.',
    author: 'Dr. Emily Watson',
    createdAt: '2024-07-26T09:15:00Z',
    updatedAt: '2024-07-26T09:15:00Z',
    tags: ['Psychology', 'Habits', 'Self-Improvement'],
    binId: 'default',
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 35,
    comments: 12,
    shares: 9,
  },
  {
    id: '4',
    title: 'Blockchain Beyond Cryptocurrency',
    content: 'While blockchain is often associated with cryptocurrency, its applications extend far beyond digital currencies. Supply chain management, voting systems, and digital identity verification are just a few areas where blockchain technology is making significant impacts.',
    author: 'Alex Thompson',
    createdAt: '2024-07-25T14:20:00Z',
    updatedAt: '2024-07-25T14:20:00Z',
    tags: ['Blockchain', 'Technology', 'Innovation'],
    binId: 'default',
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 19,
    comments: 3,
    shares: 4,
  },
  {
    id: '5',
    title: 'The Art of Mindful Communication',
    content: 'Mindful communication involves being fully present in conversations, listening with empathy, and responding with intention. This approach can transform relationships, reduce conflicts, and create deeper connections with others.',
    author: 'Lisa Park',
    createdAt: '2024-07-24T11:00:00Z',
    updatedAt: '2024-07-24T11:00:00Z',
    tags: ['Communication', 'Mindfulness', 'Relationships'],
    binId: 'default',
    isArchived: false,
    isPinned: false,
    isPublic: true,
    likes: 31,
    comments: 7,
    shares: 6,
  },
];

export const useThoughtmarks = (): UseThoughtmarksReturn => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThoughtmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
      
      // For now, use mock data
      // In production, this would fetch from API
      setThoughtmarks(mockThoughtmarks);
      
      // Store in AsyncStorage for offline access
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(mockThoughtmarks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch thoughtmarks');
      console.error('Error fetching thoughtmarks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createThoughtmark = useCallback(async (thoughtmarkData: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newThoughtmark: Thoughtmark = {
        ...thoughtmarkData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setThoughtmarks(prev => [newThoughtmark, ...prev]);
      
      // Store updated list
      const updatedThoughtmarks = [newThoughtmark, ...thoughtmarks];
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thoughtmark');
      console.error('Error creating thoughtmark:', err);
    }
  }, [thoughtmarks]);

  const updateThoughtmark = useCallback(async (id: string, updates: Partial<Thoughtmark>) => {
    try {
      setThoughtmarks(prev => 
        prev.map(tm => 
          tm.id === id 
            ? { ...tm, ...updates, updatedAt: new Date().toISOString() }
            : tm
        )
      );
      
      // Store updated list
      const updatedThoughtmarks = thoughtmarks.map(tm => 
        tm.id === id 
          ? { ...tm, ...updates, updatedAt: new Date().toISOString() }
          : tm
      );
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update thoughtmark');
      console.error('Error updating thoughtmark:', err);
    }
  }, [thoughtmarks]);

  const deleteThoughtmark = useCallback(async (id: string) => {
    try {
      setThoughtmarks(prev => prev.filter(tm => tm.id !== id));
      
      // Store updated list
      const updatedThoughtmarks = thoughtmarks.filter(tm => tm.id !== id);
      await AsyncStorage.setItem('thoughtmarks', JSON.stringify(updatedThoughtmarks));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete thoughtmark');
      console.error('Error deleting thoughtmark:', err);
    }
  }, [thoughtmarks]);

  const likeThoughtmark = useCallback(async (id: string) => {
    try {
      setThoughtmarks(prev => 
        prev.map(tm => 
          tm.id === id 
            ? { ...tm, likes: tm.likes + 1 }
            : tm
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like thoughtmark');
      console.error('Error liking thoughtmark:', err);
    }
  }, []);

  const unlikeThoughtmark = useCallback(async (id: string) => {
    try {
      setThoughtmarks(prev => 
        prev.map(tm => 
          tm.id === id 
            ? { ...tm, likes: Math.max(0, tm.likes - 1) }
            : tm
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlike thoughtmark');
      console.error('Error unliking thoughtmark:', err);
    }
  }, []);

  const searchThoughtmarks = useCallback(async (query: string): Promise<Thoughtmark[]> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
      
      const lowerQuery = query.toLowerCase();
      return thoughtmarks.filter(tm => 
        tm.title.toLowerCase().includes(lowerQuery) ||
        tm.content.toLowerCase().includes(lowerQuery) ||
        tm.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search thoughtmarks');
      console.error('Error searching thoughtmarks:', err);
      return [];
    }
  }, [thoughtmarks]);

  const getThoughtmarkById = useCallback((id: string): Thoughtmark | undefined => {
    return thoughtmarks.find(tm => tm.id === id);
  }, [thoughtmarks]);

  // Load thoughtmarks on mount
  useEffect(() => {
    fetchThoughtmarks();
  }, [fetchThoughtmarks]);

  return {
    thoughtmarks,
    isLoading,
    loading: isLoading, // Alias for backward compatibility
    error,
    fetchThoughtmarks,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    likeThoughtmark,
    unlikeThoughtmark,
    searchThoughtmarks,
    getThoughtmarkById,
  };
}; 