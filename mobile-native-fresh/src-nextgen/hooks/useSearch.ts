import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

export const useSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const queryServer = async (q: string) => {
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Search query failed', err);
    }
  };

  const handleQueryChange = useCallback(debounce(queryServer, 300), []);

  const handleVoiceSearch = () => {
    console.log('[Search] Voice search activated (stub)');
    // Future: integrate native module or web speech API fallback
  };

  return { suggestions, results, handleQueryChange, handleVoiceSearch };
}; 