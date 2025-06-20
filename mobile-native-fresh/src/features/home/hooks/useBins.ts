import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../../services/api';
import type { Bin, BinFormData } from '../../../types';
import { useAuth } from '../../auth/hooks/useAuth';

export const useBins = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchBins = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBins();
      
      if (response.success && response.data) {
        setBins(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch bins');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bins';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getBin = useCallback(async (id: number): Promise<Bin> => {
    const response = await apiService.getBin(id);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to fetch bin');
  }, []);

  const createBin = useCallback(async (data: BinFormData): Promise<Bin> => {
    const response = await apiService.createBin(data);
    if (response.success && response.data) {
      await fetchBins(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to create bin');
  }, [fetchBins]);

  const updateBin = useCallback(async (id: number, data: Partial<BinFormData>): Promise<Bin> => {
    const response = await apiService.updateBin(id, data);
    if (response.success && response.data) {
      await fetchBins(); // Refresh the list
      return response.data;
    }
    throw new Error(response.error || 'Failed to update bin');
  }, [fetchBins]);

  const deleteBin = useCallback(async (id: number): Promise<void> => {
    const response = await apiService.deleteBin(id);
    if (response.success) {
      await fetchBins(); // Refresh the list
    } else {
      throw new Error(response.error || 'Failed to delete bin');
    }
  }, [fetchBins]);

  // Auto-fetch on mount and auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchBins();
    } else {
      setBins([]);
    }
  }, [isAuthenticated, fetchBins]);

  return {
    bins,
    loading,
    error,
    fetchBins,
    getBin,
    createBin,
    updateBin,
    deleteBin,
  };
};