import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bin {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  isCollaborative: boolean;
  thoughtmarkCount: number;
  createdAt: string;
  updatedAt: string;
  collaborators?: string[];
}

export interface BinsState {
  bins: Bin[];
  isLoading: boolean;
  error: string | null;
}

export interface BinsActions {
  fetchBins: () => Promise<void>;
  createBin: (name: string, description?: string, isPrivate?: boolean) => Promise<void>;
  updateBin: (id: string, updates: Partial<Bin>) => Promise<void>;
  deleteBin: (id: string) => Promise<void>;
  toggleBinPrivacy: (id: string) => Promise<void>;
  togglePrivacy: (id: string) => Promise<void>; // Alias for toggleBinPrivacy
  inviteCollaborator: (binId: string, email: string) => Promise<void>;
}

const mockBins: Bin[] = [
  {
    id: '1',
    name: 'Personal Thoughts',
    description: 'My personal collection of thoughts and ideas',
    isPrivate: true,
    isCollaborative: false,
    thoughtmarkCount: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Work Ideas',
    description: 'Ideas and concepts for work projects',
    isPrivate: false,
    isCollaborative: true,
    thoughtmarkCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    collaborators: ['colleague@example.com'],
  },
  {
    id: '3',
    name: 'Learning Notes',
    description: 'Notes from courses and tutorials',
    isPrivate: false,
    isCollaborative: false,
    thoughtmarkCount: 23,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useBins = (): BinsState & BinsActions => {
  const [state, setState] = useState<BinsState>({
    bins: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    loadBinsFromStorage();
  }, []);

  const loadBinsFromStorage = async () => {
    try {
      const binsData = await AsyncStorage.getItem('bins');
      if (binsData) {
        const bins = JSON.parse(binsData) as Bin[];
        setState(prev => ({
          ...prev,
          bins,
          isLoading: false,
        }));
      } else {
        // Initialize with mock data
        await AsyncStorage.setItem('bins', JSON.stringify(mockBins));
        setState(prev => ({
          ...prev,
          bins: mockBins,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load bins',
        isLoading: false,
      }));
    }
  };

  const fetchBins = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
      await loadBinsFromStorage();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch bins',
        isLoading: false,
      }));
    }
  }, []);

  const createBin = useCallback(async (name: string, description?: string, isPrivate = false) => {
    try {
      const newBin: Bin = {
        id: Date.now().toString(),
        name,
        description,
        isPrivate,
        isCollaborative: false,
        thoughtmarkCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedBins = [...state.bins, newBin];
      await AsyncStorage.setItem('bins', JSON.stringify(updatedBins));
      
      setState(prev => ({
        ...prev,
        bins: updatedBins,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create bin',
      }));
    }
  }, [state.bins]);

  const updateBin = useCallback(async (id: string, updates: Partial<Bin>) => {
    try {
      const updatedBins = state.bins.map(bin =>
        bin.id === id
          ? { ...bin, ...updates, updatedAt: new Date().toISOString() }
          : bin
      );
      
      await AsyncStorage.setItem('bins', JSON.stringify(updatedBins));
      
      setState(prev => ({
        ...prev,
        bins: updatedBins,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update bin',
      }));
    }
  }, [state.bins]);

  const deleteBin = useCallback(async (id: string) => {
    try {
      const updatedBins = state.bins.filter(bin => bin.id !== id);
      await AsyncStorage.setItem('bins', JSON.stringify(updatedBins));
      
      setState(prev => ({
        ...prev,
        bins: updatedBins,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to delete bin',
      }));
    }
  }, [state.bins]);

  const toggleBinPrivacy = useCallback(async (id: string) => {
    try {
      const updatedBins = state.bins.map(bin =>
        bin.id === id
          ? { ...bin, isPrivate: !bin.isPrivate, updatedAt: new Date().toISOString() }
          : bin
      );
      
      await AsyncStorage.setItem('bins', JSON.stringify(updatedBins));
      
      setState(prev => ({
        ...prev,
        bins: updatedBins,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to toggle bin privacy',
      }));
    }
  }, [state.bins]);

  const togglePrivacy = useCallback(async (id: string) => {
    // Alias for toggleBinPrivacy
    return toggleBinPrivacy(id);
  }, [toggleBinPrivacy]);

  const inviteCollaborator = useCallback(async (binId: string, email: string) => {
    try {
      const updatedBins = state.bins.map(bin =>
        bin.id === binId
          ? {
              ...bin,
              isCollaborative: true,
              collaborators: [...(bin.collaborators || []), email],
              updatedAt: new Date().toISOString(),
            }
          : bin
      );
      
      await AsyncStorage.setItem('bins', JSON.stringify(updatedBins));
      
      setState(prev => ({
        ...prev,
        bins: updatedBins,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to invite collaborator',
      }));
    }
  }, [state.bins]);

  return {
    ...state,
    fetchBins,
    createBin,
    updateBin,
    deleteBin,
    toggleBinPrivacy,
    togglePrivacy,
    inviteCollaborator,
  };
}; 