import { UILayoutRole } from '../../types/roles';

// Layout contract types
export interface LayoutContract {
  layoutId: string;
  role: UILayoutRole;
  zIndex: number;
  layer: 'background' | 'content' | 'overlay' | 'modal' | 'floating' | 'notification';
  environment: 'legacy' | 'nextgen';
  conditions: LayoutCondition[];
  validationRules: LayoutValidationRules;
}

export interface LayoutCondition {
  feature: string;
  version: string;
  screen: string;
}

export interface LayoutValidationRules {
  minZIndex: number;
  maxZIndex: number;
  allowedLayers: string[];
  conflicts: string[];
}

export interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  overflow: 'visible' | 'hidden' | 'scroll';
}

export interface ZIndexContract {
  layoutId: string;
  zIndex: number;
  layer: 'background' | 'content' | 'overlay' | 'modal' | 'floating' | 'notification';
  environment: 'legacy' | 'nextgen';
  conditions: LayoutCondition[];
  validationRules: LayoutValidationRules;
}

export interface SafeFrameShell {
  layoutId: string;
  width: number;
  height: number;
  position: 'center' | 'bottom' | 'top' | 'full';
  zIndex: number;
  environment: 'legacy' | 'nextgen';
  padding: LayoutPadding;
  constraints: LayoutConstraints;
  validationRules: LayoutValidationRules;
}

export interface LayoutPadding {
  top: number;
  bottom: number;
  left: number;
  right: number;
} 