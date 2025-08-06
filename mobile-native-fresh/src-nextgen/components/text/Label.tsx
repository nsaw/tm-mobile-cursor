import React from 'react';
import { AccessibilityRole } from 'react-native';
import { Text, TextPropsExtended } from './Text';
import { useAccessibilityProps } from '../../hooks/useAccessibilityProps';
import { useTheme } from '../../hooks/useTheme';

export interface LabelProps extends Omit<TextPropsExtended, 'variant' | 'role'> {
  required?: boolean;
  children: React.ReactNode;
  role?: 'text' | 'label';
}

export const Label: React.FC<LabelProps> = ({ 
  required = false, 
  children,
  role = 'label',
  ...props 
}) => {
  const theme = useTheme();
  const accessibilityProps = useAccessibilityProps({
    role: role as AccessibilityRole,
    label: typeof children === 'string' ? children : undefined,
  });

  return (
    <Text
      variant="body2"
      weight="medium"
      style={{ color: theme.colors.primary }}
      {...accessibilityProps}
      {...props}
    >
      {children}
      {required && (
        <Text variant="caption" style={{ color: theme.colors.error }} weight="bold">
          {' *'}
        </Text>
      )}
    </Text>
  );
}; 