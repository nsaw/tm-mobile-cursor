import { ComponentRole, RoleConfig, RoleValidationResult } from './types';

/**
 * Role validation utilities for the hybrid renderer shell
 */

/**
 * Validate role configuration
 */
export const validateRoleConfig = (config: Partial<RoleConfig>): RoleValidationResult => {
  const result: RoleValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Validate role
  if (config.role) {
    const validRoles: ComponentRole[] = ['layout', 'content', 'interactive', 'navigation', 'feedback', 'sacred'];
    if (!validRoles.includes(config.role)) {
      result.valid = false;
      result.errors.push(`Invalid role: ${config.role}`);
    }
  }

  // Validate priority
  if (config.priority !== undefined) {
    if (config.priority < 1 || config.priority > 10) {
      result.warnings.push(`Priority should be between 1-10, got: ${config.priority}`);
    }
  }

  // Validate protected status
  if (config.protected && config.role !== 'sacred') {
    result.warnings.push('Only sacred roles should be protected');
  }

  return result;
};

/**
 * Validate role hierarchy
 */
export const validateRoleHierarchy = (
  parentRole: ComponentRole,
  childRole: ComponentRole
): RoleValidationResult => {
  const result: RoleValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Define role hierarchy rules
  const hierarchyRules = {
    layout: ['content', 'interactive', 'navigation', 'feedback'],
    content: ['interactive'],
    interactive: [],
    navigation: ['interactive'],
    feedback: [],
    sacred: ['layout', 'content', 'interactive', 'navigation', 'feedback']
  };

  const allowedChildren = hierarchyRules[parentRole] || [];
  
  if (!allowedChildren.includes(childRole)) {
    result.warnings.push(`Role ${parentRole} should not contain ${childRole} directly`);
    result.suggestions.push(`Consider using an intermediate ${allowedChildren[0] || 'layout'} wrapper`);
  }

  return result;
};

/**
 * Validate role assignment for component
 */
export const validateComponentRole = (
  componentName: string,
  role: ComponentRole,
  props: any
): RoleValidationResult => {
  const result: RoleValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Component-specific role validation
  const componentRoleRules = {
    Button: ['interactive', 'navigation'],
    Text: ['content'],
    View: ['layout'],
    ScrollView: ['layout'],
    TouchableOpacity: ['interactive'],
    Image: ['content'],
    TextInput: ['interactive']
  };

  const allowedRoles = componentRoleRules[componentName as keyof typeof componentRoleRules];
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    result.warnings.push(`Component ${componentName} typically uses roles: ${allowedRoles.join(', ')}`);
    result.suggestions.push(`Consider using role: ${allowedRoles[0]}`);
  }

  // Validate props based on role
  if (role === 'interactive' && !props.onPress && !props.onPressIn && !props.onPressOut) {
    result.warnings.push('Interactive role should have press handlers');
  }

  if (role === 'navigation' && !props.onPress) {
    result.warnings.push('Navigation role should have onPress handler');
  }

  return result;
};

/**
 * Get role validation suggestions
 */
export const getRoleSuggestions = (componentName: string): ComponentRole[] => {
  const suggestions = {
    Button: ['interactive', 'navigation'],
    Text: ['content'],
    View: ['layout'],
    ScrollView: ['layout'],
    TouchableOpacity: ['interactive'],
    Image: ['content'],
    TextInput: ['interactive'],
    Header: ['layout', 'navigation'],
    Footer: ['layout', 'navigation'],
    Card: ['layout', 'content'],
    Modal: ['layout', 'feedback']
  };

  return suggestions[componentName as keyof typeof suggestions] || ['layout'];
};

/**
 * Validate role consistency across environments
 */
export const validateRoleConsistency = (
  legacyRole: ComponentRole,
  nextgenRole: ComponentRole
): RoleValidationResult => {
  const result: RoleValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  if (legacyRole !== nextgenRole) {
    result.warnings.push(`Role mismatch: legacy=${legacyRole}, nextgen=${nextgenRole}`);
    result.suggestions.push('Consider aligning roles across environments for consistency');
  }

  return result;
}; 