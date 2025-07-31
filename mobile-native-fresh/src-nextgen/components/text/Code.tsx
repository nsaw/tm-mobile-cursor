import React from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '../../theme';

import { Text, TextProps } from './Text';

export interface CodeProps extends Omit<TextProps, 'variant'> {
  children: React.ReactNode;
  block?: boolean;
}

export const Code: React.FC<CodeProps> = ({ 
  children, 
  block = false, 
  style, 
  ...props 
}) => {
  const { theme } = useTheme();

  const codeStyle = StyleSheet.create({
    blockCode: {
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.sm,
    },
    code: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      fontFamily: 'System',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
    },
  });

  return (
    <Text
      variant="body2"
      weight="normal"
      color="primary"
      style={[
        codeStyle.code,
        block && codeStyle.blockCode,
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 