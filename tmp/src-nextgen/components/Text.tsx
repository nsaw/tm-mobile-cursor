import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { AutoRoleView, ContentRole } from '../shell/wrappers/AutoRoleView';

export interface TextProps extends RNTextProps {
  variant?: 'display' | 'heading' | 'body' | 'caption' | 'label';
  size?: 'small' | 'medium' | 'large' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success';
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  children: React.ReactNode;
}

/**
 * Text - Content text component with role assignment
 * 
 * This component is migrated to nextgen with contentRole="text-display"
 * assignment, providing proper accessibility and role-based styling.
 * 
 * Usage:
 * <Text variant="heading" size="large">Hello World</Text>
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size = 'medium',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    styles[size],
    weight === 'medium' ? styles.mediumWeight : styles[weight],
    styles[color],
    styles[align],
    style,
  ];

  // Determine content role based on variant
  const getContentRole = (): ContentRole => {
    switch (variant) {
      case 'display':
      case 'heading':
        return 'text-heading';
      case 'label':
        return 'text-label';
      case 'caption':
        return 'text-caption';
      default:
        return 'text-display';
    }
  };

  return (
    <AutoRoleView contentRole={getContentRole()}>
      <RNText
        style={textStyle}
        {...props}
        accessibilityRole="text"
      >
        {children}
      </RNText>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  
  // Variants
  display: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heading: {
    fontWeight: '600',
    letterSpacing: -0.25,
  },
  body: {
    fontWeight: '400',
    letterSpacing: 0,
  },
  caption: {
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  label: {
    fontWeight: '500',
    letterSpacing: 0,
  },
  
  // Sizes
  small: {
    fontSize: 12,
    lineHeight: 16,
  },
  medium: {
    fontSize: 16,
    lineHeight: 22,
  },
  large: {
    fontSize: 20,
    lineHeight: 28,
  },
  xl: {
    fontSize: 24,
    lineHeight: 32,
  },
  
  // Weights
  normal: {
    fontWeight: '400',
  },
  mediumWeight: {
    fontWeight: '500',
  },
  semibold: {
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
  
  // Colors
  primary: {
    color: '#000000',
  },
  secondary: {
    color: '#6B7280',
  },
  tertiary: {
    color: '#9CA3AF',
  },
  accent: {
    color: '#007AFF',
  },
  error: {
    color: '#EF4444',
  },
  success: {
    color: '#10B981',
  },
  
  // Alignment
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
});

export default Text; 