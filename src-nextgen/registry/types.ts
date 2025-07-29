import React from 'react';

export interface ComponentMetadata {
  id: string;
  name: string;
  version: string;
  category: 'layout' | 'content' | 'feature' | 'utility';
  dependencies: string[];
  props: Record<string, any>;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentRegistration {
  metadata: ComponentMetadata;
  component: React.ComponentType<any>;
  factory?: () => React.ComponentType<any>;
}

export interface ComponentRegistryConfig {
  enableValidation: boolean;
  enableCaching: boolean;
  maxCacheSize: number;
  enableLogging: boolean;
}

export interface ComponentRegistryState {
  components: Map<string, ComponentRegistration>;
  categories: Map<string, string[]>;
  cache: Map<string, React.ComponentType<any>>;
  config: ComponentRegistryConfig;
}

export interface ComponentRegistryAPI {
  register: (id: string, component: React.ComponentType<any>, metadata: Partial<ComponentMetadata>) => void;
  unregister: (id: string) => boolean;
  get: (id: string) => React.ComponentType<any> | null;
  getMetadata: (id: string) => ComponentMetadata | null;
  list: (category?: string) => ComponentMetadata[];
  clear: () => void;
  validate: (id: string) => boolean;
  getStats: () => { total: number; categories: Record<string, number> };
} 