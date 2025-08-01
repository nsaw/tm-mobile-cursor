import React from 'react';

/**
 * Role types for component wrappers
 */
export type ComponentRole = 
  | 'layout'
  | 'content'
  | 'interactive'
  | 'navigation'
  | 'feedback'
  | 'sacred';

/**
 * Role configuration interface
 */
export interface RoleConfig {
  role: ComponentRole;
  priority: number;
  protected?: boolean;
  validation?: boolean;
  debug?: boolean;
}

/**
 * Wrapper props interface
 */
export interface RoleWrapperProps {
  role: ComponentRole;
  children: React.ReactNode;
  config?: Partial<RoleConfig>;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
}

/**
 * Role assignment interface
 */
export interface RoleAssignment {
  componentId: string;
  role: ComponentRole;
  timestamp: string;
  environment: 'legacy' | 'nextgen';
  validated: boolean;
}

/**
 * Role validation result
 */
export interface RoleValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
} 