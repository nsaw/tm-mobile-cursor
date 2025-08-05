import { useCallback } from 'react';
import { reportError } from '../utils/errorReporting';
import { useUIStore } from '../state/stores/uiStore';

export interface UseErrorHandlerOptions {
  showError?: boolean;
  reportToService?: boolean;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}): {
  handleError: (error: Error, additionalData?: Record<string, unknown>) => void;
  handleAsyncError: <T>(asyncFn: () => Promise<T>, additionalData?: Record<string, unknown>) => Promise<T | null>;
  clearError: () => void;
} => {
  const { setError } = useUIStore();
  const {
    showError = true,
    reportToService = true,
    onError,
  } = options;

  const handleError = useCallback(
    (error: Error, additionalData?: Record<string, unknown>) => {
      // Call custom error handler if provided
      onError?.(error);

      // Report to service if enabled
      if (reportToService) {
        reportError(error, additionalData);
      }

      // Show error in UI if enabled
      if (showError) {
        setError(error.message);
      }
    },
    [onError, reportToService, showError, setError]
  );

  const handleAsyncError = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      additionalData?: Record<string, unknown>
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        if (error instanceof Error) {
          handleError(error, additionalData);
        } else {
          handleError(new Error(String(error)), additionalData);
        }
        return null;
      }
    },
    [handleError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    handleError,
    handleAsyncError,
    clearError,
  };
}; 