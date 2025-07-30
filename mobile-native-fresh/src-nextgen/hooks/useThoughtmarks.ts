import { useState, useCallback, useEffect } from 'react';

import { ThoughtmarkWithBin } from '../types/Thoughtmark';

interface FetchThoughtmarksOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  binId?: string | null;
  favoritesOnly?: boolean;
}

interface UseThoughtmarksReturn {
  thoughtmarks: ThoughtmarkWithBin[];
  loading: boolean;
  error: string | null;
  fetchThoughtmarks: (options?: FetchThoughtmarksOptions) => Promise<ThoughtmarkWithBin[]>;
  refreshThoughtmarks: (options?: FetchThoughtmarksOptions) => Promise<void>;
  createThoughtmark: (thoughtmark: Partial<ThoughtmarkWithBin>) => Promise<ThoughtmarkWithBin>;
  updateThoughtmark: (id: string, updates: Partial<ThoughtmarkWithBin>) => Promise<ThoughtmarkWithBin>;
  deleteThoughtmark: (id: string) => Promise<void>;
}

export const useThoughtmarks = (): UseThoughtmarksReturn => {
  const [thoughtmarks, setThoughtmarks] = useState<ThoughtmarkWithBin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThoughtmarks = useCallback(async (options: FetchThoughtmarksOptions = {}): Promise<ThoughtmarkWithBin[]> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call
      console.log('Fetching thoughtmarks with options:', options);
      
      // Mock data for now
      const mockThoughtmarks: ThoughtmarkWithBin[] = [
        {
          id: '1',
          title: 'Sample Thoughtmark 1',
          content: 'This is a sample thoughtmark content',
          binId: 'bin1',
          binName: 'Work',
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Sample Thoughtmark 2',
          content: 'Another sample thoughtmark',
          binId: 'bin2',
          binName: 'Personal',
          isFavorite: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setThoughtmarks(mockThoughtmarks);
      return mockThoughtmarks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch thoughtmarks';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshThoughtmarks = useCallback(async (options: FetchThoughtmarksOptions = {}): Promise<void> => {
    await fetchThoughtmarks(options);
  }, [fetchThoughtmarks]);

  const createThoughtmark = useCallback(async (thoughtmark: Partial<ThoughtmarkWithBin>): Promise<ThoughtmarkWithBin> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call
      console.log('Creating thoughtmark:', thoughtmark);
      
      const newThoughtmark: ThoughtmarkWithBin = {
        id: Date.now().toString(),
        title: thoughtmark.title || 'New Thoughtmark',
        content: thoughtmark.content || '',
        binId: thoughtmark.binId || 'default',
        binName: thoughtmark.binName || 'Default',
        isFavorite: thoughtmark.isFavorite || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setThoughtmarks(prev => [newThoughtmark, ...prev]);
      return newThoughtmark;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create thoughtmark';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateThoughtmark = useCallback(async (id: string, updates: Partial<ThoughtmarkWithBin>): Promise<ThoughtmarkWithBin> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call
      console.log('Updating thoughtmark:', id, updates);
      
      setThoughtmarks(prev => prev.map(tm => 
        tm.id === id 
          ? { ...tm, ...updates, updatedAt: new Date().toISOString() }
          : tm
      ));

      const updatedThoughtmark = thoughtmarks.find(tm => tm.id === id);
      if (!updatedThoughtmark) {
        throw new Error('Thoughtmark not found');
      }

      return { ...updatedThoughtmark, ...updates, updatedAt: new Date().toISOString() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update thoughtmark';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [thoughtmarks]);

  const deleteThoughtmark = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call
      console.log('Deleting thoughtmark:', id);
      
      setThoughtmarks(prev => prev.filter(tm => tm.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete thoughtmark';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchThoughtmarks();
  }, [fetchThoughtmarks]);

  return {
    thoughtmarks,
    loading,
    error,
    fetchThoughtmarks,
    refreshThoughtmarks,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
  };
}; 