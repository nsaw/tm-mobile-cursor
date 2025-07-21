/**
 * AutoRoleView v3.0 - Smart Role Styles Engine
 * 
 * Provides hierarchical styling with inheritance, grouping, and page overrides.
 * Supports both granular control and broad theme changes.
 */

import type { ViewStyle } from 'react-native';

import { roleGroups, roleInheritance } from '../types/roles';

// ============================================================================
// ROLE STYLE GENERATOR - Theme-aware style generation
// ============================================================================

export function getRoleStyles(theme: any): Record<string, ViewStyle> {
  const { tokens } = useTheme();

const { tokens } = theme;
  
  return {
    // Layout Roles
    'card': {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      padding: tokens.spacing.md,
      marginVertical: tokens.spacing.sm,
    },
    'section': {
      backgroundColor: tokens.colors.background,
      padding: tokens.spacing.lg,
      marginVertical: tokens.spacing.md,
    },
    'header': {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    'footer': {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border,
    },
    'navigation': {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.sm,
    },
    'modal': {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      margin: tokens.spacing.lg,
    },
    'container': {
      backgroundColor: tokens.colors.background,
      padding: tokens.spacing.md,
    },

    // Interactive Roles - Navigation
    'button-nav-primary': {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'button-nav-secondary': {
      backgroundColor: tokens.colors.secondary,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'card-as-nav': {
      // Inherits from button-nav-primary + card styling
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      shadowColor: tokens.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      padding: tokens.spacing.md,
      marginVertical: tokens.spacing.sm,
      // Navigation button behavior
      alignItems: 'center',
      justifyContent: 'center',
    },
    'link-nav': {
      backgroundColor: 'transparent',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Interactive Roles - Functional
    'button-action': {
      backgroundColor: tokens.colors.primary,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'button-function': {
      backgroundColor: tokens.colors.secondary,
      borderRadius: tokens.radius.md,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'input': {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    'toggle': {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      padding: tokens.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'slider': {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.sm,
      padding: tokens.spacing.sm,
    },

    // Interactive Roles - Decorative
    'chip': {
      backgroundColor: tokens.colors.secondary,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'badge': {
      backgroundColor: tokens.colors.accent,
      borderRadius: tokens.radius.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'tag': {
      backgroundColor: tokens.colors.muted,
      borderRadius: tokens.radius.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
}

// ============================================================================
// PAGE OVERRIDES - For narrow, page-specific styling
// ============================================================================

export type ThemePageOverrides = {
  [pageName: string]: {
    [roleName: string]: Partial<ViewStyle>;
  };
};

// ============================================================================
// GROUP OVERRIDES - For broad theme changes
// ============================================================================

export type ThemeGroupOverrides = {
  [groupName: string]: Partial<ViewStyle>;
};

// ============================================================================
// SMART STYLE RESOLUTION
// ============================================================================

export function getRoleStyle(
  role: string, 
  theme: any,
  pageOverrides?: ThemePageOverrides,
  groupOverrides?: ThemeGroupOverrides
): ViewStyle {
  const roleStyles = getRoleStyles(theme);
  
  // Get base style
  const baseStyle = roleStyles[role];
  if (!baseStyle) {
    throw new Error(`No style defined for role: ${role}`);
  }

  // Get inherited style
  const inheritedRole = roleInheritance[role as keyof typeof roleInheritance];
  const inheritedStyle = inheritedRole ? roleStyles[inheritedRole] : {};

  // Get group overrides
  const group = getRoleGroup(role);
  const groupOverride = group && groupOverrides?.[group] ? groupOverrides[group] : {};

  // Get page overrides
  const pageOverride = pageOverrides ? 
    Object.values(pageOverrides).reduce((acc, pageRoles) => {
      return { ...acc, ...pageRoles[role] };
    }, {} as Partial<ViewStyle>) : {};

  // Merge in order: inherited + base + group + page
  return {
    ...inheritedStyle,
    ...baseStyle,
    ...groupOverride,
    ...pageOverride,
  };
}

// ============================================================================
// GROUP-BASED THEME CHANGES
// ============================================================================

export function updateRoleGroup(
  groupName: string, 
  stylePatch: Partial<ViewStyle>,
  _theme: any
): void {
  const groupRoles = roleGroups[groupName as keyof typeof roleGroups];
  if (!groupRoles) {
    throw new Error(`Unknown role group: ${groupName}`);
  }

  // Note: This is a runtime update - in a real implementation,
  // you might want to use a state management solution
  console.warn(`Role group update: ${groupName}`, stylePatch);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getRoleGroup(role: string): string | null {
  if (roleGroups.nav.includes(role as any)) return 'nav';
  if (roleGroups.functional.includes(role as any)) return 'functional';
  if (roleGroups.decorative.includes(role as any)) return 'decorative';
  if (roleGroups.layout.includes(role as any)) return 'layout';
  if (roleGroups.text.includes(role as any)) return 'text';
  return null;
}

export function getInheritedRole(role: string): string | null {
  return roleInheritance[role as keyof typeof roleInheritance] || null;
}

export function getAllRelatedRoles(role: string): string[] {
  const related: string[] = [role];
  
  // Add inherited role
  const inherited = getInheritedRole(role);
  if (inherited) {
    related.push(inherited);
  }
  
  // Add group members
  const group = getRoleGroup(role);
  if (group) {
    related.push(...roleGroups[group as keyof typeof roleGroups]);
  }
  
  return [...new Set(related)]; // Remove duplicates
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function validateRoleStyle(role: string, theme: any): boolean {
  const roleStyles = getRoleStyles(theme);
  return roleStyles[role] !== undefined;
}

export function getAvailableRoles(): string[] {
  return [
    'card', 'section', 'header', 'footer', 'navigation', 'modal', 'container',
    'button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav',
    'button-action', 'button-function', 'input', 'toggle', 'slider',
    'chip', 'badge', 'tag'
  ];
}

export function getAvailableGroups(): string[] {
  return Object.keys(roleGroups);
} 