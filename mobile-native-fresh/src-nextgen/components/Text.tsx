import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export interface TextProps extends RNTextProps {
  variant?: 'body' | 'heading' | 'title' | 'subtitle' | 'subheading' | 'heading2' | 'label' | 'caption' | 'muted' | 'tagline' | 'button' | 'section';
  size?: 'xs' | 'sm' | 'body' | 'lg' | 'xl' | 'heading' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
  contentRole?: 'text-display' | 'text-label' | 'text-caption' | 'text-heading';
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  size,
  weight,
  style, 
  children,
  contentRole = 'text-display',
  ...props 
}) => {
  const { designTokens } = useTheme();
  
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
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.heading * designTokens.typography.lineHeights.tight,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold as any,
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.lg * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.medium as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xs,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xs * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.textMuted,
          lineHeight: designTokens.typography.fontSize.sm * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xl,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xl * designTokens.typography.lineHeights.relaxed,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.medium as any,
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.sm * designTokens.typography.lineHeights.normal,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold as any,
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.lg * designTokens.typography.lineHeights.normal,
        };
        break;
      default:
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal as any,
          color: designTokens.colors.text.primary,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeights.normal,
        };
    }

    // Apply size override if provided
    if (size && size in designTokens.typography.fontSize) {
      const fontSize = designTokens.typography.fontSize[size as keyof typeof designTokens.typography.fontSize];
      baseStyle.fontSize = fontSize;
      baseStyle.lineHeight = fontSize * designTokens.typography.lineHeights.normal;
    }

    // Apply weight override if provided
    if (weight && weight in designTokens.typography.fontWeight) {
      baseStyle.fontWeight = designTokens.typography.fontWeight[weight as keyof typeof designTokens.typography.fontWeight] as any;
    }

    return baseStyle;
  };

  // Determine content role based on variant
  const getContentRole = (): string => {
    if (variant === 'heading' || variant === 'title' || variant === 'section') {
      return 'text-heading';
    }
    if (variant === 'label') {
      return 'text-label';
    }
    if (variant === 'caption' || variant === 'muted') {
      return 'text-caption';
    }
    return contentRole;
  };

  return (
    <RNText
      style={[getVariantStyle(), style]}
      accessibilityRole="text"
      accessibilityLabel={`${getContentRole()}: ${typeof children === 'string' ? children : ''}`}
      {...props}
    >
      {children}
    </RNText>
  );
};

// Convenience components for common text patterns
export const Heading: React.FC<Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 }> = ({
  level = 1,
  children,
  ...props
}) => {
  const getSize = () => {
    switch (level) {
      case 1: return '3xl';
      case 2: return '2xl';
      case 3: return 'xl';
      default: return '2xl';
    }
  };

  return (
    <Text
      variant="heading"
      size={getSize()}
      weight="bold"
      contentRole="text-heading"
      {...props}
    >
      {children}
    </Text>
  );
};

export const Subheading: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="subtitle" contentRole="text-heading" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body" contentRole="text-display" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" contentRole="text-caption" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" contentRole="text-label" {...props} />
);

export const ButtonText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button" contentRole="text-display" {...props} />
);

export const SectionHeader: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="section" contentRole="text-heading" {...props} />
); 