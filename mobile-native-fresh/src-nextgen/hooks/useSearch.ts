import { useState, useCallback } from 'react';

export const useSearch = (): [
  Record<string, unknown>[],
  (query: string) => void
] => {
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);

  const searchThoughtmarks = useCallback((_query: string) => {
    // TODO: Implement actual search logic
    // For now, return empty results
    setSearchResults([]);
  }, []);

  return [searchResults, searchThoughtmarks];
}; 