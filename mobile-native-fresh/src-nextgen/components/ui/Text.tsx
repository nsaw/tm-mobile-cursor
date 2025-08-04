import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'heading' | 'title' | 'subtitle' | 'subheading' | 'heading2' | 'label' | 'caption' | 'muted' | 'tagline' | 'button' | 'section';
  size?: 'xs' | 'sm' | 'body' | 'lg' | 'xl' | 'heading' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  size,
  weight,
  style, 
  children, 
  ...props 
}) => {
  const { tokens: designTokens } = useTheme();
  
  const getVariantStyle = (): TextStyle => {
    // Map missing variants to existing ones
    const mappedVariant = variant === 'subheading' ? 'subtitle' : 
                         variant === 'heading2' ? 'heading' : 
                         variant === 'label' ? 'caption' : 
                         variant;
    
    let baseStyle: TextStyle;
    
    switch (mappedVariant) {
      case 'heading':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.heading,
          fontWeight: designTokens.typography.fontWeight.bold as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.heading * 1.2,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.lg * 1.4,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.medium as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.body * 1.4,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.body * 1.4,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xs,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xs * 1.4,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.textMuted,
          lineHeight: designTokens.typography.fontSize.sm * 1.4,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xl,
          fontWeight: designTokens.typography.fontWeight.light as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xl * 1.5,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.medium as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.sm * 1.4,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.lg * 1.4,
        };
        break;
      default:
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.body * 1.4,
        };
    }
    
    // Apply size override if provided
    if (size) {
      const sizeMap: Record<string, number> = {
        xs: designTokens.typography.fontSize.xs,
        sm: designTokens.typography.fontSize.sm,
        body: designTokens.typography.fontSize.body,
        lg: designTokens.typography.fontSize.lg,
        xl: designTokens.typography.fontSize.xl,
        heading: designTokens.typography.fontSize.heading,
        '2xl': designTokens.typography.fontSize['2xl'],
        '3xl': designTokens.typography.fontSize['3xl'],
      };
      baseStyle.fontSize = sizeMap[size] || baseStyle.fontSize;
    }
    
    // Apply weight override if provided
    if (weight) {
      baseStyle.fontWeight = (designTokens.typography.fontWeight[weight] || baseStyle.fontWeight) as any;
    }
    
    return baseStyle;
  };

  return (
    <RNText
      style={[getVariantStyle(), style]}
      {...props}
    >
      {children}
    </RNText>
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