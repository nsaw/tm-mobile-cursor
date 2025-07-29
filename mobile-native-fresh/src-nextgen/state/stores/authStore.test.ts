import { renderHook, act } from '@testing-library/react-native';

import { User } from '../types';

import { useAuthStore } from './authStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  isPremium: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('AuthStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should set user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set token', () => {
    const { result } = renderHook(() => useAuthStore());
    const token = 'test-token';
    
    act(() => {
      result.current.setToken(token);
    });
    
    expect(result.current.token).toBe(token);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useAuthStore());
    const error = 'Test error';
    
    act(() => {
      result.current.setError(error);
    });
    
    expect(result.current.error).toBe(error);
  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());
    const token = 'test-token';
    
    act(() => {
      result.current.login(mockUser, token);
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(token);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // First login
    act(() => {
      result.current.login(mockUser, 'test-token');
    });
    
    // Then logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setError('Test error');
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('should update user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setUser(mockUser);
      result.current.updateUser({ name: 'Updated Name' });
    });
    
    expect(result.current.user?.name).toBe('Updated Name');
    expect(result.current.user?.email).toBe(mockUser.email);
  });
}); 