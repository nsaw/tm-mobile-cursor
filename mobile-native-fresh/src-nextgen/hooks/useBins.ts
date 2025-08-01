import { useState, useEffect } from 'react';

export interface Bin {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useBins = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual bins fetching
    // For now, return empty array
    setLoading(false);
  }, []);

  const addBin = (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBin: Bin = {
      ...bin,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBins(prev => [...prev, newBin]);
  };

  const updateBin = (id: string, updates: Partial<Bin>) => {
    setBins(prev => 
      prev.map(bin => 
        bin.id === id 
          ? { ...bin, ...updates, updatedAt: new Date() }
          : bin
      )
    );
  };

  const deleteBin = (id: string) => {
    setBins(prev => prev.filter(bin => bin.id !== id));
  };

  return [bins, { addBin, updateBin, deleteBin, loading }] as const;
}; 