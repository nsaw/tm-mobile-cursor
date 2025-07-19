/**
 * 🛡️ ROLE VALIDATION - Compile-time and Runtime Role Safety
 * 
 * This utility provides comprehensive role validation for the AutoRoleView system.
 * It ensures type safety, accessibility compliance, and visual consistency.
 */

import type { ViewStyle, TextStyle } from 'react-native';

import {
  RoleProps,
  RoleDebugInfo,
  getRoleDebugInfo,
  getRoleType,
  getRoleValue,
  isContentRole,
  isLayoutRole,
  isInteractiveRole,
} from '../types/roles';

// ============================================================================
// ROLE VALIDATION RESULT TYPES
// ============================================================================

export interface RoleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  debugInfo: RoleDebugInfo;
}

export interface StyleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AccessibilityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// STRICT ROLE VALIDATION
// ============================================================================

export function validateRolePropsStrict(props: RoleProps): RoleValidationResult {
  const debugInfo = getRoleDebugInfo(props);
  const { layoutRole, contentRole, interactiveRole } = props;
  
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for multiple roles
  const roles = [layoutRole, contentRole, interactiveRole].filter(Boolean);
  if (roles.length > 1) {
    errors.push(`Multiple roles defined: ${roles.join(', ')}. Only one role type allowed per component.`);
  }

  // Check for valid roles
  roles.forEach(role => {
    if (role && !isContentRole(role) && !isLayoutRole(role) && !isInteractiveRole(role)) {
      errors.push(`Invalid role: ${role}`);
    }
  });

  // Check for role conflicts
  if (interactiveRole === 'card-as-nav' && layoutRole === 'card') {
    warnings.push('card-as-nav already includes card styling - consider using only interactiveRole');
  }

  // Check for accessibility conflicts
  if (contentRole === 'heading' && layoutRole === 'header') {
    warnings.push('Both content and layout roles have header semantics - consider using only one');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    debugInfo
  };
}

// ============================================================================
// RUNTIME VALIDATOR
// ============================================================================

export function createRuntimeValidator() {
  return {
    validateRoleProps: (props: RoleProps): RoleValidationResult => {
      return validateRolePropsStrict(props);
    },

    validateStyleCompatibility: (props: RoleProps, style?: ViewStyle | TextStyle): StyleValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!style) {
        return { isValid: true, errors, warnings };
      }

      const roleType = getRoleType(props);
      const roleValue = getRoleValue(props);

      // Check for style conflicts based on role
      if (roleType === 'layout' && roleValue === 'card') {
        if (style.backgroundColor === 'transparent') {
          warnings.push('Card with transparent background may not be visible');
        }
      }

      if (roleType === 'interactive' && roleValue?.includes('button')) {
        if (style.opacity === 0) {
          errors.push('Interactive button with opacity 0 is not accessible');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    },

    validateAccessibilityCompatibility: (props: RoleProps, accessibilityProps?: any): AccessibilityValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!accessibilityProps) {
        return { isValid: true, errors, warnings };
      }

      const roleType = getRoleType(props);
      const roleValue = getRoleValue(props);

      // Check accessibility role conflicts
      if (roleType === 'interactive' && roleValue?.includes('button')) {
        if (accessibilityProps.accessibilityRole && accessibilityProps.accessibilityRole !== 'button') {
          warnings.push('Button role should have accessibilityRole="button"');
        }
      }

      if (roleType === 'interactive' && roleValue === 'link-nav') {
        if (accessibilityProps.accessibilityRole && accessibilityProps.accessibilityRole !== 'link') {
          warnings.push('Link role should have accessibilityRole="link"');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    }
  };
}

// ============================================================================
// ROLE TELEMETRY
// ============================================================================

export function createRoleTelemetry() {
  const usageStats: Record<string, number> = {};
  const errorStats: Record<string, number> = {};

  return {
    trackRoleUsage: (props: RoleProps, componentName: string) => {
      const roleType = getRoleType(props);
      const roleValue = getRoleValue(props);
      
      const key = `${componentName}:${roleType}:${roleValue}`;
      usageStats[key] = (usageStats[key] || 0) + 1;
    },

    trackRoleError: (error: string, componentName: string) => {
      const key = `${componentName}:${error}`;
      errorStats[key] = (errorStats[key] || 0) + 1;
    },

    getRoleUsageStats: () => {
      return { usageStats, errorStats };
    },

    clearRoleUsageStats: () => {
      Object.keys(usageStats).forEach(key => delete usageStats[key]);
      Object.keys(errorStats).forEach(key => delete errorStats[key]);
    }
  };
}

// ============================================================================
// ROLE ACCESSIBILITY MAPPING
// ============================================================================

export function getRoleAccessibilityProps(props: RoleProps): any {
  const { layoutRole, contentRole, interactiveRole } = props;
  
  // Layout role accessibility
  if (layoutRole === 'header') {
    return { accessibilityRole: 'header' as const };
  }
  if (layoutRole === 'footer') {
    return { accessibilityRole: 'none' as const }; // React Native doesn't have footer role
  }
  if (layoutRole === 'navigation') {
    return { accessibilityRole: 'none' as const }; // React Native doesn't have navigation role
  }
  if (layoutRole === 'modal') {
    return { accessibilityRole: 'none' as const }; // React Native doesn't have dialog role
  }

  // Interactive role accessibility
  if (interactiveRole?.includes('button')) {
    return { accessibilityRole: 'button' as const };
  }
  if (interactiveRole === 'link-nav') {
    return { accessibilityRole: 'link' as const };
  }
  if (interactiveRole === 'input') {
    return { accessibilityRole: 'text' as const };
  }
  if (interactiveRole === 'toggle') {
    return { accessibilityRole: 'switch' as const };
  }
  if (interactiveRole === 'slider') {
    return { accessibilityRole: 'adjustable' as const };
  }

  // Content role accessibility
  if (contentRole === 'heading') {
    return { accessibilityRole: 'header' as const };
  }

  return {};
}

// ============================================================================
// ROLE STYLE MAPPING
// ============================================================================

export function getRoleStyleProps(props: RoleProps): ViewStyle | TextStyle {
  const roleValue = getRoleValue(props);

  if (!roleValue) {
    return {};
  }

  // Return empty style - actual styling is handled by roleStyles utility
  return {};
}

// ============================================================================
// EXPORT ALL VALIDATION UTILITIES
// ============================================================================

// All functions are already exported above 