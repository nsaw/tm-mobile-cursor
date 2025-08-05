/**
 * 🔍 USE ROLE DEBUG - Role Debugging Hook
 * 
 * This hook provides development-only role debugging utilities.
 * It includes role validation, visualization, and telemetry tracking.
 */

import { useCallback, useMemo } from 'react';

import { RoleProps, getRoleDebugInfo } from '../types/roles';
import {
  validateRolePropsStrict,
  createRuntimeValidator,
  createRoleTelemetry,
  RoleValidationResult,
} from '../utils/roleValidation';

export interface UseRoleDebugReturn {
  // Role information
  roleType: 'content' | 'layout' | 'interactive' | 'none';
  roleValue?: string;
  description?: string;
  
  // Validation
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validationResult: RoleValidationResult;
  
  // Debug utilities
  getDebugStyle: () => { borderColor: string; backgroundColor: string };
  getDebugInfo: () => string;
  trackUsage: (componentName: string) => void;
  
  // Style validation
  validateStyle: (style?: any) => any;
  validateAccessibility: (accessibilityProps?: any) => any;
}

export const useRoleDebug = (roleProps: RoleProps): UseRoleDebugReturn => {
  // Only enable debugging in development
  const isDevelopment = __DEV__;
  
  const debugInfo = useMemo(() => getRoleDebugInfo(roleProps), [roleProps]);
  const validationResult = useMemo(() => validateRolePropsStrict(roleProps), [roleProps]);
  
  const runtimeValidator = useMemo(() => createRuntimeValidator(), []);
  const telemetry = useMemo(() => createRoleTelemetry(), []);
  
  const getDebugStyle = useCallback(() => {
    if (!isDevelopment) {
      return { borderColor: 'transparent', backgroundColor: 'transparent' };
    }
    
    let borderColor = '#888888'; // Gray for no role
    let backgroundColor = 'rgba(128, 128, 128, 0.1)'; // Gray
    
    if (!debugInfo.isValid) {
      borderColor = '#ff4444'; // Red for invalid
    } else if (validationResult.warnings.length > 0) {
      borderColor = '#ffaa00'; // Orange for warnings
    } else if (debugInfo.roleType !== 'none') {
      borderColor = '#44ff44'; // Green for valid
      
      // Set background color based on role type
      switch (debugInfo.roleType) {
        case 'content':
          backgroundColor = 'rgba(255, 255, 0, 0.1)'; // Yellow
          break;
        case 'layout':
          backgroundColor = 'rgba(0, 255, 255, 0.1)'; // Cyan
          break;
        case 'interactive':
          backgroundColor = 'rgba(255, 0, 255, 0.1)'; // Magenta
          break;
      }
    }
    
    return { borderColor, backgroundColor };
  }, [isDevelopment, debugInfo, validationResult]);
  
  const getDebugInfo = useCallback(() => {
    if (!isDevelopment) return '';
    
    const { roleType, roleValue, description } = debugInfo;
    const { errors, warnings } = validationResult;
    
    let info = `🏷️ ${roleType.toUpperCase()}: ${roleValue || 'NONE'}`;
    
    if (description) {
      info += `\n📝 ${description}`;
    }
    
    if (errors.length > 0) {
      info += `\n❌ Errors: ${errors.join(', ')}`;
    }
    
    if (warnings.length > 0) {
      info += `\n⚠️ Warnings: ${warnings.join(', ')}`;
    }
    
    return info;
  }, [isDevelopment, debugInfo, validationResult]);
  
  const trackUsage = useCallback((componentName: string) => {
    if (isDevelopment) {
      telemetry.trackRoleUsage(roleProps, componentName);
    }
  }, [isDevelopment, roleProps, telemetry]);
  
  const validateStyle = useCallback((style?: any) => {
    if (!isDevelopment) return true;
    
    return runtimeValidator.validateStyleCompatibility(roleProps, style);
  }, [isDevelopment, roleProps, runtimeValidator]);
  
  const validateAccessibility = useCallback((accessibilityProps?: any) => {
    if (!isDevelopment) return true;
    
    return runtimeValidator.validateAccessibilityCompatibility(roleProps, accessibilityProps);
  }, [isDevelopment, roleProps, runtimeValidator]);
  
  return {
    // Role information
    roleType: debugInfo.roleType,
    roleValue: debugInfo.roleValue,
    description: debugInfo.description,
    
    // Validation
    isValid: debugInfo.isValid,
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    validationResult,
    
    // Debug utilities
    getDebugStyle,
    getDebugInfo,
    trackUsage,
    
    // Style validation
    validateStyle,
    validateAccessibility,
  };
};

// ============================================================================
// SPECIALIZED ROLE DEBUG HOOKS
// ============================================================================

export const useContentRoleDebug = (contentRole?: string) => {
  return useRoleDebug({ contentRole: contentRole as any });
};

export const useLayoutRoleDebug = (layoutRole?: string) => {
  return useRoleDebug({ layoutRole: layoutRole as any });
};

export const useInteractiveRoleDebug = (interactiveRole?: string) => {
  return useRoleDebug({ interactiveRole: interactiveRole as any });
};

// ============================================================================
// ROLE TELEMETRY HOOK
// ============================================================================

export const useRoleTelemetry = () => {
  const telemetry = useMemo(() => createRoleTelemetry(), []);
  
  const getUsageStats = useCallback(() => {
    return telemetry.getRoleUsageStats();
  }, [telemetry]);
  
  const clearUsageStats = useCallback(() => {
    telemetry.clearRoleUsageStats();
  }, [telemetry]);
  
  return {
    getUsageStats,
    clearUsageStats,
  };
};

export default useRoleDebug; 