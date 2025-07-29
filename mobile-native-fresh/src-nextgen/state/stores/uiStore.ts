import { create } from 'zustand';

import { UIState } from '../types';

export interface UIStore extends UIState {
  // Actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  showModal: (type: string, data?: any) => void;
  hideModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSearchActive: (isActive: boolean) => void;
  setSearchResults: (results: any[]) => void;
  clearSearch: () => void;
  clearError: () => void;
}

export const useUIStore = create<UIStore>((set, _get) => ({
  // Initial state
  isLoading: false,
  error: null,
  modal: {
    isVisible: false,
    type: null,
    data: null,
  },
  sidebar: {
    isOpen: false,
  },
  search: {
    query: '',
    isActive: false,
    results: [],
  },

  // Actions
  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error }),

  showModal: (type, data) =>
    set({
      modal: {
        isVisible: true,
        type,
        data: data || null,
      },
    }),

  hideModal: () =>
    set({
      modal: {
        isVisible: false,
        type: null,
        data: null,
      },
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebar: {
        isOpen: !state.sidebar.isOpen,
      },
    })),

  setSidebarOpen: (isOpen) =>
    set({
      sidebar: {
        isOpen,
      },
    }),

  setSearchQuery: (query) =>
    set((state) => ({
      search: {
        ...state.search,
        query,
      },
    })),

  setSearchActive: (isActive) =>
    set((state) => ({
      search: {
        ...state.search,
        isActive,
      },
    })),

  setSearchResults: (results) =>
    set((state) => ({
      search: {
        ...state.search,
        results,
      },
    })),

  clearSearch: () =>
    set({
      search: {
        query: '',
        isActive: false,
        results: [],
      },
    }),

  clearError: () =>
    set({ error: null }),
})); 