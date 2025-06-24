import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../../../services/api';
import type { Thoughtmark, ThoughtmarkFormData } from '../../../types';
import { useAuth } from '../../auth/hooks/useAuth';

// Mock data for immediate testing
const mockThoughtmarks: Thoughtmark[] = [
  {
    id: 1,
    title: 'React Native Best Practices',
    content: 'Always use StyleSheet.create for better performance. Avoid inline styles and use proper component composition. Remember to handle loading states and error boundaries.',
    tags: ['react-native', 'performance', 'best-practices'],
    binId: 1,
    userId: 1,
    aiSummary: 'Best practices for React Native development',
    aiCategorySuggestions: ['mobile', 'development'],
    isArchived: false,
    isPinned: true,
    isDeleted: false,
    isTask: false,
    isCompleted: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Grocery Shopping List',
    content: 'Milk, bread, eggs, cheese, tomatoes, onions, garlic, olive oil, pasta, chicken breast, spinach, bananas, apples',
    tags: ['shopping', 'food', 'groceries'],
    binId: 2,
    userId: 1,
    aiSummary: 'Grocery shopping list with essential items',
    aiCategorySuggestions: ['shopping', 'food'],
    isArchived: false,
    isPinned: false,
    isDeleted: false,
    isTask: true,
    isCompleted: false,
    dueDate: '2024-01-20T18:00:00Z',
    priority: 'medium',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
  {
    id: 3,
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed Q1 goals and objectives. Key focus areas: user acquisition, feature development, and team expansion. Budget approved for new hires.',
    tags: ['meeting', 'planning', 'business'],
    binId: 3,
    userId: 1,
    aiSummary: 'Q1 planning meeting notes with key objectives',
    aiCategorySuggestions: ['business', 'planning'],
    isArchived: false,
    isPinned: false,
    isDeleted: false,
    isTask: false,
    isCompleted: false,
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
  },
  {
    id: 4,
    title: 'Call Mom',
    content: 'Remember to call mom this weekend to check in and see how she\'s doing.',
    tags: ['personal', 'family'],
    binId: 2,
    userId: 1,
    aiSummary: 'Personal reminder to call family',
    aiCategorySuggestions: ['personal', 'family'],
    isArchived: false,
    isPinned: false,
    isDeleted: false,
    isTask: true,
    isCompleted: false,
    dueDate: '2024-01-16T20:00:00Z',
    priority: 'high',
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
  },
  {
    id: 5,
    title: 'Book Flight to Conference',
    content: 'Need to book flight for React Native conference in San Francisco. Check dates and book early for better prices.',
    tags: ['travel', 'work', 'conference'],
    binId: 1,
    userId: 1,
    aiSummary: 'Travel planning for work conference',
    aiCategorySuggestions: ['travel', 'work'],
    isArchived: false,
    isPinned: false,
    isDeleted: false,
    isTask: true,
    isCompleted: false,
    dueDate: '2024-01-25T12:00:00Z',
    priority: 'medium',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
  },
];

export const useThoughtmarks = () => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const fetchThoughtmarksRef = useRef<boolean>(false);

  const fetchThoughtmarks = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getThoughtmarks();
      console.log('Thoughtmarks API response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // If we get data from the API, use it
        if (response.data.length > 0) {
          console.log('Using API thoughtmarks:', response.data.length, 'items');
          setThoughtmarks(response.data);
        } else {
          // If no data returned, use mock data for demo purposes
          console.log('No thoughtmarks found in database, using mock data');
          setThoughtmarks(mockThoughtmarks);
        }
      } else {
        // If API fails, fall back to mock data
        console.log('API failed, using mock data. Error:', response.error);
        setThoughtmarks(mockThoughtmarks);
      }
    } catch (error) {
      console.error('Error fetching thoughtmarks:', error);
      setError('Failed to fetch thoughtmarks');
      setThoughtmarks(mockThoughtmarks);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getThoughtmark = useCallback(async (id: number): Promise<Thoughtmark> => {
    const response = await apiService.getThoughtmark(id);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch thoughtmark');
  }, []);

  const createThoughtmark = useCallback(async (data: ThoughtmarkFormData): Promise<Thoughtmark> => {
    const response = await apiService.createThoughtmark(data);
    if (response.success && response.data) {
      await fetchThoughtmarks(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to create thoughtmark');
  }, [fetchThoughtmarks]);

  const updateThoughtmark = useCallback(async (id: number, data: Partial<ThoughtmarkFormData>): Promise<Thoughtmark> => {
    const response = await apiService.updateThoughtmark(id, data);
    if (response.success && response.data) {
      await fetchThoughtmarks(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to update thoughtmark');
  }, [fetchThoughtmarks]);

  const deleteThoughtmark = useCallback(async (id: number): Promise<void> => {
    const response = await apiService.deleteThoughtmark(id);
    if (response.success) {
      await fetchThoughtmarks(); // Refresh the list
    } else {
      throw new Error(response.error || 'Failed to delete thoughtmark');
    }
  }, [fetchThoughtmarks]);

  const togglePin = useCallback(async (id: number): Promise<Thoughtmark> => {
    const response = await apiService.togglePin(id);
    if (response.success && response.data) {
      await fetchThoughtmarks(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to toggle pin');
  }, [fetchThoughtmarks]);

  const toggleArchive = useCallback(async (id: number): Promise<Thoughtmark> => {
    const response = await apiService.toggleArchive(id);
    if (response.success && response.data) {
      await fetchThoughtmarks(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to toggle archive');
  }, [fetchThoughtmarks]);

  const searchThoughtmarks = useCallback(async (query: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchThoughtmarks(query);
      
      if (response.success && response.data) {
        setThoughtmarks(response.data);
      } else {
        throw new Error(response.error || 'Failed to search thoughtmarks');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search thoughtmarks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Auto-fetch on mount and auth change
  useEffect(() => {
    if (isAuthenticated && !fetchThoughtmarksRef.current) {
      fetchThoughtmarks();
      fetchThoughtmarksRef.current = true;
    } else if (!isAuthenticated) {
      setThoughtmarks([]);
      fetchThoughtmarksRef.current = false;
    }
  }, [isAuthenticated]);

  return {
    thoughtmarks,
    loading,
    error,
    fetchThoughtmarks,
    getThoughtmark,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    togglePin,
    toggleArchive,
    searchThoughtmarks,
  };
};