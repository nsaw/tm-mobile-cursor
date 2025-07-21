import React from 'react';
import { Text } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { ActionButton } from '../components/AutoRoleView';

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'brand';
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
  interactiveRole?: 'button-action' | 'button-secondary' | 'button-destructive';
}

export function Button({ 
  title,
  children,
  style,
  variant = 'primary',
  leftIcon,
  interactiveRole = 'button-action',
  ...props 
}: ButtonProps) {
  const theme = useTheme();

  // Use title if provided, otherwise use children
  const buttonContent = title || children;

  // Apply variant and size styles through the style prop
  const buttonStyle = {
    ...style,
    // Add variant-specific styles here if needed
    ...(variant === 'outline' && { borderWidth: 1, borderColor: theme.designTokens.colors.border }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
    ...(variant === 'destructive' && { backgroundColor: theme.designTokens.colors.accent }),
    ...(variant === 'brand' && { backgroundColor: theme.designTokens.colors.accent }),
  };

  // Determine role based on variant and interactiveRole prop
  const role = variant === 'destructive' ? 'button-destructive' : interactiveRole;

  return (
    <ActionButton 
      style={buttonStyle} 
      {...props}
    >
      {leftIcon}
      <Text style={{ 
        color: theme.designTokens.colors.buttonText,
        fontSize: theme.designTokens.typography.fontSize.body,
        fontWeight: theme.designTokens.typography.fontWeight.medium as any,
      }}>
        {buttonContent}
      </Text>
    </ActionButton>
  );
} 