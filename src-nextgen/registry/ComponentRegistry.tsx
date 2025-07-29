import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import { ComponentRegistryState, ComponentRegistryAPI, ComponentRegistration, ComponentMetadata, ComponentRegistryConfig } from './types';

declare const console: any;

// Initial state
const initialState: ComponentRegistryState = {
  components: new Map(),
  categories: new Map(),
  cache: new Map(),
  config: {
    enableValidation: true,
    enableCaching: true,
    maxCacheSize: 100,
    enableLogging: false,
  },
};

// Action types
type ComponentRegistryAction =
  | { type: 'REGISTER_COMPONENT'; payload: { id: string; registration: ComponentRegistration } }
  | { type: 'UNREGISTER_COMPONENT'; payload: { id: string } }
  | { type: 'CLEAR_REGISTRY' }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ComponentRegistryConfig> };

// Reducer
function componentRegistryReducer(state: ComponentRegistryState, action: ComponentRegistryAction): ComponentRegistryState {
  switch (action.type) {
    case 'REGISTER_COMPONENT': {
      const { id, registration } = action.payload;
      const newComponents = new Map(state.components);
      newComponents.set(id, registration);

      // Update categories
      const newCategories = new Map(state.categories);
      const category = registration.metadata.category;
      const categoryComponents = newCategories.get(category) || [];
      if (!categoryComponents.includes(id)) {
        newCategories.set(category, [...categoryComponents, id]);
      }

      // Update cache if enabled
      let newCache = state.cache;
      if (state.config.enableCaching) {
        newCache = new Map(state.cache);
        newCache.set(id, registration.component);

        // Enforce cache size limit
        if (newCache.size > state.config.maxCacheSize) {
          const firstKey = newCache.keys().next().value;
          newCache.delete(firstKey);
        }
      }

      if (state.config.enableLogging) {
        console.log(`[ComponentRegistry] Registered component: ${id}`);
      }

      return {
        ...state,
        components: newComponents,
        categories: newCategories,
        cache: newCache,
      };
    }

    case 'UNREGISTER_COMPONENT': {
      const { id } = action.payload;
      const newComponents = new Map(state.components);
      const removed = newComponents.delete(id);

      if (removed) {
        // Update categories
        const newCategories = new Map(state.categories);
        for (const [category, components] of newCategories.entries()) {
          newCategories.set(category, components.filter(c => c !== id));
        }

        // Remove from cache
        const newCache = new Map(state.cache);
        newCache.delete(id);

        if (state.config.enableLogging) {
          console.log(`[ComponentRegistry] Unregistered component: ${id}`);
        }

        return {
          ...state,
          components: newComponents,
          categories: newCategories,
          cache: newCache,
        };
      }

      return state;
    }

    case 'CLEAR_REGISTRY': {
      if (state.config.enableLogging) {
        console.log('[ComponentRegistry] Cleared registry');
      }

      return {
        ...state,
        components: new Map(),
        categories: new Map(),
        cache: new Map(),
      };
    }

    case 'UPDATE_CONFIG': {
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };
    }

    default:
      return state;
  }
}

// Context
const ComponentRegistryContext = createContext<ComponentRegistryAPI | null>(null);

// Hook
export function useComponentRegistry(): ComponentRegistryAPI {
  const context = useContext(ComponentRegistryContext);
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider');
  }
  return context;
}

// Provider component
interface ComponentRegistryProviderProps {
  children: ReactNode;
  config?: Partial<ComponentRegistryConfig>;
}

export function ComponentRegistryProvider({ children, config = {} }: ComponentRegistryProviderProps) {
  const [state, dispatch] = useReducer(componentRegistryReducer, {
    ...initialState,
    config: { ...initialState.config, ...config },
  });

  const register = useCallback((id: string, component: React.ComponentType<any>, metadata: Partial<ComponentMetadata>) => {
    const fullMetadata: ComponentMetadata = {
      id,
      name: metadata.name || id,
      version: metadata.version || '1.0.0',
      category: metadata.category || 'utility',
      dependencies: metadata.dependencies || [],
      props: metadata.props || {},
      description: metadata.description || '',
      tags: metadata.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const registration: ComponentRegistration = {
      metadata: fullMetadata,
      component,
    };

    dispatch({ type: 'REGISTER_COMPONENT', payload: { id, registration } });
  }, []);

  const unregister = useCallback((id: string): boolean => {
    const exists = state.components.has(id);
    if (exists) {
      dispatch({ type: 'UNREGISTER_COMPONENT', payload: { id } });
    }
    return exists;
  }, [state.components]);

  const get = useCallback((id: string): React.ComponentType<any> | null => {
    // Check cache first
    if (state.config.enableCaching && state.cache.has(id)) {
      return state.cache.get(id) || null;
    }

    // Get from registry
    const registration = state.components.get(id);
    if (!registration) {
      return null;
    }

    // Use factory if available
    if (registration.factory) {
      return registration.factory();
    }

    return registration.component;
  }, [state.components, state.cache, state.config.enableCaching]);

  const getMetadata = useCallback((id: string): ComponentMetadata | null => {
    const registration = state.components.get(id);
    return registration ? registration.metadata : null;
  }, [state.components]);

  const list = useCallback((category?: string): ComponentMetadata[] => {
    if (category) {
      const categoryComponents = state.categories.get(category) || [];
      return categoryComponents
        .map(id => state.components.get(id))
        .filter(Boolean)
        .map(registration => registration!.metadata);
    }

    return Array.from(state.components.values()).map(registration => registration.metadata);
  }, [state.components, state.categories]);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_REGISTRY' });
  }, []);

  const validate = useCallback((id: string): boolean => {
    if (!state.config.enableValidation) {
      return true;
    }

    const registration = state.components.get(id);
    if (!registration) {
      return false;
    }

    // Basic validation
    const { metadata } = registration;
    return !!(metadata.name && metadata.version && metadata.category);
  }, [state.components, state.config.enableValidation]);

  const getStats = useCallback(() => {
    const categories: Record<string, number> = {};
    for (const [category, components] of state.categories.entries()) {
      categories[category] = components.length;
    }

    return {
      total: state.components.size,
      categories,
    };
  }, [state.components, state.categories]);

  const api: ComponentRegistryAPI = useMemo(() => ({
    register,
    unregister,
    get,
    getMetadata,
    list,
    clear,
    validate,
    getStats,
  }), [register, unregister, get, getMetadata, list, clear, validate, getStats]);

  return (
    <ComponentRegistryContext.Provider value={api}>
      {children}
    </ComponentRegistryContext.Provider>
  );
}

export default ComponentRegistryProvider; 