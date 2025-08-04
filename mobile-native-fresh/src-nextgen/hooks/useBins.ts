import { useState, useEffect, useCallback } from 'react';

export interface Bin {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  thoughtmarkCount: number;
}

export interface UseBinsReturn {
  bins: Bin[];
  loading: boolean;
  error: string | null;
  fetchBins: () => Promise<void>;
  addBin: (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBin: (id: string, updates: Partial<Bin>) => Promise<void>;
  deleteBin: (id: string) => Promise<void>;
  togglePrivacy: (id: string) => Promise<void>;
  inviteCollaborator: (binId: string, email: string) => Promise<void>;
}

export const useBins = (): UseBinsReturn => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call for now
      const mockBins: Bin[] = [
        {
          id: '1',
          name: 'Sample Bin',
          description: 'This is a sample bin for testing purposes.',
          isPrivate: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          thoughtmarkCount: 5,
        },
      ];
      setBins(mockBins);
    } catch (err) {
      setError('Failed to fetch bins');
      console.error('Error fetching bins:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBin = useCallback(async (binData: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBin: Bin = {
        ...binData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setBins(prev => [...prev, newBin]);
    } catch (err) {
      setError('Failed to add bin');
      console.error('Error adding bin:', err);
    }
  }, []);

  const updateBin = useCallback(async (id: string, updates: Partial<Bin>) => {
    try {
      setBins(prev => prev.map(bin => 
        bin.id === id 
          ? { ...bin, ...updates, updatedAt: new Date().toISOString() }
          : bin
      ));
    } catch (err) {
      setError('Failed to update bin');
      console.error('Error updating bin:', err);
    }
  }, []);

  const deleteBin = useCallback(async (id: string) => {
    try {
      setBins(prev => prev.filter(bin => bin.id !== id));
    } catch (err) {
      setError('Failed to delete bin');
      console.error('Error deleting bin:', err);
    }
  }, []);

  const togglePrivacy = useCallback(async (id: string) => {
    try {
      setBins(prev => prev.map(bin => 
        bin.id === id 
          ? { ...bin, isPrivate: !bin.isPrivate, updatedAt: new Date().toISOString() }
          : bin
      ));
    } catch (err) {
      setError('Failed to toggle bin privacy');
      console.error('Error toggling bin privacy:', err);
    }
  }, []);

  const inviteCollaborator = useCallback(async (binId: string, email: string) => {
    try {
      // Mock collaborator invitation
      console.log(`Inviting ${email} to bin ${binId}`);
    } catch (err) {
      setError('Failed to invite collaborator');
      console.error('Error inviting collaborator:', err);
    }
  }, []);

  useEffect(() => {
    fetchBins();
  }, [fetchBins]);

  return {
    bins,
    loading,
    error,
    fetchBins,
    addBin,
    updateBin,
    deleteBin,
    togglePrivacy,
    inviteCollaborator,
  };
}; 