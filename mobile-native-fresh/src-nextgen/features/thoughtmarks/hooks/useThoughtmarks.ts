import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../../state/store';
import { Thoughtmark, CreateThoughtmarkRequest, UpdateThoughtmarkRequest } from '../types/thoughtmark';
import { thoughtmarkService } from '../services/thoughtmarkService';

export const useThoughtmarks = () => {
  const { user } = useAppStore();
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: null as string | null,
    tags: [] as string[],
    binId: null as string | null,
    status: null as string | null,
  });

  const loadThoughtmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await thoughtmarkService.getThoughtmarks(filters);
      setThoughtmarks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load thoughtmarks');
      console.error('Error loading thoughtmarks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (user?.id) {
      loadThoughtmarks();
    }
  }, [user?.id, loadThoughtmarks]);

  const createThoughtmark = async (request: CreateThoughtmarkRequest) => {
    try {
      const newThoughtmark = await thoughtmarkService.createThoughtmark(request);
      setThoughtmarks(prev => [newThoughtmark, ...prev]);
      return { success: true, data: newThoughtmark };
    } catch (err) {
      setError('Failed to create thoughtmark');
      console.error('Error creating thoughtmark:', err);
      return { success: false, error: err };
    }
  };

  const updateThoughtmark = async (id: string, updates: UpdateThoughtmarkRequest) => {
    try {
      const updatedThoughtmark = await thoughtmarkService.updateThoughtmark(id, updates);
      setThoughtmarks(prev =>
        prev.map(tm => tm.id === id ? updatedThoughtmark : tm)
      );
      return { success: true, data: updatedThoughtmark };
    } catch (err) {
      setError('Failed to update thoughtmark');
      console.error('Error updating thoughtmark:', err);
      return { success: false, error: err };
    }
  };

  const deleteThoughtmark = async (id: string) => {
    try {
      await thoughtmarkService.deleteThoughtmark(id);
      setThoughtmarks(prev => prev.filter(tm => tm.id !== id));
      return { success: true };
    } catch (err) {
      setError('Failed to delete thoughtmark');
      console.error('Error deleting thoughtmark:', err);
      return { success: false, error: err };
    }
  };

  const generateAIInsights = async (id: string) => {
    try {
      const insights = await thoughtmarkService.generateAIInsights(id);
      setThoughtmarks(prev =>
        prev.map(tm => tm.id === id ? { ...tm, aiInsights: insights } : tm)
      );
      return { success: true, data: insights };
    } catch (err) {
      setError('Failed to generate AI insights');
      console.error('Error generating AI insights:', err);
      return { success: false, error: err };
    }
  };

  return {
    thoughtmarks,
    loading,
    error,
    filters,
    setFilters,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    generateAIInsights,
    refreshThoughtmarks: loadThoughtmarks,
  };
};
