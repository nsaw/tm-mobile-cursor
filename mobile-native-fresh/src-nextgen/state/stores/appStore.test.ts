import { renderHook, act } from '@testing-library/react-native';
import { useAppStore } from './appStore';

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
      useAppStore.getState().resetApp();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAppStore());
    
    expect(result.current.currentEnvironment).toBe('legacy');
    expect(result.current.isFirstLaunch).toBe(true);
    expect(result.current.onboardingCompleted).toBe(false);
    expect(result.current.theme).toBe('system');
    expect(result.current.notifications).toBe(true);
    expect(result.current.analytics).toBe(true);
  });

  it('should set environment', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setEnvironment('nextgen');
    });
    
    expect(result.current.currentEnvironment).toBe('nextgen');
  });

  it('should set first launch', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setFirstLaunch(false);
    });
    
    expect(result.current.isFirstLaunch).toBe(false);
  });

  it('should set onboarding completed', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setOnboardingCompleted(true);
    });
    
    expect(result.current.onboardingCompleted).toBe(true);
  });

  it('should set theme', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
  });

  it('should set notifications', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setNotifications(false);
    });
    
    expect(result.current.notifications).toBe(false);
  });

  it('should set analytics', () => {
    const { result } = renderHook(() => useAppStore());
    
    act(() => {
      result.current.setAnalytics(false);
    });
    
    expect(result.current.analytics).toBe(false);
  });

  it('should reset app', () => {
    const { result } = renderHook(() => useAppStore());
    
    // Change some values
    act(() => {
      result.current.setEnvironment('nextgen');
      result.current.setFirstLaunch(false);
      result.current.setOnboardingCompleted(true);
      result.current.setTheme('dark');
      result.current.setNotifications(false);
      result.current.setAnalytics(false);
    });
    
    // Reset
    act(() => {
      result.current.resetApp();
    });
    
    expect(result.current.currentEnvironment).toBe('legacy');
    expect(result.current.isFirstLaunch).toBe(true);
    expect(result.current.onboardingCompleted).toBe(false);
    expect(result.current.theme).toBe('system');
    expect(result.current.notifications).toBe(true);
    expect(result.current.analytics).toBe(true);
  });
}); 