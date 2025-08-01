import { 
  LayoutContract, 
  ZIndexLayer, 
  LayoutValidationResult,
  SafeFrameShell as SafeFrameShellType 
} from './types';

/**
 * Layout contract utility functions for the hybrid renderer shell
 */

// Z-index value mapping
const Z_INDEX_VALUES: Record<ZIndexLayer, number> = {
  background: 0,
  content: 1,
  overlay: 100,
  modal: 1000,
  toast: 2000,
  tooltip: 3000,
  sacred: 9999
};

// Contract registry for tracking
const contractRegistry = new Map<string, LayoutContract>();

/**
 * Get z-index value for a layer
 */
export const getZIndexValue = (layer: ZIndexLayer): number => {
  return Z_INDEX_VALUES[layer] || 0;
};

/**
 * Register a layout contract
 */
export const registerLayoutContract = (contract: LayoutContract): void => {
  contractRegistry.set(contract.id, contract);
  
  if (__DEV__) {
    console.log(`🔧 Layout contract registered: ${contract.id}`, {
      zIndex: contract.zIndex,
      priority: contract.priority,
      protected: contract.protected
    });
  }
};

/**
 * Get layout contract by ID
 */
export const getLayoutContract = (id: string): LayoutContract | undefined => {
  return contractRegistry.get(id);
};

/**
 * Validate layout contract
 */
export const validateLayoutContract = (contract: LayoutContract): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Validate contract ID
  if (!contract.id || contract.id.trim() === '') {
    result.valid = false;
    result.errors.push('Contract ID is required');
  }

  // Validate z-index layer
  if (!Object.keys(Z_INDEX_VALUES).includes(contract.zIndex)) {
    result.valid = false;
    result.errors.push(`Invalid z-index layer: ${contract.zIndex}`);
  }

  // Validate priority
  if (contract.priority < 1 || contract.priority > 10) {
    result.warnings.push(`Priority should be between 1-10, got: ${contract.priority}`);
  }

  // Validate constraints
  if (contract.constraints.minWidth && contract.constraints.maxWidth) {
    if (contract.constraints.minWidth > contract.constraints.maxWidth) {
      result.constraintViolations.push('minWidth cannot be greater than maxWidth');
    }
  }

  if (contract.constraints.minHeight && contract.constraints.maxHeight) {
    if (contract.constraints.minHeight > contract.constraints.maxHeight) {
      result.constraintViolations.push('minHeight cannot be greater than maxHeight');
    }
  }

  // Check for z-index conflicts
  const existingContract = getLayoutContract(contract.id);
  if (existingContract && existingContract.zIndex !== contract.zIndex) {
    result.zIndexConflicts.push(`Z-index changed from ${existingContract.zIndex} to ${contract.zIndex}`);
  }

  // Update registry if valid
  if (result.valid) {
    registerLayoutContract(contract);
  }

  return result;
};

/**
 * Validate z-index protection
 */
export const validateZIndexProtection = (
  layer: ZIndexLayer,
  protected: boolean,
  fallback: number
): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Validate layer
  if (!Object.keys(Z_INDEX_VALUES).includes(layer)) {
    result.valid = false;
    result.errors.push(`Invalid z-index layer: ${layer}`);
  }

  // Validate fallback value
  if (protected && fallback < 0) {
    result.warnings.push('Fallback z-index should be non-negative');
  }

  // Check for conflicts with existing contracts
  for (const contract of contractRegistry.values()) {
    if (contract.zIndex === layer && contract.protected && protected) {
      result.zIndexConflicts.push(`Protected layer conflict: ${layer}`);
    }
  }

  return result;
};

/**
 * Validate safe frame shell
 */
export const validateSafeFrameShell = (shell: SafeFrameShellType): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Validate shell ID
  if (!shell.id || shell.id.trim() === '') {
    result.valid = false;
    result.errors.push('Safe frame shell ID is required');
  }

  // Validate contract
  const contractValidation = validateLayoutContract(shell.contract);
  if (!contractValidation.valid) {
    result.valid = false;
    result.errors.push(...contractValidation.errors);
  }
  result.warnings.push(...contractValidation.warnings);

  // Validate safe frame requirement
  if (!shell.contract.safeFrame) {
    result.warnings.push('Safe frame shell should have safeFrame enabled in contract');
  }

  return result;
};

/**
 * Get layout contract statistics
 */
export const getLayoutContractStatistics = () => {
  const stats = {
    total: contractRegistry.size,
    byZIndex: {} as Record<ZIndexLayer, number>,
    protected: 0,
    safeFrame: 0,
    validated: 0
  };

  for (const contract of contractRegistry.values()) {
    stats.byZIndex[contract.zIndex] = (stats.byZIndex[contract.zIndex] || 0) + 1;
    if (contract.protected) {
      stats.protected++;
    }
    if (contract.safeFrame) {
      stats.safeFrame++;
    }
    if (contract.validation.enabled) {
      stats.validated++;
    }
  }

  return stats;
};

/**
 * Clear contract registry
 */
export const clearContractRegistry = (): void => {
  contractRegistry.clear();
  if (__DEV__) {
    console.log('🔧 Layout contract registry cleared');
  }
};

/**
 * Export contract registry for debugging
 */
export const exportContractRegistry = (): LayoutContract[] => {
  return Array.from(contractRegistry.values());
};

/**
 * Check if z-index layer is protected
 */
export const isProtectedZIndexLayer = (layer: ZIndexLayer): boolean => {
  return layer === 'sacred';
};

/**
 * Get z-index layer priority
 */
export const getZIndexLayerPriority = (layer: ZIndexLayer): number => {
  const priorities = {
    sacred: 10,
    tooltip: 9,
    toast: 8,
    modal: 7,
    overlay: 6,
    content: 5,
    background: 1
  };
  return priorities[layer] || 1;
}; 