import { useState, useEffect, useCallback, useRef } from 'react';

import type { Bin, BinFormData } from '../../../types';
import { useAuth } from '../../auth/hooks/useAuth';
import { apiService } from '../../../services/api';

// Template data for new user onboarding
const templateBins = [
  {
    id: 1,
    name: 'Work & Projects',
    description: 'Professional tasks and project-related items',
    color: '#3B82F6',
    icon: 'briefcase-outline',
    userId: 1,
    isDefault: true,
    isArchived: false,
    isDeleted: false,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Personal',
    description: 'Personal tasks and reminders',
    color: '#10B981',
    icon: 'person-outline',
    userId: 1,
    isDefault: false,
    isArchived: false,
    isDeleted: false,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Ideas & Notes',
    description: 'Random ideas and quick notes',
    color: '#F59E0B',
    icon: 'bulb-outline',
    userId: 1,
    isDefault: false,
    isArchived: false,
    isDeleted: false,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Shopping',
    description: 'Shopping lists and errands',
    color: '#EF4444',
    icon: 'cart-outline',
    userId: 1,
    isDefault: false,
    isArchived: false,
    isDeleted: false,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useBins = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const fetchBinsRef = useRef<boolean>(false);

  const fetchBins = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBins();
      console.log('Bins API response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // If we get data from the API, use it
        if (response.data.length > 0) {
          console.log('Using API bins:', response.data.length, 'items');
          setBins(response.data);
        } else {
          // If no data returned, use template data for demo purposes
          console.log('No bins found in database, using template data');
          setBins(templateBins);
        }
      } else {
        // If API fails, fall back to template data
        console.log('API failed, using template data. Error:', response.error);
        setBins(templateBins);
      }
    } catch (error) {
      console.error('Error fetching bins:', error);
      setError('Failed to fetch bins');
      setBins(templateBins);
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
    if (isAuthenticated && !fetchBinsRef.current) {
      fetchBins();
      fetchBinsRef.current = true;
    } else if (!isAuthenticated) {
      setBins([]);
      fetchBinsRef.current = false;
    }
  }, [isAuthenticated]); // Removed fetchBins from dependencies

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