import { renderHook, act } from '@testing-library/react-native';
import { useEnvironment } from './useEnvironment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerformanceMonitor } from '../utils/PerformanceMonitor';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../utils/PerformanceMonitor');

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockPerformanceMonitor = PerformanceMonitor as jest.MockedClass<typeof PerformanceMonitor>;

describe('useEnvironment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsyncStorage.getItem.mockResolvedValue('legacy');
    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.removeItem.mockResolvedValue();
    
    mockPerformanceMonitor.getInstance.mockReturnValue({
      recordComponentMetrics: jest.fn(),
    } as any);
  });

  it('should initialize with legacy environment', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    expect(result.current.current).toBe('legacy');
    expect(result.current.isLoading).toBe(true);
    
    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load environment from storage', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('nextgen');
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    expect(result.current.current).toBe('nextgen');
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@thoughtmarks_environment');
  });

  it('should toggle environment successfully', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    expect(result.current.current).toBe('legacy');
    
    await act(async () => {
      const toggleResult = await result.current.toggleEnvironment();
      expect(toggleResult.success).toBe(true);
      expect(toggleResult.previousEnvironment).toBe('legacy');
      expect(toggleResult.newEnvironment).toBe('nextgen');
    });
    
    expect(result.current.current).toBe('nextgen');
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('@thoughtmarks_environment', 'nextgen');
  });

  it('should handle storage errors', async () => {
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    await act(async () => {
      const toggleResult = await result.current.toggleEnvironment();
      expect(toggleResult.success).toBe(false);
      expect(toggleResult.error).toContain('Storage error');
    });
  });

  it('should reset environment to default', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    await act(async () => {
      await result.current.resetEnvironment();
    });
    
    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('@thoughtmarks_environment');
  });

  it('should clear errors', async () => {
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    // Simulate an error
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should handle timeout during toggle', async () => {
    // Mock a slow storage operation
    mockAsyncStorage.setItem.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 6000))
    );
    
    const { result } = renderHook(() => useEnvironment());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(() => resolve(undefined), 0));
    });
    
    await act(async () => {
      const toggleResult = await result.current.toggleEnvironment();
      expect(toggleResult.success).toBe(false);
      expect(toggleResult.error).toContain('timeout');
    });
  });
}); 