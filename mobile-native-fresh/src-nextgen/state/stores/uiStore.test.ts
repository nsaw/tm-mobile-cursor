import { renderHook, act } from '@testing-library/react-native';
import { useUIStore } from './uiStore';

describe('UIStore', () => {
  beforeEach(() => {
    // Clear store state before each test
    act(() => {
      useUIStore.getState().clearError();
      useUIStore.getState().hideModal();
      useUIStore.getState().setSidebarOpen(false);
      useUIStore.getState().clearSearch();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.modal.isVisible).toBe(false);
    expect(result.current.modal.type).toBeNull();
    expect(result.current.modal.data).toBeNull();
    expect(result.current.sidebar.isOpen).toBe(false);
    expect(result.current.search.query).toBe('');
    expect(result.current.search.isActive).toBe(false);
    expect(result.current.search.results).toEqual([]);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setLoading(true);
    });
    
    expect(result.current.isLoading).toBe(true);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useUIStore());
    const error = 'Test error';
    
    act(() => {
      result.current.setError(error);
    });
    
    expect(result.current.error).toBe(error);
  });

  it('should show modal', () => {
    const { result } = renderHook(() => useUIStore());
    const modalData = { test: 'data' };
    
    act(() => {
      result.current.showModal('test-modal', modalData);
    });
    
    expect(result.current.modal.isVisible).toBe(true);
    expect(result.current.modal.type).toBe('test-modal');
    expect(result.current.modal.data).toEqual(modalData);
  });

  it('should hide modal', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.showModal('test-modal');
      result.current.hideModal();
    });
    
    expect(result.current.modal.isVisible).toBe(false);
    expect(result.current.modal.type).toBeNull();
    expect(result.current.modal.data).toBeNull();
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebar.isOpen).toBe(true);
    
    act(() => {
      result.current.toggleSidebar();
    });
    
    expect(result.current.sidebar.isOpen).toBe(false);
  });

  it('should set sidebar open', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSidebarOpen(true);
    });
    
    expect(result.current.sidebar.isOpen).toBe(true);
  });

  it('should set search query', () => {
    const { result } = renderHook(() => useUIStore());
    const query = 'test query';
    
    act(() => {
      result.current.setSearchQuery(query);
    });
    
    expect(result.current.search.query).toBe(query);
  });

  it('should set search active', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSearchActive(true);
    });
    
    expect(result.current.search.isActive).toBe(true);
  });

  it('should set search results', () => {
    const { result } = renderHook(() => useUIStore());
    const results = [{ id: '1', title: 'Test' }];
    
    act(() => {
      result.current.setSearchResults(results);
    });
    
    expect(result.current.search.results).toEqual(results);
  });

  it('should clear search', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setSearchQuery('test');
      result.current.setSearchActive(true);
      result.current.setSearchResults([{ id: '1' }]);
      result.current.clearSearch();
    });
    
    expect(result.current.search.query).toBe('');
    expect(result.current.search.isActive).toBe(false);
    expect(result.current.search.results).toEqual([]);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useUIStore());
    
    act(() => {
      result.current.setError('Test error');
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });
}); 