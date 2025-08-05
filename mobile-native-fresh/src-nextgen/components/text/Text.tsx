import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';
import { useTheme } from '../../hooks/useTheme';

export interface TextPropsExtended extends Omit<TextProps, 'role'> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'body2' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'bold' | '600' | '700';
  role?: 'text' | 'heading' | 'label' | 'paragraph' | 'content' | 'element';
  _truncate?: boolean;
}

// Export TextProps for other components to use
export type { TextProps };

export const Text: React.FC<TextPropsExtended> = ({
  children,
  variant = 'body',
  color,
  align = 'left',
  weight,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  importantForAccessibility,
  _truncate,
  role,
  ..._props
}) => {
  const theme = useTheme();

  const _textStyle = [
    styles.text,
    styles[variant],
    { color: color || theme.colors.text },
    { textAlign: align },
    weight && { fontWeight: weight },
    style,
  ];

  // Map text-specific roles to AutoRoleView compatible roles
  const getAutoRoleViewRole = (textRole?: string): 'text' | 'content' | 'element' => {
    switch (textRole) {
      case 'heading':
        return 'text';
      case 'label':
        return 'text';
      case 'paragraph':
        return 'text';
      case 'content':
        return 'content';
      case 'element':
        return 'element';
      default:
        return 'text';
    }
  };

  const autoRoleViewRole = getAutoRoleViewRole(role);

  return (
    <AutoRoleView
      role={autoRoleViewRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState as Record<string, unknown>}
      importantForAccessibility={importantForAccessibility}
    >
      <RNText><Text>{children}</Text></RNText>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '400',
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
}); 