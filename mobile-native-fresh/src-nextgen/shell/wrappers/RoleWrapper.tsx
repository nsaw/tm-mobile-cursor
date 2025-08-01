import React, { useEffect, useRef, useState } from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { RoleWrapperProps, RoleConfig, ComponentRole } from './types';

/**
 * RoleWrapper Component
 * 
 * A wrapper component that assigns roles to child components
 * and provides role-based functionality and validation.
 * 
 * Debug Features:
 * - Visual overlay highlighting active roles
 * - Environment variable toggle: EXPO_PUBLIC_DEBUG_ROLES=true
 * - Runtime role assignment display
 * - Color-coded role identification
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
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);

  // Default configuration
  const defaultConfig: RoleConfig = {
    role,
    priority: 1,
    protected: false,
    validation: true,
    debug: false
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Check for debug environment variable
  useEffect(() => {
    const debugEnabled = process.env.EXPO_PUBLIC_DEBUG_ROLES === 'true' || finalConfig.debug;
    setShowDebugOverlay(debugEnabled);
  }, [finalConfig.debug]);

  // Role-specific styling
  const getRoleStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'relative',
    };

    if (showDebugOverlay) {
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = getRoleColor(role);
      baseStyle.backgroundColor = `${getRoleColor(role)}15`;
      baseStyle.padding = 2;
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
    if (showDebugOverlay) {
      console.log(`🔧 RoleWrapper: ${role}`, {
        componentId: componentId.current,
        config: finalConfig,
        timestamp: new Date().toISOString(),
        debugOverlay: showDebugOverlay
      });
    }
  }, [role, showDebugOverlay]);

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
      
      {/* Debug Overlay */}
      {showDebugOverlay && (
        <View style={[styles.debugOverlay, { backgroundColor: getRoleColor(role) }]}>
          <Text style={styles.debugText}>
            {role}
          </Text>
          <Text style={styles.debugSubtext}>
            {finalConfig.priority > 1 ? `P${finalConfig.priority}` : ''}
            {finalConfig.protected ? ' PROT' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

// Debug overlay styles
const styles = StyleSheet.create({
  debugOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 9999,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  debugSubtext: {
    color: 'white',
    fontSize: 8,
    opacity: 0.8,
  },
});

export default RoleWrapper; 