import React from 'react';

/**
 * Z-index layer definitions
 */
export type ZIndexLayer = 
  | 'background'
  | 'content'
  | 'overlay'
  | 'modal'
  | 'toast'
  | 'tooltip'
  | 'sacred';

/**
 * Layout contract interface
 */
export interface LayoutContract {
  id: string;
  zIndex: ZIndexLayer;
  priority: number;
  protected: boolean;
  safeFrame: boolean;
  constraints: LayoutConstraints;
  validation: LayoutValidation;
}

/**
 * Layout constraints interface
 */
export interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  position?: 'absolute' | 'relative' | 'fixed';
  overflow?: 'visible' | 'hidden' | 'scroll';
}

/**
 * Layout validation interface
 */
export interface LayoutValidation {
  enabled: boolean;
  strict: boolean;
  warnings: boolean;
  errors: boolean;
}

/**
 * Z-index protection interface
 */
export interface ZIndexProtection {
  layer: ZIndexLayer;
  value: number;
  protected: boolean;
  fallback: number;
}

/**
 * Safe frame shell interface
 */
export interface SafeFrameShell {
  id: string;
  contract: LayoutContract;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
}

/**
 * Layout contract props interface
 */
export interface LayoutContractProps {
  contract: LayoutContract;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
}

/**
 * Z-index protection props interface
 */
export interface ZIndexProtectionProps {
  layer: ZIndexLayer;
  children: React.ReactNode;
  protected?: boolean;
  fallback?: number;
  className?: string;
  style?: React.CSSProperties;
  testID?: string;
}

/**
 * Layout validation result
 */
export interface LayoutValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  zIndexConflicts: string[];
  constraintViolations: string[];
} 