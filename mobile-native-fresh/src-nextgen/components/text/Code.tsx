import React from 'react';
import { Text, TextProps } from './Text';
import { useTheme } from '../../theme';
import { StyleSheet } from 'react-native';

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
  const { tokens } = useTheme();

  const codeStyle = StyleSheet.create({
    code: {
      backgroundColor: tokens.colors.surface,
      paddingHorizontal: tokens.spacing.xs,
      paddingVertical: tokens.spacing.xs / 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    blockCode: {
      padding: tokens.spacing.sm,
      marginVertical: tokens.spacing.xs,
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