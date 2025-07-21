/**
 * AutoRoleView v3.0 - Smart Role-Based Component
 * 
 * Provides automatic styling, validation, and debugging for role-based components.
 * Supports inheritance, grouping, and page-specific overrides.
 */

import React from 'react';
import { View, ViewProps } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { RoleProps, validateRoleProps } from '../types/roles';
import { getRoleStyle, ThemePageOverrides, ThemeGroupOverrides } from '../utils/roleStyles';
import { useRoleDebug } from '../hooks/useRoleDebug';

// ============================================================================
// AUTO ROLE VIEW PROPS
// ============================================================================

export interface AutoRoleViewProps extends ViewProps, RoleProps {
  children: React.ReactNode;
  pageOverrides?: ThemePageOverrides;
  groupOverrides?: ThemeGroupOverrides;
  enableDebug?: boolean;
}

// ============================================================================
// AUTO ROLE VIEW COMPONENT
// ============================================================================

export function AutoRoleView({
  children,
  style,
  pageOverrides,
  groupOverrides,
  enableDebug = __DEV__,
  ...roleProps
}: AutoRoleViewProps) {
  const theme = useTheme();
  
  // Validate role props
  const validation = validateRoleProps(roleProps);
  if (!validation.isValid) {
    console.error('AutoRoleView validation failed:', validation.errors);
  }

  // Get the active role
  const { layoutRole, contentRole, interactiveRole } = roleProps;
  const activeRole = layoutRole || contentRole || interactiveRole;

  // Get role style with inheritance and overrides
  const roleStyle = activeRole ? 
    getRoleStyle(activeRole, theme, pageOverrides, groupOverrides) : {};

  // Get debug styling in development
  const debugHook = useRoleDebug(roleProps);
  const debugStyle = enableDebug ? debugHook.getDebugStyle() : {};

  // Get accessibility props based on role
  const accessibilityProps = getAccessibilityProps(roleProps);

  return (
    <View
      style={[roleStyle, debugStyle, style]}
      {...accessibilityProps}
    >
      {children}
    </View>
  );
}

// ============================================================================
// ACCESSIBILITY PROPS MAPPING
// ============================================================================

function getAccessibilityProps(roleProps: RoleProps) {
  const { layoutRole, contentRole, interactiveRole } = roleProps;
  
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
// CONVENIENCE COMPONENTS
// ============================================================================

export function Card({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView layoutRole="card" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function Section({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView layoutRole="section" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function Header({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView layoutRole="header" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function Footer({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView layoutRole="footer" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function NavigationButton({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView interactiveRole="button-nav-primary" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function ActionButton({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView interactiveRole="button-action" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function NavigationCard({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView interactiveRole="card-as-nav" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function Chip({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView interactiveRole="chip" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
}

export function Badge({ children, style, pageOverrides, ...props }: AutoRoleViewProps) {
  return (
    <AutoRoleView interactiveRole="badge" style={style} pageOverrides={pageOverrides} {...props}>
      {children}
    </AutoRoleView>
  );
} 