import React from 'react';
import { Text, TextPropsExtended } from './Text';
import { useTheme } from '../../hooks/useTheme';
import { StyleSheet, TextStyle } from 'react-native';

export interface CodeProps extends Omit<TextPropsExtended, 'variant' | 'role'> {
  children: React.ReactNode;
  block?: boolean;
  role?: 'text' | 'label';
  style?: TextStyle;
}

export const Code: React.FC<CodeProps> = ({ 
  children, 
  block = false, 
  style,
  role = 'text',
  ...props 
}) => {
  const theme = useTheme();

  const codeStyle = StyleSheet.create({
    code: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    blockCode: {
      padding: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
    },
  });

  return (
    <Text
      variant="body2"
      weight="normal"
      style={[
        codeStyle.code,
        block && codeStyle.blockCode,
        { color: theme.colors.primary },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}; 