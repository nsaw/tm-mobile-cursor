import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { SecurityManager } from '../utils/SecurityManager';
import { ValidationSystem } from '../utils/ValidationSystem';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';

interface Bin {
  id: number;
  name: string;
  owner: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  collaboratorCount: number;
  thoughtmarkCount: number;
}

interface BinsResponse {
  items: Bin[];
  total: number;
  page: number;
  limit: number;
}

interface UseBinsReturn {
  bins: Bin[];
  fetchBins: () => Promise<void>;
  togglePrivacy: (binId: number) => Promise<void>;
  inviteCollaborator: (binId: number) => Promise<void>;
  filter: string;
  setFilter: (filter: string) => void;
  isLoading: boolean;
  error: string | null;
  cleanup: () => void;
  refresh: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.thoughtmarks.app';
const DEFAULT_LIMIT = 20;

export const useBins = (): UseBinsReturn => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Validate API response
  const validateBinsResponse = useCallback((data: any): data is BinsResponse => {
    try {
      if (!data || typeof data !== 'object') {
        return false;
      }

      if (!Array.isArray(data.items)) {
        return false;
      }

      // Validate each bin item
      for (const bin of data.items) {
        if (!validationSystem.validateBinResponse(bin)) {
          console.warn('Invalid bin item detected:', bin);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Response validation failed:', error);
      return false;
    }
  }, [validationSystem]);

  // Fetch bins with error handling and security validation
  const fetchBins = useCallback(async (page = 1, append = false) => {
    try {
      // Cancel any ongoing request
      cleanup();

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      // Validate user permissions
      const hasPermission = await securityManager.validateUserPermissions('bins:read');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to view bins');
      }

      // Validate search query
      if (filter && !validationSystem.validateSearchQuery(filter)) {
        throw new Error('Invalid search query provided');
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: DEFAULT_LIMIT.toString(),
      });

      if (filter.trim()) {
        params.append('q', filter.trim());
      }

      // Get auth token
      const authToken = await securityManager.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Record performance start
      const startTime = performance.now();

      // Make API request
      const response = await fetch(`${API_BASE_URL}/api/bins?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        signal: abortControllerRef.current.signal,
      });

      // Record API call performance
      performanceMonitor.recordApiCall('fetchBins', performance.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to view bins.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(`Failed to fetch bins: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Validate response
      if (!validateBinsResponse(data)) {
        throw new Error('Invalid response format received from server');
      }

      // Update state
      if (append) {
        setBins(prevBins => [...prevBins, ...data.items]);
      } else {
        setBins(data.items);
      }

      setCurrentPage(page);
      setHasMore(data.items.length === DEFAULT_LIMIT);

      // Record successful fetch
      performanceMonitor.recordUserAction('bins_fetch_success', {
        count: data.items.length,
        page,
        hasFilter: !!filter,
      });

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request was cancelled, don't show error
          return;
        }
        
        console.error('Failed to fetch bins:', error);
        setError(error.message);
        
        // Record error
        performanceMonitor.recordError('useBins', error);
        
        // Show user-friendly error message
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [filter, cleanup, securityManager, validationSystem, performanceMonitor, validateBinsResponse]);

  // Toggle bin privacy with security validation
  const togglePrivacy = useCallback(async (binId: number) => {
    try {
      // Validate bin ID
      if (!validationSystem.validateBinId(binId)) {
        throw new Error('Invalid bin ID provided');
      }

      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('bins:update');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to update bin privacy');
      }

      // Get auth token
      const authToken = await securityManager.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Record performance start
      const startTime = performance.now();

      // Make API request
      const response = await fetch(`${API_BASE_URL}/api/bins/${binId}/togglePrivacy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
      });

      // Record API call performance
      performanceMonitor.recordApiCall('toggleBinPrivacy', performance.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to update this bin.');
        } else if (response.status === 404) {
          throw new Error('Bin not found.');
        } else {
          throw new Error(`Failed to update bin privacy: ${response.status} ${response.statusText}`);
        }
      }

      // Update local state
      setBins(prevBins => 
        prevBins.map(bin => 
          bin.id === binId 
            ? { ...bin, isPublic: !bin.isPublic }
            : bin
        )
      );

      // Record successful toggle
      performanceMonitor.recordUserAction('bin_privacy_toggle_success', { binId });

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to toggle bin privacy:', error);
        performanceMonitor.recordError('useBins', error);
        throw error;
      }
    }
  }, [securityManager, validationSystem, performanceMonitor]);

  // Invite collaborator with security validation
  const inviteCollaborator = useCallback(async (binId: number) => {
    try {
      // Validate bin ID
      if (!validationSystem.validateBinId(binId)) {
        throw new Error('Invalid bin ID provided');
      }

      // Check permissions
      const hasPermission = await securityManager.validateUserPermissions('bins:invite');
      if (!hasPermission) {
        throw new Error('Insufficient permissions to invite collaborators');
      }

      // Get auth token
      const authToken = await securityManager.getAuthToken();
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Record performance start
      const startTime = performance.now();

      // Make API request
      const response = await fetch(`${API_BASE_URL}/api/bins/${binId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
        },
        body: JSON.stringify({
          // In a real implementation, this would include user email/ID
          message: 'You have been invited to collaborate on this bin',
        }),
      });

      // Record API call performance
      performanceMonitor.recordApiCall('inviteCollaborator', performance.now() - startTime);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. You do not have permission to invite collaborators.');
        } else if (response.status === 404) {
          throw new Error('Bin not found.');
        } else {
          throw new Error(`Failed to invite collaborator: ${response.status} ${response.statusText}`);
        }
      }

      // Update local state to reflect new collaborator count
      setBins(prevBins => 
        prevBins.map(bin => 
          bin.id === binId 
            ? { ...bin, collaboratorCount: bin.collaboratorCount + 1 }
            : bin
        )
      );

      // Record successful invitation
      performanceMonitor.recordUserAction('bin_invite_collaborator_success', { binId });

    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to invite collaborator:', error);
        performanceMonitor.recordError('useBins', error);
        throw error;
      }
    }
  }, [securityManager, validationSystem, performanceMonitor]);

  // Refresh bins
  const refresh = useCallback(async () => {
    await fetchBins(1, false);
  }, [fetchBins]);

  // Load more bins
  const loadMore = useCallback(async () => {
    if (!isLoading && hasMore) {
      await fetchBins(currentPage + 1, true);
    }
  }, [isLoading, hasMore, currentPage, fetchBins]);

  // Initial fetch on mount
  useEffect(() => {
    fetchBins(1, false);
  }, [fetchBins]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    bins,
    fetchBins,
    togglePrivacy,
    inviteCollaborator,
    filter,
    setFilter,
    isLoading,
    error,
    cleanup,
    refresh,
    hasMore,
    loadMore,
  };
}; 