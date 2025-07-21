// Layout Contract System
// Defines z-index contracts, safe-frame shells, and layout protection mechanisms

import { UILayoutRole } from '../../types/roles';

// ============================================================================
// Z-INDEX CONTRACTS - Layer-based z-index protection
// ============================================================================

export interface ZIndexContract {
  layoutId: string;
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

// ============================================================================
// SAFE-FRAME SHELLS - Protected layout containers
// ============================================================================

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

export interface LayoutConstraints {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  overflow: 'visible' | 'hidden' | 'scroll';
}

// ============================================================================
// LAYOUT PROTECTION - Sacred layout preservation
// ============================================================================

export interface LayoutProtection {
  layoutId: string;
  role: UILayoutRole;
  protectionLevel: 'critical' | 'high' | 'medium' | 'low';
  zIndexContract: ZIndexContract;
  safeFrameShell?: SafeFrameShell;
  validationRules: LayoutValidationRules;
}

export interface LayoutProtectionResult {
  isProtected: boolean;
  violations: string[];
  warnings: string[];
  protectionLevel: string;
}

// ============================================================================
// LAYOUT VALIDATION - Contract enforcement
// ============================================================================

export interface LayoutValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  violations: LayoutViolation[];
}

export interface LayoutViolation {
  type: 'z-index' | 'layer' | 'constraint' | 'conflict';
  severity: 'error' | 'warning';
  message: string;
  layoutId: string;
  expected: any;
  actual: any;
}

// ============================================================================
// LAYOUT MANAGER - Contract management system
// ============================================================================

export interface LayoutManager {
  contracts: ZIndexContract[];
  safeFrames: SafeFrameShell[];
  protections: LayoutProtection[];
  
  validateLayout(layoutId: string, role: UILayoutRole, zIndex: number): LayoutValidationResult;
  getZIndexContract(layoutId: string): ZIndexContract | null;
  getSafeFrameShell(layoutId: string): SafeFrameShell | null;
  getLayoutProtection(layoutId: string): LayoutProtection | null;
  registerLayout(layoutId: string, contract: ZIndexContract): boolean;
  unregisterLayout(layoutId: string): boolean;
}

// ============================================================================
// DEFAULT CONTRACTS - Predefined layout contracts
// ============================================================================

export const defaultZIndexContracts: ZIndexContract[] = [
  {
    layoutId: 'background',
    zIndex: 0,
    layer: 'background',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 0,
      maxZIndex: 0,
      allowedLayers: ['background'],
      conflicts: []
    }
  },
  {
    layoutId: 'content',
    zIndex: 1,
    layer: 'content',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 1,
      maxZIndex: 99,
      allowedLayers: ['content'],
      conflicts: []
    }
  },
  {
    layoutId: 'overlay',
    zIndex: 100,
    layer: 'overlay',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 100,
      maxZIndex: 199,
      allowedLayers: ['overlay'],
      conflicts: []
    }
  },
  {
    layoutId: 'modal',
    zIndex: 200,
    layer: 'modal',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 200,
      maxZIndex: 299,
      allowedLayers: ['modal'],
      conflicts: []
    }
  },
  {
    layoutId: 'floating',
    zIndex: 300,
    layer: 'floating',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 300,
      maxZIndex: 399,
      allowedLayers: ['floating'],
      conflicts: []
    }
  },
  {
    layoutId: 'notification',
    zIndex: 400,
    layer: 'notification',
    environment: 'legacy',
    conditions: [{ feature: 'layout', version: '1.0', screen: 'all' }],
    validationRules: {
      minZIndex: 400,
      maxZIndex: 499,
      allowedLayers: ['notification'],
      conflicts: []
    }
  }
];

export const defaultSafeFrameShells: SafeFrameShell[] = [
  {
    layoutId: 'modal-container',
    width: 300,
    height: 400,
    position: 'center',
    zIndex: 200,
    environment: 'legacy',
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
    constraints: {
      minWidth: 200,
      maxWidth: 400,
      minHeight: 100,
      maxHeight: 600,
      overflow: 'hidden'
    },
    validationRules: {
      minZIndex: 200,
      maxZIndex: 299,
      allowedLayers: ['modal'],
      conflicts: []
    }
  },
  {
    layoutId: 'notification-container',
    width: 350,
    height: 80,
    position: 'top',
    zIndex: 400,
    environment: 'legacy',
    padding: { top: 10, bottom: 10, left: 15, right: 15 },
    constraints: {
      minWidth: 250,
      maxWidth: 400,
      minHeight: 60,
      maxHeight: 120,
      overflow: 'hidden'
    },
    validationRules: {
      minZIndex: 400,
      maxZIndex: 499,
      allowedLayers: ['notification'],
      conflicts: []
    }
  }
];

// ============================================================================
// UTILITY FUNCTIONS - Contract helpers
// ============================================================================

export const getZIndexForLayer = (layer: string): number => {
  const layerZIndices = {
    background: 0,
    content: 1,
    overlay: 100,
    modal: 200,
    floating: 300,
    notification: 400
  };
  return layerZIndices[layer as keyof typeof layerZIndices] || 1;
};

export const getLayerForZIndex = (zIndex: number): string => {
  if (zIndex === 0) return 'background';
  if (zIndex >= 1 && zIndex <= 99) return 'content';
  if (zIndex >= 100 && zIndex <= 199) return 'overlay';
  if (zIndex >= 200 && zIndex <= 299) return 'modal';
  if (zIndex >= 300 && zIndex <= 399) return 'floating';
  if (zIndex >= 400 && zIndex <= 499) return 'notification';
  return 'content';
};

export const validateZIndex = (zIndex: number, layer: string): boolean => {
  const expectedLayer = getLayerForZIndex(zIndex);
  return expectedLayer === layer;
}; 