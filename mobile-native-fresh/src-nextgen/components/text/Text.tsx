import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';
import { useTheme } from '../../theme/ThemeProvider';

export interface TextPropsExtended extends Omit<TextProps, 'role'> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | '600' | '700';
  role?: 'text' | 'heading' | 'label' | 'paragraph';
}

export const Text: React.FC<TextPropsExtended> = ({
  children,
  variant = 'body',
  color,
  align = 'left',
  weight,
  role = 'text',
  style,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  importantForAccessibility,
  ...props
}) => {
  const { theme } = useTheme();

  const textStyle = [
    styles.text,
    styles[variant],
    { color: color || theme.colors.text },
    { textAlign: align },
    weight && { fontWeight: weight },
    style,
  ];

  const getAutoRoleViewRole = (): 'text' => {
    return 'text';
  };

  return (
    <AutoRoleView
      role={getAutoRoleViewRole()}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState as Record<string, unknown>}
      importantForAccessibility={importantForAccessibility}
    >
      <RNText style={textStyle} {...props}>
        {children}
      </RNText>
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
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
}); 