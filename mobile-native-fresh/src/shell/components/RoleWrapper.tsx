import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { ShellRole } from '../types';

export interface RoleWrapperProps {
  role?: ShellRole;
  children: React.ReactNode;
  validateRole?: boolean;
  onRoleValidation?: (isValid: boolean) => void;
  debugMode?: boolean;
  showRoleLabel?: boolean;
  style?: any;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  [key: string]: any; // Allow other props
}

export interface RoleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  roleType: 'layout' | 'content' | 'interactive' | 'none';
}

// Role validation function
export const validateRole = (role?: ShellRole): RoleValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!role) {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      roleType: 'none'
    };
  }

  // Validate role type
  const layoutRoles: string[] = ['card', 'section', 'header', 'footer', 'navigation', 'modal', 'container'];
  const contentRoles: string[] = ['heading', 'body', 'caption', 'label', 'button-text', 'link-text'];
  const interactiveRoles: string[] = [
    'button-nav-primary', 'button-nav-secondary', 'card-as-nav', 'link-nav',
    'button-action', 'button-function', 'input', 'toggle', 'slider',
    'chip', 'badge', 'tag'
  ];

  let roleType: 'layout' | 'content' | 'interactive' | 'none' = 'none';

  if (layoutRoles.includes(role)) {
    roleType = 'layout';
  } else if (contentRoles.includes(role)) {
    roleType = 'content';
  } else if (interactiveRoles.includes(role)) {
    roleType = 'interactive';
  } else {
    errors.push(`Invalid role: ${role}`);
  }

  // Check for role conflicts
  if (role === 'card-as-nav' && roleType === 'interactive') {
    warnings.push('card-as-nav should be used as interactive role, not layout');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    roleType
  };
};

// Role debug component
const RoleDebugLabel: React.FC<{ role: ShellRole; roleType: string }> = ({ role, roleType }) => (
  <View style={[styles.debugLabel, { backgroundColor: getRoleColor(roleType) }]}>
    <Text style={styles.debugText}>{role}</Text>
    <Text style={styles.debugSubtext}>{roleType}</Text>
  </View>
);

// Get role color for debug display
const getRoleColor = (roleType: string): string => {
  switch (roleType) {
    case 'layout': return '#4CAF50';
    case 'content': return '#2196F3';
    case 'interactive': return '#FF9800';
    default: return '#9E9E9E';
  }
};

export const RoleWrapper: React.FC<RoleWrapperProps> = ({ 
  role, 
  children, 
  validateRole: shouldValidate = true,
  onRoleValidation,
  debugMode = false,
  showRoleLabel = false,
  ...props 
}) => {
  const validation = React.useMemo(() => {
    if (!shouldValidate) {
      return { isValid: true, errors: [], warnings: [], roleType: 'none' as const };
    }
    return validateRole(role);
  }, [role, shouldValidate]);

  React.useEffect(() => {
    if (onRoleValidation) {
      onRoleValidation(validation.isValid);
    }
  }, [validation.isValid, onRoleValidation]);

  // Debug mode with role label
  if (debugMode && showRoleLabel && role) {
    return (
      <View style={styles.debugContainer}>
        <RoleDebugLabel role={role} roleType={validation.roleType} />
        <View 
          {...props} 
          accessibilityRole={validation.isValid ? (role as any) : undefined}
          accessibilityLabel={role ? `Role: ${role}` : undefined}
          style={[props.style, styles.debugWrapper]}
        >
          {children}
        </View>
      </View>
    );
  }

  // Normal mode
  return (
    <View 
      {...props} 
      accessibilityRole={validation.isValid ? (role as any) : undefined}
      accessibilityLabel={role ? `Role: ${role}` : undefined}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  debugContainer: {
    position: 'relative',
  },
  debugWrapper: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FF9800',
    borderRadius: 4,
  },
  debugLabel: {
    position: 'absolute',
    top: -8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  debugSubtext: {
    fontSize: 8,
    color: 'white',
    opacity: 0.8,
  },
});

export default RoleWrapper; 