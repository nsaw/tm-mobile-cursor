import { 
  LayoutContract, 
  ZIndexLayer, 
  LayoutValidationResult,
  LayoutConstraints 
} from './types';

/**
 * Layout contract validation utilities for the hybrid renderer shell
 */

/**
 * Validate layout constraints
 */
export const validateLayoutConstraints = (constraints: LayoutConstraints): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Validate width constraints
  if (constraints.minWidth && constraints.maxWidth) {
    if (constraints.minWidth > constraints.maxWidth) {
      result.valid = false;
      result.constraintViolations.push('minWidth cannot be greater than maxWidth');
    }
  }

  if (constraints.minWidth && constraints.minWidth < 0) {
    result.warnings.push('minWidth should be non-negative');
  }

  if (constraints.maxWidth && constraints.maxWidth < 0) {
    result.warnings.push('maxWidth should be non-negative');
  }

  // Validate height constraints
  if (constraints.minHeight && constraints.maxHeight) {
    if (constraints.minHeight > constraints.maxHeight) {
      result.valid = false;
      result.constraintViolations.push('minHeight cannot be greater than maxHeight');
    }
  }

  if (constraints.minHeight && constraints.minHeight < 0) {
    result.warnings.push('minHeight should be non-negative');
  }

  if (constraints.maxHeight && constraints.maxHeight < 0) {
    result.warnings.push('maxHeight should be non-negative');
  }

  // Validate aspect ratio
  if (constraints.aspectRatio && constraints.aspectRatio <= 0) {
    result.warnings.push('aspectRatio should be positive');
  }

  // Validate position
  if (constraints.position && !['absolute', 'relative', 'fixed'].includes(constraints.position)) {
    result.warnings.push(`Invalid position: ${constraints.position}`);
  }

  // Validate overflow
  if (constraints.overflow && !['visible', 'hidden', 'scroll'].includes(constraints.overflow)) {
    result.warnings.push(`Invalid overflow: ${constraints.overflow}`);
  }

  return result;
};

/**
 * Validate z-index layer hierarchy
 */
export const validateZIndexHierarchy = (
  parentLayer: ZIndexLayer,
  childLayer: ZIndexLayer
): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Define z-index hierarchy rules
  const hierarchyRules = {
    background: ['content', 'overlay', 'modal', 'toast', 'tooltip', 'sacred'],
    content: ['overlay', 'modal', 'toast', 'tooltip', 'sacred'],
    overlay: ['modal', 'toast', 'tooltip', 'sacred'],
    modal: ['toast', 'tooltip', 'sacred'],
    toast: ['tooltip', 'sacred'],
    tooltip: ['sacred'],
    sacred: []
  };

  const allowedChildren = hierarchyRules[parentLayer as keyof typeof hierarchyRules] || [];
  
  if (allowedChildren.length > 0 && !(allowedChildren as string[]).includes(childLayer)) {
    result.warnings.push(`Z-index layer ${parentLayer} should not contain ${childLayer} directly`);
    result.suggestions.push(`Consider using an intermediate ${allowedChildren[0] || 'content'} layer`);
  }

  return result;
};

/**
 * Validate layout contract for component
 */
export const validateComponentLayoutContract = (
  componentName: string,
  contract: LayoutContract
): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  // Component-specific layout validation
  const componentLayoutRules = {
    Button: {
      allowedZIndex: ['content', 'overlay'],
      requiredConstraints: ['minWidth', 'minHeight']
    },
    Text: {
      allowedZIndex: ['content'],
      requiredConstraints: []
    },
    View: {
      allowedZIndex: ['background', 'content', 'overlay'],
      requiredConstraints: []
    },
    ScrollView: {
      allowedZIndex: ['content'],
      requiredConstraints: ['minHeight']
    },
    Modal: {
      allowedZIndex: ['modal'],
      requiredConstraints: ['minWidth', 'minHeight']
    },
    Toast: {
      allowedZIndex: ['toast'],
      requiredConstraints: ['minWidth']
    }
  };

  const rules = componentLayoutRules[componentName as keyof typeof componentLayoutRules];
  
  if (rules) {
    // Validate z-index layer
    if (!rules.allowedZIndex.includes(contract.zIndex)) {
      result.warnings.push(`Component ${componentName} typically uses z-index layers: ${rules.allowedZIndex.join(', ')}`);
      result.suggestions.push(`Consider using z-index layer: ${rules.allowedZIndex[0]}`);
    }

    // Validate required constraints
    for (const constraint of rules.requiredConstraints) {
      if (!contract.constraints[constraint as keyof LayoutConstraints]) {
        result.warnings.push(`Component ${componentName} should have ${constraint} constraint`);
      }
    }
  }

  return result;
};

/**
 * Get layout contract suggestions
 */
export const getLayoutContractSuggestions = (componentName: string): Partial<LayoutContract> => {
  const suggestions = {
    Button: {
      zIndex: 'content' as ZIndexLayer,
      constraints: {
        minWidth: 44,
        minHeight: 44,
        position: 'relative' as const
      }
    },
    Text: {
      zIndex: 'content' as ZIndexLayer,
      constraints: {
        position: 'relative' as const
      }
    },
    View: {
      zIndex: 'content' as ZIndexLayer,
      constraints: {
        position: 'relative' as const
      }
    },
    ScrollView: {
      zIndex: 'content' as ZIndexLayer,
      constraints: {
        minHeight: 100,
        position: 'relative' as const
      }
    },
    Modal: {
      zIndex: 'modal' as ZIndexLayer,
      constraints: {
        minWidth: 300,
        minHeight: 200,
        position: 'absolute' as const
      }
    },
    Toast: {
      zIndex: 'toast' as ZIndexLayer,
      constraints: {
        minWidth: 200,
        position: 'absolute' as const
      }
    }
  };

  return suggestions[componentName as keyof typeof suggestions] || {
    zIndex: 'content' as ZIndexLayer,
    constraints: {
      position: 'relative' as const
    }
  };
};

/**
 * Validate layout contract consistency across environments
 */
export const validateLayoutContractConsistency = (
  legacyContract: LayoutContract,
  nextgenContract: LayoutContract
): LayoutValidationResult => {
  const result: LayoutValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    zIndexConflicts: [],
    constraintViolations: []
  };

  if (legacyContract.zIndex !== nextgenContract.zIndex) {
    result.warnings.push(`Z-index mismatch: legacy=${legacyContract.zIndex}, nextgen=${nextgenContract.zIndex}`);
    result.suggestions.push('Consider aligning z-index layers across environments for consistency');
  }

  if (legacyContract.priority !== nextgenContract.priority) {
    result.warnings.push(`Priority mismatch: legacy=${legacyContract.priority}, nextgen=${nextgenContract.priority}`);
    result.suggestions.push('Consider aligning priorities across environments for consistency');
  }

  return result;
}; 