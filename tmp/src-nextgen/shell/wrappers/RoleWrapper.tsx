import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import { RoleWrapperProps, RoleConfig, ComponentRole } from './types';

/**
 * RoleWrapper Component
 * 
 * A wrapper component that assigns roles to child components
 * and provides role-based functionality and validation.
 */
export const RoleWrapper: React.FC<RoleWrapperProps> = ({
  role,
  children,
  config = {},
  className,
  style,
  testID
}) => {
  const componentRef = useRef<View>(null);
  const componentId = useRef(`role-wrapper-${role}-${Date.now()}`);

  // Default configuration
  const defaultConfig: RoleConfig = {
    role,
    priority: 1,
    protected: false,
    validation: true,
    debug: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Role-specific styling
  const getRoleStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
    };

    if (finalConfig.debug) {
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = getRoleColor(role);
      baseStyle.backgroundColor = `${getRoleColor(role)}20`;
    }

    return { ...baseStyle, ...style };
  };

  // Get color for role debugging
  const getRoleColor = (componentRole: ComponentRole): string => {
    const colors = {
      layout: '#3B82F6',      // Blue
      content: '#10B981',     // Green
      interactive: '#F59E0B',  // Yellow
      navigation: '#8B5CF6',   // Purple
      feedback: '#EF4444',     // Red
      sacred: '#DC2626'        // Dark Red
    };
    return colors[componentRole] || '#6B7280';
  };

  // Validation effect
  useEffect(() => {
    if (finalConfig.validation) {
      validateRoleAssignment();
    }
  }, [role, finalConfig.validation]);

  // Debug logging effect
  useEffect(() => {
    if (finalConfig.debug) {
      console.log(`🔧 RoleWrapper: ${role}`, {
        componentId: componentId.current,
        config: finalConfig,
        timestamp: new Date().toISOString()
      });
    }
  }, [role, finalConfig.debug]);

  // Validate role assignment
  const validateRoleAssignment = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate role type
    if (!['layout', 'content', 'interactive', 'navigation', 'feedback', 'sacred'].includes(role)) {
      errors.push(`Invalid role type: ${role}`);
    }

    // Validate priority
    if (finalConfig.priority < 1 || finalConfig.priority > 10) {
      warnings.push(`Priority should be between 1-10, got: ${finalConfig.priority}`);
    }

    // Log validation results
    if (errors.length > 0 || warnings.length > 0) {
      console.warn(`RoleWrapper validation for ${role}:`, { errors, warnings });
    }
  };

  return (
    <View
      ref={componentRef}
      style={getRoleStyle()}
      className={className}
      testID={testID || `role-wrapper-${role}`}
      accessibilityRole={role}
      accessibilityLabel={`Role wrapper for ${role}`}
    >
      {children}
    </View>
  );
};

export default RoleWrapper; 