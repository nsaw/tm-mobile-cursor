import { useState, useCallback } from 'react';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchThoughtmarks = useCallback((query: string) => {
    // TODO: Implement actual search logic
    // For now, return empty results
    setSearchResults([]);
  }, []);

  return [searchResults, searchThoughtmarks] as const;
}; 