import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import debounce from 'lodash.debounce';

import { SecurityManager } from '../utils/SecurityManager';
import { ValidationSystem } from '../utils/ValidationSystem';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';

interface SearchResult {
  id: string;
  label: string;
  type: 'thoughtmark' | 'bin' | 'user';
  description?: string;
  relevance: number;
  timestamp: string;
}

interface SearchSuggestion {
  id: string;
  label: string;
  type: 'recent' | 'popular' | 'suggestion';
}

interface SearchResponse {
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  total: number;
  query: string;
}

interface UseSearchReturn {
  suggestions: SearchSuggestion[];
  results: SearchResult[];
  handleQueryChange: (query: string) => Promise<void>;
  handleVoiceSearch: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearResults: () => void;
  searchHistory: SearchSuggestion[];
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.thoughtmarks.app';
const MAX_SEARCH_HISTORY = 10;
const DEBOUNCE_DELAY = 300;

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchSuggestion[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const securityManager = SecurityManager.getInstance();
  const validationSystem = ValidationSystem.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();

  // Cleanup function to cancel ongoing requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Validate search response
  const validateSearchResponse = useCallback((data: any): data is SearchResponse => {
    try {
      if (!data || typeof data !== 'object') {
        return false;
      }

      if (!Array.isArray(data.results) || !Array.isArray(data.suggestions)) {
        return false;
      }

      // Validate results
      for (const result of data.results) {
        if (!validationSystem.validateSearchResult(result)) {
          console.warn('Invalid search result detected:', result);
          return false;
        }
      }

      // Validate suggestions
      for (const suggestion of data.suggestions) {
        if (!validationSystem.validateSearchSuggestion(suggestion)) {
          console.warn('Invalid search suggestion detected:', suggestion);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Search response validation failed:', error);
      return false;
    }
  }, [validationSystem]);

  // Add to search history
  const addToHistory = useCallback((query: string) => {
    try {
      const newHistoryItem: SearchSuggestion = {
        id: `history-${Date.now()}`,
        label: query,
        type: 'recent',
      };

      setSearchHistory(prevHistory => {
        const filtered = prevHistory.filter(item => item.label !== query);
        const newHistory = [newHistoryItem, ...filtered];
        return newHistory.slice(0, MAX_SEARCH_HISTORY);
      });
    } catch (error) {
      console.error('Failed to add to search history:', error);
    }
  }, []);

  // Query server with comprehensive error handling
  const queryServer = useCallback(async (query: string) => {
    try {
      // Cancel any ongoing request
      cleanup();

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      // Validate query
      if (!validationSystem.validateSearchQuery(query)) {
        throw new Error('Invalid search query provided');
      }

      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('search:execute');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to perform search');
      }

      // Get auth token
      const authToken = await securityManager.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Record performance start
      const startTime = performance.now();

      // Build query parameters
      const params = new URLSearchParams({
        q: query.trim(),
        limit: '20',
        include_suggestions: 'true',
      });

      // Make API request
      const response = await fetch(`${API_BASE_URL}/api/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        signal: abortControllerRef.current.signal,
      });

      // Record API call performance
      performanceMonitor.recordApiCall('search', performance.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to search.');
        } else if (response.status === 429) {
          throw new Error('Too many search requests. Please try again later.');
        } else {
          throw new Error(`Search failed: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Validate response
      if (!validateSearchResponse(data)) {
        throw new Error('Invalid search response format received from server');
      }

      // Update state
      setResults(data.results);
      setSuggestions(data.suggestions);

      // Add to history if results found
      if (data.results.length > 0) {
        addToHistory(query);
      }

      // Record successful search
      performanceMonitor.recordUserAction('search_success', {
        query,
        resultCount: data.results.length,
        suggestionCount: data.suggestions.length,
      });

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request was cancelled, don't show error
          return;
        }
        
        console.error('Search query failed:', error);
        setError(error.message);
        
        // Record error
        performanceMonitor.recordError('useSearch', error);
        
        // Show user-friendly error message
        Alert.alert('Search Error', error.message);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [cleanup, validationSystem, securityManager, performanceMonitor, validateSearchResponse, addToHistory]);

  // Debounced query handler
  const debouncedQueryServer = useCallback(
    debounce(queryServer, DEBOUNCE_DELAY),
    [queryServer]
  );

  // Handle query change
  const handleQueryChange = useCallback(async (query: string) => {
    try {
      if (!query.trim()) {
        setResults([]);
        setSuggestions([]);
        setError(null);
        return;
      }

      await debouncedQueryServer(query);
    } catch (error) {
      console.error('Failed to handle query change:', error);
      performanceMonitor.recordError('useSearch', error as Error);
    }
  }, [debouncedQueryServer, performanceMonitor]);

  // Handle voice search
  const handleVoiceSearch = useCallback(async () => {
    try {
      // Check voice search permissions
      const hasPermission = await securityManager.validateUserPermissions('search:voice');
      if (!hasPermission) {
        throw new Error('Voice search permission not granted');
      }

      // Record voice search attempt
      performanceMonitor.recordUserAction('voice_search_attempt');

      // In a real implementation, this would integrate with native speech recognition
      // For now, we'll simulate voice search with a placeholder
      console.log('[Search] Voice search activated (stub)');
      
      // Simulate voice input (in real implementation, this would come from speech recognition)
      const simulatedVoiceInput = 'test search query';
      
      // Process voice input
      await handleQueryChange(simulatedVoiceInput);
      
      // Record successful voice search
      performanceMonitor.recordUserAction('voice_search_success', {
        input: simulatedVoiceInput,
      });

    } catch (error) {
      console.error('Voice search failed:', error);
      performanceMonitor.recordError('useSearch', error as Error);
      throw error;
    }
  }, [securityManager, performanceMonitor, handleQueryChange]);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    
    // Cancel any ongoing request
    cleanup();
  }, [cleanup]);

  // Load search history from storage
  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        // In a real implementation, this would load from AsyncStorage or similar
        const savedHistory = await securityManager.getSearchHistory();
        if (savedHistory && Array.isArray(savedHistory)) {
          setSearchHistory(savedHistory.slice(0, MAX_SEARCH_HISTORY));
        }
      } catch (error) {
        console.warn('Failed to load search history:', error);
      }
    };

    loadSearchHistory();
  }, [securityManager]);

  // Save search history to storage
  useEffect(() => {
    const saveSearchHistory = async () => {
      try {
        await securityManager.saveSearchHistory(searchHistory);
      } catch (error) {
        console.warn('Failed to save search history:', error);
      }
    };

    if (searchHistory.length > 0) {
      saveSearchHistory();
    }
  }, [searchHistory, securityManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    suggestions,
    results,
    handleQueryChange,
    handleVoiceSearch,
    isLoading,
    error,
    clearResults,
    searchHistory,
  };
}; 