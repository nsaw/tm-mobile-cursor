import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { UIInteractiveRole } from '../../types/roles';

import { RoleWrapper, validateRole } from './RoleWrapper';

export interface InteractiveWrapperProps {
  role: UIInteractiveRole;
  children: React.ReactNode;
  onRoleValidation?: (isValid: boolean) => void;
  debugMode?: boolean;
  showRoleLabel?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  onPress?: () => void;
  [key: string]: any; // Allow other props
}

export const InteractiveWrapper: React.FC<InteractiveWrapperProps> = ({
  role,
  children,
  onRoleValidation,
  debugMode = false,
  showRoleLabel = false,
  disabled = false,
  loading = false,
  style,
  accessibilityRole,
  accessibilityLabel,
  onPress,
  ...props
}) => {
  const validation = React.useMemo(() => {
    return validateRole(role);
  }, [role]);

  React.useEffect(() => {
    if (onRoleValidation) {
      onRoleValidation(validation.isValid);
    }
  }, [validation.isValid, onRoleValidation]);

  // Debug mode with role label
  if (debugMode && showRoleLabel) {
    return (
      <RoleWrapper
        role={role}
        debugMode={true}
        showRoleLabel={true}
        onRoleValidation={onRoleValidation}
      >
        <TouchableOpacity
          {...props}
          onPress={onPress}
          disabled={disabled || loading}
          style={[
            styles.interactiveWrapper,
            disabled && styles.disabled,
            loading && styles.loading,
            style
          ]}
          accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
          accessibilityLabel={role ? `Interactive: ${role}` : accessibilityLabel}
          accessibilityState={{ disabled, busy: loading }}
        >
          {children}
          {loading && (
            <View style={styles.loadingIndicator}>
              <Text style={styles.loadingText}>...</Text>
            </View>
          )}
        </TouchableOpacity>
      </RoleWrapper>
    );
  }

  // Normal mode
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.interactiveWrapper,
        disabled && styles.disabled,
        loading && styles.loading,
        style
      ]}
      accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
      accessibilityLabel={role ? `Interactive: ${role}` : accessibilityLabel}
      accessibilityState={{ disabled, busy: loading }}
    >
      {children}
      {loading && (
        <View style={styles.loadingIndicator}>
          <Text style={styles.loadingText}>...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  interactiveWrapper: {
    position: 'relative',
  },
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.7,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default InteractiveWrapper; 