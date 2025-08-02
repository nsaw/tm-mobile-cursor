import React from 'react';
import { Text, TextProps } from './Text';
import { useAccessibilityProps } from '../../hooks/useAccessibilityProps';

export interface LabelProps extends Omit<TextProps, 'variant'> {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ 
  htmlFor, 
  required = false, 
  children, 
  ...props 
}) => {
  const accessibilityProps = useAccessibilityProps({
    role: 'text',
    label: typeof children === 'string' ? children : undefined,
  });

  return (
    <Text
      variant="body2"
      weight="medium"
      color="primary"
      {...accessibilityProps}
      {...props}
    >
      {children}
      {required && (
        <Text variant="caption" color="error" weight="bold">
          {' *'}
        </Text>
      )}
    </Text>
  );
}; 