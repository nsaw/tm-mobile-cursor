import { useState, useCallback } from 'react';

interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateThoughtmarkData {
  title?: string;
  content?: string;
}

export const useThoughtmark = (): {
  thoughtmark: Thoughtmark | null;
  fetchThoughtmark: (id: string) => Promise<void>;
  updateThoughtmark: (id: string, data: UpdateThoughtmarkData) => Promise<void>;
  deleteThoughtmark: (id: string) => Promise<void>;
  shareThoughtmark: (id: string) => Promise<void>;
} => {
  const [thoughtmark, setThoughtmark] = useState<Thoughtmark | null>(null);

  const fetchThoughtmark = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/thoughtmarks/${id}`);
      const data = await response.json();
      setThoughtmark(data);
    } catch (err) {
      console.error('Failed to fetch thoughtmark', err);
      setThoughtmark(null);
    }
  }, []);

  const updateThoughtmark = useCallback(async (id: string, data: UpdateThoughtmarkData) => {
    try {
      const response = await fetch(`/api/thoughtmarks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const updatedThoughtmark = await response.json();
      setThoughtmark(updatedThoughtmark);
    } catch (err) {
      console.error('Failed to update thoughtmark', err);
    }
  }, []);

  const deleteThoughtmark = useCallback(async (id: string) => {
    try {
      await fetch(`/api/thoughtmarks/${id}`, {
        method: 'DELETE',
      });
      setThoughtmark(null);
    } catch (err) {
      console.error('Failed to delete thoughtmark', err);
    }
  }, []);

  const shareThoughtmark = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/thoughtmarks/${id}/share`, {
        method: 'POST',
      });
      const shareData = await response.json();
      console.log('Share data:', shareData);
      // This would integrate with device sharing
    } catch (err) {
      console.error('Failed to share thoughtmark', err);
    }
  }, []);

  return {
    thoughtmark,
    fetchThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    shareThoughtmark,
  };
}; 