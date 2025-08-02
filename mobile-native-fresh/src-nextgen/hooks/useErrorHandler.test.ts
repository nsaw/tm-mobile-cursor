import { renderHook, act } from '@testing-library/react-native';
import { useErrorHandler } from './useErrorHandler';

// Mock the dependencies
jest.mock('../utils/errorReporting', () => ({
  reportError: jest.fn(),
}));

jest.mock('../state/stores/uiStore', () => ({
  useUIStore: () => ({
    setError: jest.fn(),
  }),
}));

import { reportError } from '../utils/errorReporting';
import { useUIStore } from '../state/stores/uiStore';

const mockReportError = reportError as jest.MockedFunction<typeof reportError>;
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>;

describe('useErrorHandler', () => {
  let mockSetError: jest.Mock;

  beforeEach(() => {
    mockSetError = jest.fn();
    mockUseUIStore.mockReturnValue({
      setError: mockSetError,
    } as ReturnType<typeof useUIStore>);
    mockReportError.mockClear();
  });

  it('should handle errors with default options', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockSetError).toHaveBeenCalledWith('Test error');
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
  });

  it('should handle errors with custom options', () => {
    const customOnError = jest.fn();
    const { result } = renderHook(() =>
      useErrorHandler({
        showError: false,
        reportToService: false,
        onError: customOnError,
      })
    );
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(customOnError).toHaveBeenCalledWith(error);
    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it('should include additional data when provided', () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Test error');
    const additionalData = { context: 'test', userId: '123' };

    act(() => {
      result.current.handleError(error, additionalData);
    });

    expect(mockReportError).toHaveBeenCalledWith(error, additionalData);
  });

  it('should not show error when showError is false', () => {
    const { result } = renderHook(() =>
      useErrorHandler({ showError: false })
    );
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
  });

  it('should not report to service when reportToService is false', () => {
    const { result } = renderHook(() =>
      useErrorHandler({ reportToService: false })
    );
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(mockSetError).toHaveBeenCalledWith('Test error');
    expect(mockReportError).not.toHaveBeenCalled();
  });

  it('should call custom error handler when provided', () => {
    const customOnError = jest.fn();
    const { result } = renderHook(() =>
      useErrorHandler({ onError: customOnError })
    );
    const error = new Error('Test error');

    act(() => {
      result.current.handleError(error);
    });

    expect(customOnError).toHaveBeenCalledWith(error);
    expect(mockSetError).toHaveBeenCalledWith('Test error');
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
  });

  it('should handle async errors', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Async error');

    await act(async () => {
      await result.current.handleAsyncError(async () => {
        throw error;
      });
    });

    expect(mockSetError).toHaveBeenCalledWith('Async error');
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
  });

  it('should handle async errors with custom options', async () => {
    const customOnError = jest.fn();
    const { result } = renderHook(() =>
      useErrorHandler({ onError: customOnError })
    );
    const error = new Error('Async error');

    await act(async () => {
      await result.current.handleAsyncError(async () => {
        throw error;
      });
    });

    expect(customOnError).toHaveBeenCalledWith(error);
    expect(mockSetError).toHaveBeenCalledWith('Async error');
    expect(mockReportError).toHaveBeenCalledWith(error, undefined);
  });

  it('should handle async errors with additional data', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const error = new Error('Async error');
    const additionalData = { operation: 'test' };

    await act(async () => {
      await result.current.handleAsyncError(
        async () => {
          throw error;
        },
        additionalData
      );
    });

    expect(mockReportError).toHaveBeenCalledWith(error, additionalData);
  });

  it('should return success result when async operation succeeds', async () => {
    const { result } = renderHook(() => useErrorHandler());

    const asyncResult = await act(async () => {
      return await result.current.handleAsyncError(async () => {
        return 'success';
      });
    });

    expect(asyncResult).toBe('success');
    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockReportError).not.toHaveBeenCalled();
  });
}); 