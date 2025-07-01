import React from 'react';
import { View, ViewProps, AccessibilityRole } from 'react-native';

interface AutoRoleViewProps extends Omit<ViewProps, 'accessibilityRole' | 'role'> {
  role?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessible?: boolean;
}

export const AutoRoleView: React.FC<AutoRoleViewProps> = ({
  role: _role, // Unused but kept for future role-based styling
  accessibilityRole,
  accessibilityLabel,
  accessible = true,
  style,
  children,
  ...props
}) => {
  return (
    <View
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      {...props}
    >
      {children}
    </View>
  );
}; 