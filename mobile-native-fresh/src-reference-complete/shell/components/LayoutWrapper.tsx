import React from 'react';
import { View, StyleSheet } from 'react-native';

import { UILayoutRole } from '../../types/roles';

import { RoleWrapper, validateRole } from './RoleWrapper';

export interface LayoutWrapperProps {
  role: UILayoutRole;
  children: React.ReactNode;
  onRoleValidation?: (isValid: boolean) => void;
  debugMode?: boolean;
  showRoleLabel?: boolean;
  zIndex?: number;
  layer?: 'background' | 'content' | 'overlay' | 'modal' | 'floating' | 'notification';
  style?: any;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  [key: string]: any; // Allow other props
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  role,
  children,
  onRoleValidation,
  debugMode = false,
  showRoleLabel = false,
  zIndex,
  layer = 'content',
  style,
  accessibilityRole,
  accessibilityLabel,
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

  // Get layout-specific styles and z-index
  const getLayoutStyle = () => {
    const baseStyle = {
      zIndex: zIndex || getDefaultZIndex(layer),
    };

    switch (role) {
      case 'card':
        return [styles.card, baseStyle];
      case 'section':
        return [styles.section, baseStyle];
      case 'header':
        return [styles.header, baseStyle];
      case 'footer':
        return [styles.footer, baseStyle];
      case 'navigation':
        return [styles.navigation, baseStyle];
      case 'modal':
        return [styles.modal, baseStyle];
      case 'container':
        return [styles.container, baseStyle];
      default:
        return [styles.default, baseStyle];
    }
  };

  // Get default z-index based on layer
  const getDefaultZIndex = (layerType: string): number => {
    switch (layerType) {
      case 'background': return 0;
      case 'content': return 1;
      case 'overlay': return 100;
      case 'modal': return 200;
      case 'floating': return 300;
      case 'notification': return 400;
      default: return 1;
    }
  };

  // Debug mode with role label
  if (debugMode && showRoleLabel) {
    return (
      <RoleWrapper
        role={role}
        debugMode={true}
        showRoleLabel={true}
        onRoleValidation={onRoleValidation}
      >
        <View
          {...props}
          style={[getLayoutStyle(), style]}
          accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
          accessibilityLabel={role ? `Layout: ${role}` : accessibilityLabel}
        >
          {children}
        </View>
      </RoleWrapper>
    );
  }

  // Normal mode
  return (
    <View
      {...props}
      style={[getLayoutStyle(), style]}
      accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
      accessibilityLabel={role ? `Layout: ${role}` : accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    padding: 16,
    marginVertical: 8,
  },
  header: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  footer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  default: {
    flex: 1,
  },
});

export default LayoutWrapper; 