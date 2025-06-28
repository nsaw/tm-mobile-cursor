import { useState, useEffect } from 'react';
import { thoughtmarkService } from '../services/api';
import { Thoughtmark } from '../types';

export const useThoughtmarks = () => {
  const [thoughtmarks, setThoughtmarks] = useState<Thoughtmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadThoughtmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await thoughtmarkService.getThoughtmarks();
      setThoughtmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load thoughtmarks');
      console.error('Failed to load thoughtmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadThoughtmarks();
  };

  const createThoughtmark = async (thoughtmark: Partial<Thoughtmark>) => {
    try {
      const newThoughtmark = await thoughtmarkService.createThoughtmark(thoughtmark);
      setThoughtmarks(prev => [newThoughtmark, ...prev]);
      return newThoughtmark;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thoughtmark');
      throw err;
    }
  };

  useEffect(() => {
    loadThoughtmarks();
  }, []);

  return {
    thoughtmarks,
    loading,
    error,
    refresh,
    createThoughtmark,
  };
};