import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEnvironment } from './useEnvironment';

// Mock AsyncStorage
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock PerformanceMonitor
const mockPerformanceMonitor = {
  getInstance: jest.fn(() => ({
    recordComponentMetrics: jest.fn(),
    recordPerformanceMark: jest.fn(),
    recordPerformanceMeasure: jest.fn(),
    getMetrics: jest.fn(() => ({})),
    clearMetrics: jest.fn(),
    isEnabled: jest.fn(() => true),
    enable: jest.fn(),
    disable: jest.fn(),
  })),
};

jest.mock('../utils/PerformanceMonitor', () => ({
  PerformanceMonitor: mockPerformanceMonitor,
}));

describe('useEnvironment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    
    mockPerformanceMonitor.getInstance.mockReturnValue({
      recordComponentMetrics: jest.fn(),
    } as any);
  });

  it('should initialize with legacy environment', () => {
    const { result } = renderHook(() => useEnvironment());
    
    expect(result.current.environment).toBe('legacy');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load environment from storage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('nextgen');
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await result.current.loadEnvironment();
    });
    
    expect(result.current.environment).toBe('nextgen');
  });

  it('should toggle environment successfully', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await result.current.toggleEnvironment();
    });
    
    expect(result.current.environment).toBe('nextgen');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('environment', 'nextgen');
  });

  it('should handle validation failure', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    // Mock validation failure
    result.current.validateEnvironment = jest.fn().mockResolvedValue({
      isValid: false,
      errors: ['Validation failed'],
    });
    
    await act(async () => {
      await result.current.toggleEnvironment();
    });
    
    expect(result.current.error).toBe('Validation failed');
  });

  it('should handle storage errors', async () => {
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await result.current.toggleEnvironment();
    });
    
    expect(result.current.error).toBe('Storage error');
  });

  it('should reset environment to default', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await result.current.resetEnvironment();
    });
    
    expect(result.current.environment).toBe('legacy');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('environment', 'legacy');
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => useEnvironment());
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should handle timeout during toggle', async () => {
    mockAsyncStorage.setItem.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('timeout')), 5000)
      )
    );
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await result.current.toggleEnvironment();
    });
    
    expect(result.current.error).toBe('timeout');
  }, 10000);
}); 