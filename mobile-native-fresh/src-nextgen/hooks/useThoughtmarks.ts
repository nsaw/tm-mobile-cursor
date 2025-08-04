import { useState, useEffect, useCallback } from 'react';
import { Thoughtmark } from '../components/ui/ThoughtmarkCard';

export interface UseThoughtmarksReturn {
  thoughtmarks: Thoughtmark[];
  loading: boolean;
  error: string | null;
  fetchThoughtmarks: () => Promise<void>;
  addThoughtmark: (thoughtmark: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateThoughtmark: (id: string, updates: Partial<Thoughtmark>) => Promise<void>;
  deleteThoughtmark: (id: string) => Promise<void>;
  searchThoughtmarks: (query: string) => Promise<void>;
}

export const useThoughtmarks = (): UseThoughtmarksReturn => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThoughtmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call for now
      const mockThoughtmarks: Thoughtmark[] = [
        {
          id: '1',
          title: 'Sample Thoughtmark',
          content: 'This is a sample thoughtmark content for testing purposes.',
          tags: ['sample', 'test'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setThoughtmarks(mockThoughtmarks);
    } catch (err) {
      setError('Failed to fetch thoughtmarks');
      console.error('Error fetching thoughtmarks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addThoughtmark = useCallback(async (thoughtmarkData: Omit<Thoughtmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newThoughtmark: Thoughtmark = {
        ...thoughtmarkData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setThoughtmarks(prev => [...prev, newThoughtmark]);
    } catch (err) {
      setError('Failed to add thoughtmark');
      console.error('Error adding thoughtmark:', err);
    }
  }, []);

  const updateThoughtmark = useCallback(async (id: string, updates: Partial<Thoughtmark>) => {
    try {
      setThoughtmarks(prev => prev.map(thoughtmark => 
        thoughtmark.id === id 
          ? { ...thoughtmark, ...updates, updatedAt: new Date().toISOString() }
          : thoughtmark
      ));
    } catch (err) {
      setError('Failed to update thoughtmark');
      console.error('Error updating thoughtmark:', err);
    }
  }, []);

  const deleteThoughtmark = useCallback(async (id: string) => {
    try {
      setThoughtmarks(prev => prev.filter(thoughtmark => thoughtmark.id !== id));
    } catch (err) {
      setError('Failed to delete thoughtmark');
      console.error('Error deleting thoughtmark:', err);
    }
  }, []);

  const searchThoughtmarks = useCallback(async (query: string) => {
    setLoading(true);
    try {
      // Mock search implementation
      const filteredThoughtmarks = thoughtmarks.filter(thoughtmark =>
        thoughtmark.title.toLowerCase().includes(query.toLowerCase()) ||
        thoughtmark.content.toLowerCase().includes(query.toLowerCase()) ||
        thoughtmark.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setThoughtmarks(filteredThoughtmarks);
    } catch (err) {
      setError('Failed to search thoughtmarks');
      console.error('Error searching thoughtmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [thoughtmarks]);

  useEffect(() => {
    fetchThoughtmarks();
  }, [fetchThoughtmarks]);

  return {
    thoughtmarks,
    loading,
    error,
    fetchThoughtmarks,
    addThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    searchThoughtmarks,
  };
}; 