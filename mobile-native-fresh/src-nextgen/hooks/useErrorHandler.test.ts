import { renderHook, act } from '@testing-library/react-native';

import { useErrorHandler } from './useErrorHandler';

// Mock error reporting
jest.mock('../utils/errorReporting', () => ({
  reportError: jest.fn(),
}));

// Mock UI store
jest.mock('../state/stores/uiStore', () => ({
  useUIStore: () => ({
    setError: jest.fn(),
  }),
}));

const mockReportError = require('../utils/errorReporting').reportError;
const mockSetError = jest.fn();

jest.mock('../state/stores/uiStore', () => ({
  useUIStore: () => ({
    setError: mockSetError,
  }),
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle error with default options', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
    expect(mockSetError).toHaveBeenCalledWith('Test error');
  });

  it('should handle error with custom options', () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useErrorHandler({
        showError: false,
        reportToService: false,
        onError,
      })
    );
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(onError).toHaveBeenCalledWith(error);
    expect(mockReportError).not.toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it('should handle error with additional data', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    const additionalData = { test: 'data' };

    act(() => {
      result.current.handleError(error, additionalData);
    });

    expect(mockReportError).toHaveBeenCalledWith(error, additionalData);
    expect(mockSetError).toHaveBeenCalledWith('Test error');
  });

  it('should handle async error successfully', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const asyncFn = jest.fn().mockResolvedValue('success');

    const response = await act(async () => {
      return await result.current.handleAsyncError(asyncFn);
    });

    expect(response).toBe('success');
    expect(asyncFn).toHaveBeenCalled();
    expect(mockReportError).not.toHaveBeenCalled();
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it('should handle async error with failure', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Async error');
    const asyncFn = jest.fn().mockRejectedValue(error);

    const response = await act(async () => {
      return await result.current.handleAsyncError(asyncFn);
    });

    expect(response).toBeNull();
    expect(asyncFn).toHaveBeenCalled();
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
    expect(mockSetError).toHaveBeenCalledWith('Async error');
  });

  it('should handle non-Error objects in async function', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const asyncFn = jest.fn().mockRejectedValue('String error');

    const response = await act(async () => {
      return await result.current.handleAsyncError(asyncFn);
    });

    expect(response).toBeNull();
    expect(mockReportError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'String error',
      }),
      undefined
    );
    expect(mockSetError).toHaveBeenCalledWith('String error');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.clearError();
    });

    expect(mockSetError).toHaveBeenCalledWith(null);
  });
}); 