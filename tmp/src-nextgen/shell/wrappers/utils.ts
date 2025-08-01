import { ComponentRole, RoleConfig, RoleAssignment, RoleValidationResult } from './types';

/**
 * Role utility functions for the hybrid renderer shell
 */

// Role registry for tracking assignments
const roleRegistry = new Map<string, RoleAssignment>();

/**
 * Register a role assignment
 */
export const registerRoleAssignment = (
  componentId: string,
  role: ComponentRole,
  environment: 'legacy' | 'nextgen' = 'nextgen'
): void => {
  const assignment: RoleAssignment = {
    componentId,
    role,
    timestamp: new Date().toISOString(),
    environment,
    validated: false
  };
  
  roleRegistry.set(componentId, assignment);
  
  if (__DEV__) {
    console.log(`🔧 Role registered: ${componentId} -> ${role} (${environment})`);
  }
};

/**
 * Get role assignment for a component
 */
export const getRoleAssignment = (componentId: string): RoleAssignment | undefined => {
  return roleRegistry.get(componentId);
};

/**
 * Validate role assignment
 */
export const validateRoleAssignment = (
  componentId: string,
  role: ComponentRole,
  config?: Partial<RoleConfig>
): RoleValidationResult => {
  const result: RoleValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  // Validate role type
  const validRoles: ComponentRole[] = ['layout', 'content', 'interactive', 'navigation', 'feedback', 'sacred'];
  if (!validRoles.includes(role)) {
    result.valid = false;
    result.errors.push(`Invalid role type: ${role}`);
  }

  // Validate configuration
  if (config) {
    if (config.priority && (config.priority < 1 || config.priority > 10)) {
      result.warnings.push(`Priority should be between 1-10, got: ${config.priority}`);
    }
  }

  // Check for role conflicts
  const existingAssignment = getRoleAssignment(componentId);
  if (existingAssignment && existingAssignment.role !== role) {
    result.warnings.push(`Component ${componentId} already has role ${existingAssignment.role}, changing to ${role}`);
  }

  // Update registry
  if (result.valid) {
    registerRoleAssignment(componentId, role);
    const assignment = getRoleAssignment(componentId);
    if (assignment) {
      assignment.validated = true;
    }
  }

  return result;
};

/**
 * Get role statistics
 */
export const getRoleStatistics = () => {
  const stats = {
    total: roleRegistry.size,
    byRole: {} as Record<ComponentRole, number>,
    byEnvironment: {
      legacy: 0,
      nextgen: 0
    },
    validated: 0
  };

  for (const assignment of roleRegistry.values()) {
    stats.byRole[assignment.role] = (stats.byRole[assignment.role] || 0) + 1;
    stats.byEnvironment[assignment.environment]++;
    if (assignment.validated) {
      stats.validated++;
    }
  }

  return stats;
};

/**
 * Clear role registry
 */
export const clearRoleRegistry = (): void => {
  roleRegistry.clear();
  if (__DEV__) {
    console.log('🔧 Role registry cleared');
  }
};

/**
 * Export role registry for debugging
 */
export const exportRoleRegistry = (): RoleAssignment[] => {
  return Array.from(roleRegistry.values());
};

/**
 * Get role color for debugging
 */
export const getRoleColor = (role: ComponentRole): string => {
  const colors = {
    layout: '#3B82F6',      // Blue
    content: '#10B981',     // Green
    interactive: '#F59E0B',  // Yellow
    navigation: '#8B5CF6',   // Purple
    feedback: '#EF4444',     // Red
    sacred: '#DC2626'        // Dark Red
  };
  return colors[role] || '#6B7280';
};

/**
 * Check if role is protected
 */
export const isProtectedRole = (role: ComponentRole): boolean => {
  return role === 'sacred';
};

/**
 * Get role priority
 */
export const getRolePriority = (role: ComponentRole): number => {
  const priorities = {
    sacred: 10,
    navigation: 9,
    layout: 8,
    interactive: 7,
    feedback: 6,
    content: 5
  };
  return priorities[role] || 1;
}; 