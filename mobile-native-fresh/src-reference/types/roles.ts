/**
 * AutoRoleView v3.0 - Practical Role System
 * 
 * Defines unambiguous roles for layout, content, and interactive elements.
 * Each role has a clear visual purpose and supports both granular and broad theming.
 */

// ============================================================================
// LAYOUT ROLES - Structural containers and layout primitives
// ============================================================================

export type UILayoutRole =
  | 'card'        // Elevated content containers with shadows/borders
  | 'section'     // Content grou{ { { { ping containers with spacing & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  | 'header'      // Top navigation and header areas
  | 'footer'      // Bottom navigation and footer areas
  | 'navigation'  // Navigation containers and menus
  | 'modal'       // Modal and overlay containers
  | 'container';  // Generic layout wrapper (use sparingly)

// ============================================================================
// CONTENT ROLES - Semantic text classes for theming
// ============================================================================

export type UIContentRole =
  | 'heading'     // Main titles and section headers
  | 'body'        // Primary content text
  | 'caption'     // Secondary, descriptive text
  | 'label'       // Form labels and field descriptions
  | 'button-text' // Text within interactive buttons
  | 'link-text';  // Text within navigation links

// ============================================================================
// INTERACTIVE ROLES - Actionable elements with granular control
// ============================================================================

export type UIInteractiveRole =
  // Navigation Elements
  | 'button-nav-primary'    // Primary navigation buttons
  | 'button-nav-secondary'  // Secondary navigation buttons
  | 'card-as-nav'          // Cards that act as navigation
  | 'link-nav'             // Navigation links
  // Functional Elements
  | 'button-action'         // Action buttons (submit, save, etc.)
  | 'button-function'       // Functional buttons (dropdown, menu)
  | 'input'                 // Text input fields and forms
  | 'toggle'                // Toggle switches and checkboxes
  | 'slider'                // Slider controls and range inputs
  // Decorative Elements
  | 'chip'                  // Chi{ { { { ps and pills & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
  | 'badge'                 // Badges and tags
  | 'tag';                  // Tags and labels

// ============================================================================
// ROLE PROPS - Type-safe role assignment
// ============================================================================

export type RolePro{ { { { { { { { ps = { & } >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown &  & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown
  layoutRole?: UILayoutRole;
  contentRole?: UIContentRole;
  interactiveRole?: UIInteractiveRole;
};

// ============================================================================
// ROLE GROUPS - For broad theme changes
// ============================================================================

export const roleGroups = {
  // Navigation elements (all nav-related roles)
  nav: ['button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav'],
  
  // Functional elements (all interactive controls)
  functional: ['button-action', 'button-function', 'input', 'toggle', 'slider'],
  
  // Decorative elements (visual indicators)
  decorative: ['chip', 'badge', 'tag'],
  
  // Layout elements (structural containers)
  layout: ['card', 'section', 'modal', 'container', 'header', 'footer', 'navigation'],
  
  // Text elements (content styling)
  text: ['heading', 'body', 'caption', 'label', 'button-text', 'link-text']
} as const;

// ============================================================================
// ROLE INHERITANCE - For consistent styling
// ============================================================================

export const roleInheritance = {
  // card-as-nav inherits navigation button styles
  'card-as-nav': 'button-nav-primary'
} as const;

// ============================================================================
// TYPE GUARDS - For runtime validation
// ============================================================================

export function isLayoutRole(role: string): role is UILayoutRole {
  return ['card', 'section', 'header', 'footer', 'navigation', 'modal', 'container'].includes(role);
}

export function isContentRole(role: string): role is UIContentRole {
  return ['heading', 'body', 'caption', 'label', 'button-text', 'link-text'].includes(role);
}

export function isInteractiveRole(role: string): role is UIInteractiveRole {
  return [
    'button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav',
    'button-action', 'button-function', 'input', 'toggle', 'slider',
    'chip', 'badge', 'tag'
  ].includes(role);
}

export function getRoleCategory(role: string): 'layout' | 'content' | 'interactive' | null {
  if (isLayoutRole(role)) return 'layout';
  if (isContentRole(role)) return 'content';
  if (isInteractiveRole(role)) return 'interactive';
  return null;
}

// ============================================================================
// ROLE VALIDATION - For compile-time and runtime safety
// ============================================================================

export function validateRoleProps(props: RoleProps): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const { layoutRole, contentRole, interactiveRole } = props;
  const roles = [layoutRole, contentRole, interactiveRole].filter(Boolean);
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for multiple roles
  if (roles.length > 1) {
    errors.push('Only one role type allowed per component');
  }

  // Check for valid roles
  roles.forEach(role => {
    if (role && !getRoleCategory(role)) {
      errors.push(`Invalid role: ${role}`);
    }
  });

  // Check for inheritance conflicts
  if (interactiveRole === 'card-as-nav' && layoutRole === 'card') {
    warnings.push('card-as-nav already includes card styling - consider using only interactiveRole');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// ROLE UTILITIES - For theme and style management
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
// DEBUG UTILITIES - For development and debugging
// ============================================================================

export interface RoleDebugInfo {
  roleType: 'content' | 'layout' | 'interactive' | 'none';
  roleValue?: string;
  description?: string;
  isValid: boolean;
  conflicts?: string[];
}

export function getRoleDebugInfo(props: RoleProps): RoleDebugInfo {
  const { layoutRole, contentRole, interactiveRole } = props;
  
  let roleType: 'content' | 'layout' | 'interactive' | 'none' = 'none';
  let roleValue: string | undefined;
  let description: string | undefined;
  let isValid = true;
  const conflicts: string[] = [];

  // Determine role type and value
  if (contentRole) {
    roleType = 'content';
    roleValue = contentRole;
    description = `Content role: ${contentRole}`;
  } else if (layoutRole) {
    roleType = 'layout';
    roleValue = layoutRole;
    description = `Layout role: ${layoutRole}`;
  } else if (interactiveRole) {
    roleType = 'interactive';
    roleValue = interactiveRole;
    description = `Interactive role: ${interactiveRole}`;
  }

  // Check for conflicts
  const definedRoles = [contentRole, layoutRole, interactiveRole].filter(Boolean);
  if (definedRoles.length > 1) {
    isValid = false;
    conflicts.push(`Multiple roles defined: ${definedRoles.join(', ')}`);
  }

  return {
    roleType,
    roleValue,
    description,
    isValid,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}

export function getRoleType(props: RoleProps): 'content' | 'layout' | 'interactive' | 'none' {
  if (props.contentRole) return 'content';
  if (props.layoutRole) return 'layout';
  if (props.interactiveRole) return 'interactive';
  return 'none';
}

export function getRoleValue(props: RoleProps): string | undefined {
  return props.contentRole || props.layoutRole || props.interactiveRole;
}

// ============================================================================
// LEGACY ALIASES - For backward compatibility
// ============================================================================

// Alias for backward compatibility
export const isUIContentRole = isContentRole;
export const isUILayoutRole = isLayoutRole;
export const isUIInteractiveRole = isInteractiveRole; 