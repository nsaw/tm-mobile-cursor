import React from 'react';

export interface BaseComponentProps {
  children?: React.ReactNode;
  style?: any;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  accessibilityHint?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
}

export interface ComponentConfig {
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
  config: ComponentConfig;
  component: React.ComponentType<any>;
  factory?: () => React.ComponentType<any>;
}

export interface ComponentState {
  isMounted: boolean;
  isVisible: boolean;
  isFocused: boolean;
  isActive: boolean;
  error: Error | null;
  loading: boolean;
}

export interface ComponentContext {
  id: string;
  config: ComponentConfig;
  state: ComponentState;
  props: Record<string, any>;
  children: React.ReactNode;
}

export interface ComponentHook<T = any> {
  state: T;
  actions: Record<string, (...args: any[]) => void>;
  computed: Record<string, any>;
}

export interface ComponentValidator {
  validate: (props: any) => boolean;
  errors: string[];
  warnings: string[];
}

export interface ComponentRenderer {
  render: (context: ComponentContext) => React.ReactElement;
  shouldUpdate: (prevProps: any, nextProps: any) => boolean;
}

export interface ComponentLifecycle {
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: (prevProps: any, nextProps: any) => void;
  onError?: (error: Error) => void;
} 