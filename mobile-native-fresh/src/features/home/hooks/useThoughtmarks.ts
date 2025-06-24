import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../../../services/api';
import type { Thoughtmark, ThoughtmarkFormData } from '../../../types';
import { useAuth } from '../../auth/hooks/useAuth';

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
          // If no data returned, show empty list
          setThoughtmarks([]);
        }
      } else {
        // If API fails, show empty list
        setThoughtmarks([]);
      }
    } catch (error) {
      console.error('Error fetching thoughtmarks:', error);
      setError('Failed to fetch thoughtmarks');
      setThoughtmarks([]);
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