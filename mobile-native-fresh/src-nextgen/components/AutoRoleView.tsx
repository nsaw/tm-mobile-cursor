import React from 'react';
import { View, ViewProps, AccessibilityRole, TouchableOpacity } from 'react-native';

export interface AutoRoleViewProps extends Omit<ViewProps, 'role'> {
  role?: AccessibilityRole;
  layoutRole?: string;
  onPress?: () => void;
  ariaLabel?: string;
  ariaPressed?: boolean;
  strictMode?: boolean;
  errorBoundary?: boolean;
  fallback?: () => React.ReactElement;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({ 
  role, 
  layoutRole, 
  style, 
  children, 
  onPress,
  ariaLabel,
  strictMode = false,
  errorBoundary = false,
  fallback,
  accessible,
  accessibilityLabel,
  ...props 
}) => {
  // Validation in strict mode
  if (strictMode && accessible && !accessibilityLabel) {
    console.warn('AutoRoleView: accessibilityLabel is required when accessible is true');
  }

  // Error boundary handling
  if (errorBoundary && fallback) {
    try {
      // Basic error boundary - in a real implementation, this would catch component errors
      return (
        <View 
          style={style} 
          accessibilityRole={role}
          accessibilityLabel={ariaLabel || accessibilityLabel}
          {...props}
        >
          {children}
        </View>
      );
    } catch (error) {
      return fallback();
    }
  }

  // Use TouchableOpacity if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity 
        style={style} 
        accessibilityRole={role}
        accessibilityLabel={ariaLabel || accessibilityLabel}
        onPress={onPress}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Default View component
  return (
    <View 
      style={style} 
      accessibilityRole={role}
      accessibilityLabel={ariaLabel || accessibilityLabel}
      {...props}
    >
      {children}
    </View>
  );
};
