import { useState, useEffect, useCallback } from 'react';
import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchSuggestion,
} from '../types/search';
import { searchService } from '../services/searchService';

export const useSearch = () => {
  const [query, setQuery] = useState<SearchQuery>({
    text: '',
    filters: {
      types: [],
      tags: [],
      bins: [],
    },
    sortBy: 'relevance',
    sortOrder: 'desc',
    limit: 20,
    offset: 0,
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

  const performSearch = useCallback(async (searchQuery: Partial<SearchQuery>) => {
    try {
      setLoading(true);
      setError(null);

      const updatedQuery = { ...query, ...searchQuery };
      const response = await searchService.search(updatedQuery);

      setResults(response.results);
      setSuggestions(response.suggestions);
      setTotal(response.total);
      setExecutionTime(response.executionTime);
      setQuery(updatedQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const searchText = useCallback(async (text: string) => {
    await performSearch({ text, offset: 0 });
  }, [performSearch]);

  const loadMore = useCallback(async () => {
    if (results.length < total) {
      await performSearch({ offset: results.length });
    }
  }, [performSearch, results.length, total]);

  const clearSearch = useCallback(() => {
    setQuery(prev => ({ ...prev, text: '', offset: 0 }));
    setResults([]);
    setSuggestions([]);
    setTotal(0);
    setExecutionTime(0);
  }, []);

  const updateFilters = useCallback(async (filters: any) => {
    await performSearch({ filters, offset: 0 });
  }, [performSearch]);

  const updateSort = useCallback(async (sortBy: string, sortOrder: string) => {
    await performSearch({ sortBy: sortBy as any, sortOrder: sortOrder as any, offset: 0 });
  }, [performSearch]);

  return {
    query,
    results,
    suggestions,
    loading,
    error,
    total,
    executionTime,
    searchText,
    loadMore,
    clearSearch,
    updateFilters,
    updateSort,
  };
};
