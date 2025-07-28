import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

interface AutoRoleViewProps {
  children: React.ReactNode;
  layoutRole?: string;
  style?: any;
  onPress?: () => void;
  accessibilityRole?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({
  children,
  layoutRole: _layoutRole, // eslint-disable-line no-unused-vars
  style,
  onPress,
  accessibilityRole,
  accessible,
  accessibilityLabel,
  ...props
}) => {
  // const { designTokens } = useTheme(); // Commented out as not used

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        accessibilityRole={accessibilityRole as any}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole={accessibilityRole as any}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      {children}
    </View>
  );
};

export const ActionButton: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
}> = ({ children, onPress, style, disabled }) => {
  const { designTokens } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        styles.actionButtonDynamic,
        {
          backgroundColor: designTokens.colors.primary,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Action button"
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // Default container styles
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDynamic: {
    opacity: 1,
  },
}); 