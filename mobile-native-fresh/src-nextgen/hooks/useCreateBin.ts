import { useState, useCallback } from 'react';

interface CreateBinData {
  name: string;
  description: string;
  isPublic: boolean;
  allowCollaboration: boolean;
}

export const useCreateBin = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createBin = useCallback(async (data: CreateBinData) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/bins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create bin');
      }
      
      const result = await response.json();
      console.log('Bin created successfully:', result);
      
      // Reset form or navigate away
      return result;
    } catch (err) {
      console.error('Failed to create bin', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    createBin,
    isCreating,
  };
}; 