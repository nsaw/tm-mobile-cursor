import { renderHook, act } from '@testing-library/react-native';
import useAppStore from './appStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AppStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    act(() => {
      useAppStore.getState().initialize();
    });
  });

  it('should have initial state', () => {
    // Reset store to initial state
    act(() => {
      useAppStore.setState({
        isInitialized: false,
        version: '1.0.0',
        buildNumber: '1',
        lastUpdated: new Date(),
      });
    });
    
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.version).toBe('1.0.0');
    expect(result.current.buildNumber).toBe('1');
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it('should initialize app', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.initialize();
    });
    
    expect(result.current.isInitialized).toBe(true);
  });

  it('should update version', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.updateVersion('2.0.0');
    });
    
    expect(result.current.version).toBe('2.0.0');
  });

  it('should set last updated', () => {
    const { result } = renderHook(() => useAppStore());
    const newDate = new Date('2024-01-01');
    
    act(() => {
      result.current.setLastUpdated(newDate);
    });
    
    expect(result.current.lastUpdated).toEqual(newDate);
  });
}); 