import React from 'react';
import { View, StyleSheet } from 'react-native';

import { UIContentRole } from '../../types/roles';

import { RoleWrapper, validateRole } from './RoleWrapper';

export interface ContentWrapperProps {
  role: UIContentRole;
  children: React.ReactNode;
  onRoleValidation?: (isValid: boolean) => void;
  debugMode?: boolean;
  showRoleLabel?: boolean;
  textStyle?: any;
  style?: any;
  accessibilityRole?: any;
  accessibilityLabel?: string;
  [key: string]: any; // Allow other props
}

export const ContentWrapper: React.FC<ContentWrapperProps> = ({
  role,
  children,
  onRoleValidation,
  debugMode = false,
  showRoleLabel = false,
  textStyle,
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

  // Get content-specific styles
  const getContentStyle = () => {
    switch (role) {
      case 'heading':
        return styles.heading;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      case 'button-text':
        return styles.buttonText;
      case 'link-text':
        return styles.linkText;
      default:
        return styles.default;
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
          style={[getContentStyle(), style]}
          accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
          accessibilityLabel={role ? `Content: ${role}` : accessibilityLabel}
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
      style={[getContentStyle(), style]}
      accessibilityRole={validation.isValid ? (role as any) : accessibilityRole}
      accessibilityLabel={role ? `Content: ${role}` : accessibilityLabel}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: 'underline',
    color: '#2196F3',
  },
  default: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default ContentWrapper; 