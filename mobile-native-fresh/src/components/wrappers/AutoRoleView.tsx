import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, AccessibilityProps, AccessibilityRole } from 'react-native';

import { classifyStyleRole, StyleRole } from '../../utils/styleRoleClassifier';
import { useTheme } from '../../theme/ThemeProvider';

interface Props extends AccessibilityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  forceRole?: StyleRole;
  accessible?: boolean;
  accessibilityLabel?: string;
};

const AutoRoleView: React.FC<Props> = ({
  children,
  style,
  forceRole,
  accessible = true,
  accessibilityLabel,
  ...accessibilityProps
}) => {
  const { tokens } = useTheme();
  const flattened = StyleSheet.flatten(style) || {};
  const role = forceRole || classifyStyleRole(flattened);

  const spacingStyles: ViewStyle = {
    ...(role === 'card' && {
      paddingVertical: tokens.spacing.lg,
      paddingHorizontal: tokens.spacing.lg
    }),
    ...(role === 'section' && {
      marginBottom: tokens.spacing.xl,
      paddingHorizontal: tokens.spacing.lg
    })
  };

  const combined = [flattened, spacingStyles];

  const baseProps = {
    accessible,
    accessibilityLabel,
    accessibilityRole: role === 'button-wrapper' ? ('button' as AccessibilityRole) : undefined,
    ...accessibilityProps
  };

  return (
    <View style={combined} {...baseProps}>
      {children}
    </View>
  );
};

export default AutoRoleView; 