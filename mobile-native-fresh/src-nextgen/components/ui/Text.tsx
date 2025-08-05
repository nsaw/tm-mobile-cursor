import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export interface TextProps extends Omit<RNTextProps, 'role'> {
  variant?: 'body' | 'heading' | 'title' | 'subtitle' | 'subheading' | 'heading2' | 'label' | 'caption' | 'muted' | 'tagline' | 'button' | 'section';
  size?: 'xs' | 'sm' | 'body' | 'lg' | 'xl' | 'heading' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  _style?: TextStyle;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  size,
  weight,
  _style, 
  children, 
  ..._props 
}) => {
  const theme = useTheme();
  
  const _getVariantStyle = (): TextStyle => {
    // Map missing variants to existing ones
    const mappedVariant = variant === 'subheading' ? 'subtitle' : 
                         variant === 'heading2' ? 'heading' : 
                         variant === 'label' ? 'caption' : 
                         variant;
    
    let baseStyle: TextStyle;
    
    switch (mappedVariant) {
      case 'heading':
        baseStyle = {
          fontSize: theme.fontSize.h1,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.text,
          lineHeight: theme.fontSize.h1 * 1.2,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text,
          lineHeight: theme.fontSize.lg * 1.4,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: theme.fontSize.body,
          fontWeight: theme.fontWeight.medium,
          color: theme.colors.textSecondary,
          lineHeight: theme.fontSize.body * 1.4,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: theme.fontSize.body,
          fontWeight: theme.fontWeight.normal,
          color: theme.colors.text,
          lineHeight: theme.fontSize.body * 1.4,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.normal,
          color: theme.colors.textSecondary,
          lineHeight: theme.fontSize.xs * 1.4,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.normal,
          color: theme.colors.textMuted,
          lineHeight: theme.fontSize.sm * 1.4,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: theme.fontSize.xl,
          fontWeight: theme.fontWeight.light,
          color: theme.colors.textSecondary,
          lineHeight: theme.fontSize.xl * 1.5,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
          color: theme.colors.text,
          lineHeight: theme.fontSize.sm * 1.4,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text,
          lineHeight: theme.fontSize.lg * 1.4,
        };
        break;
      default:
        baseStyle = {
          fontSize: theme.fontSize.body,
          fontWeight: theme.fontWeight.normal,
          color: theme.colors.text,
          lineHeight: theme.fontSize.body * 1.4,
        };
    }
    
    // Apply size override if provided
    if (size) {
      const sizeMap: Record<string, number> = {
        xs: theme.fontSize.xs,
        sm: theme.fontSize.sm,
        body: theme.fontSize.body,
        lg: theme.fontSize.lg,
        xl: theme.fontSize.xl,
        heading: theme.fontSize.h1,
        '2xl': theme.fontSize.h2,
        '3xl': theme.fontSize.h3,
      };
      baseStyle.fontSize = sizeMap[size] || baseStyle.fontSize;
    }
    
    // Apply weight override if provided
    if (weight) {
      baseStyle.fontWeight = (theme.fontWeight[weight as keyof typeof theme.fontWeight] || baseStyle.fontWeight);
    }
    
    return baseStyle;
  };

  return (
    <RNText><Text>{children}</Text></RNText>
  );
};

export const Heading: React.FC<Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 }> = ({
  level = 1,
  children,
  ...props
}) => {
  const getSize = () => {
    switch (level) {
      case 1: return 'heading';
      case 2: return '2xl';
      case 3: return 'xl';
      default: return 'heading';
    }
  };

  return (
    <Text
      variant="heading"
      size={getSize()}
      weight="bold"
      {...props}
    >
      {children}
    </Text>
  );
};

export const Subheading: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="subtitle" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" {...props} />
);

export const ButtonText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button" {...props} />
);

export const SectionHeader: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="section" {...props} />
); 