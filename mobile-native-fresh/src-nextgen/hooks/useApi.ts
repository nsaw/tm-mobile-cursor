import { useState, useCallback, useRef } from 'react';

import { ApiResponse, ApiError, ApiRequestConfig } from '../types/ApiTypes';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseApiActions<T> {
  execute: (config?: Partial<ApiRequestConfig>) => Promise<ApiResponse<T> | null>;
  reset: () => void;
  setData: (data: T) => void;
  setError: (error: ApiError) => void;
}

export function useApi<T = any>(
  defaultConfig: ApiRequestConfig,
  options: UseApiOptions<T> = {}
): [UseApiState<T>, UseApiActions<T>] {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const retryCountRef = useRef(0);
  const { retryCount = 3, retryDelay = 1000 } = options;

  const execute = useCallback(
    async (config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T> | null> => {
      const finalConfig = { ...defaultConfig, ...config };

      setState(prev => ({ ...prev, loading: true, error: null, isError: false }));

      try {
        // Simulate API call - replace with actual API client
        const response = await fetch(finalConfig.url, {
          method: finalConfig.method,
          headers: finalConfig.headers,
          body: finalConfig.data ? JSON.stringify(finalConfig.data) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }

        const apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          message: 'Success',
          success: true,
          timestamp: new Date().toISOString(),
        };

        setState({
          data,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
        });

        options.onSuccess?.(data);
        return apiResponse;
      } catch (error) {
        const apiError: ApiError = {
          code: 'API_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };

        setState(prev => ({
          ...prev,
          loading: false,
          error: apiError,
          isSuccess: false,
          isError: true,
        }));

        options.onError?.(apiError);

        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;
          setTimeout(() => execute(config), retryDelay);
        }

        return null;
      } finally {
        options.onFinally?.();
      }
    },
    [defaultConfig, options, retryCount, retryDelay]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
    retryCountRef.current = 0;
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, isSuccess: true, isError: false }));
  }, []);

  const setError = useCallback((error: ApiError) => {
    setState(prev => ({ ...prev, error, isSuccess: false, isError: true }));
  }, []);

  return [state, { execute, reset, setData, setError }];
} 