import React from 'react';
import { Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { ActionButton } from '../AutoRoleView';

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'brand';
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
}

export function Button({ 
  title,
  children,
  style,
  variant = 'primary',
  leftIcon,
  ...props 
}: ButtonProps) {
  const theme = useTheme();

  // Use title if provided, otherwise use children
  const buttonContent = title || children;

  // Apply variant and size styles through the style prop
  const buttonStyle = {
    ...style,
    // Add variant-specific styles here if needed
    ...(variant === 'outline' && { borderWidth: 1, borderColor: theme.tokens.colors.border }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
    ...(variant === 'destructive' && { backgroundColor: theme.tokens.colors.accent }),
    ...(variant === 'brand' && { backgroundColor: theme.tokens.colors.accent }),
  };

  return (
    <ActionButton 
      style={buttonStyle} 
      {...props}
    >
      {leftIcon}
      <Text style={{ 
        color: theme.tokens.colors.buttonText,
        fontSize: theme.tokens.typography.fontSize.body,
        fontWeight: theme.tokens.typography.fontWeight.medium,
      }}>
        {buttonContent}
      </Text>
    </ActionButton>
  );
}