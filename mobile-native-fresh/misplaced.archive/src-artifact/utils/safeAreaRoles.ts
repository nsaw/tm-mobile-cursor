/**
 * 🛡️ SAFE AREA ROLES - Role-Based Safe Area Handling
 * 
 * This utility provides safe area handling based on layout roles.
 * It ensures proper spacing and positioning for different screen areas.
 */

import type { ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  UILayoutRole,
  RoleProps,
} from '../types/roles';

import { useTheme } from '../theme/ThemeProvider';

// ============================================================================
// SAFE AREA ROLE MAPPING - Safe area handling per role
// ============================================================================

export interface SafeAreaRoleConfig {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  padding?: ViewStyle;
  margin?: ViewStyle;
}

export const getSafeAreaRoleConfig = (role: UILayoutRole): SafeAreaRoleConfig => {
  switch (role) {
    case 'header':
      return {
        top: true,
        left: true,
        right: true,
        padding: { paddingTop: 0, paddingHorizontal: 0 },
      };
      
    case 'footer':
      return {
        bottom: true,
        left: true,
        right: true,
        padding: { paddingBottom: 0, paddingHorizontal: 0 },
      };
      
    case 'navigation':
      return {
        top: true,
        left: true,
        right: true,
        padding: { paddingTop: 0, paddingHorizontal: 0 },
      };
      
    case 'modal':
      return {
        top: true,
        bottom: true,
        left: true,
        right: true,
        padding: { padding: 0 },
      };
      
    case 'card':
    case 'section':
      return {
        left: true,
        right: true,
        padding: { paddingHorizontal: 0 },
      };
      
    default:
      return {
        left: true,
        right: true,
        padding: { paddingHorizontal: 0 },
      };
  }
};

// ============================================================================
// SAFE AREA STYLE GENERATION - Generate safe area styles
// ============================================================================

export const getSafeAreaStyle = (
  role: UILayoutRole,
  insets: any,
  theme: any
): ViewStyle => {
  const config = getSafeAreaRoleConfig(role);
  const { tokens } = theme;
  
  const style: ViewStyle = {};
  
  // Apply safe area padding
  if (config.top && insets.top > 0) {
    style.paddingTop = insets.top;
  }
  
  if (config.bottom && insets.bottom > 0) {
    style.paddingBottom = insets.bottom;
  }
  
  if (config.left && insets.left > 0) {
    style.paddingLeft = insets.left;
  }
  
  if (config.right && insets.right > 0) {
    style.paddingRight = insets.right;
  }
  
  // Apply role-specific padding
  if (config.padding) {
    Object.assign(style, config.padding);
  }
  
  // Apply role-specific margin
  if (config.margin) {
    Object.assign(style, config.margin);
  }
  
  return style;
};

// ============================================================================
// SAFE AREA HOOK - React hook for safe area handling
// ============================================================================

export const useSafeAreaRole = (roleProps: RoleProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  const getSafeAreaStyleForRole = (role: UILayoutRole): ViewStyle => {
    return getSafeAreaStyle(role, insets, theme);
  };
  
  const getCurrentSafeAreaStyle = (): ViewStyle => {
    const { layoutRole } = roleProps;
    
    if (layoutRole) {
      return getSafeAreaStyleForRole(layoutRole);
    }
    
    return {};
  };
  
  const getSafeAreaInsets = () => {
    return insets;
  };
  
  return {
    getSafeAreaStyleForRole,
    getCurrentSafeAreaStyle,
    getSafeAreaInsets,
    insets,
  };
};

// ============================================================================
// SAFE AREA UTILITIES - Helper functions
// ============================================================================

export const isSafeAreaRequired = (role: UILayoutRole): boolean => {
  const config = getSafeAreaRoleConfig(role);
  return !!(config.top || config.bottom || config.left || config.right);
};

export const getSafeAreaPadding = (role: UILayoutRole, insets: any): ViewStyle => {
  const config = getSafeAreaRoleConfig(role);
  const padding: ViewStyle = {};
  
  if (config.top && insets.top > 0) {
    padding.paddingTop = insets.top;
  }
  
  if (config.bottom && insets.bottom > 0) {
    padding.paddingBottom = insets.bottom;
  }
  
  if (config.left && insets.left > 0) {
    padding.paddingLeft = insets.left;
  }
  
  if (config.right && insets.right > 0) {
    padding.paddingRight = insets.right;
  }
  
  return padding;
};

export const getSafeAreaMargin = (role: UILayoutRole, insets: any): ViewStyle => {
  const config = getSafeAreaRoleConfig(role);
  const margin: ViewStyle = {};
  
  if (config.top && insets.top > 0) {
    margin.marginTop = insets.top;
  }
  
  if (config.bottom && insets.bottom > 0) {
    margin.marginBottom = insets.bottom;
  }
  
  if (config.left && insets.left > 0) {
    margin.marginLeft = insets.left;
  }
  
  if (config.right && insets.right > 0) {
    margin.marginRight = insets.right;
  }
  
  return margin;
};

// ============================================================================
// EXPORT ALL SAFE AREA UTILITIES
// ============================================================================

// All functions and types are already exported above 