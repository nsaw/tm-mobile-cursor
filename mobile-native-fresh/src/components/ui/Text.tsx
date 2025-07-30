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
          fontWeight: designTokens.typography.fontWeight.bold,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.heading * designTokens.typography.lineHeight.tight,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.lg * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.medium,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xs,
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xs * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.textMuted,
          lineHeight: designTokens.typography.fontSize.sm * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.xl,
          fontWeight: designTokens.typography.fontWeight.light,
          color: designTokens.colors.textSecondary,
          lineHeight: designTokens.typography.fontSize.xl * designTokens.typography.lineHeight.relaxed,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.medium,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.sm * designTokens.typography.lineHeight.normal,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.lg * designTokens.typography.lineHeight.normal,
        };
        break;
      default:
        baseStyle = {
          fontSize: designTokens.typography.fontSize.body,
          fontWeight: designTokens.typography.fontWeight.normal,
          color: designTokens.colors.text,
          lineHeight: designTokens.typography.fontSize.body * designTokens.typography.lineHeight.normal,
        };
    }

    // Apply size override if provided
    if (size && size in designTokens.typography.fontSize) {
      const fontSize = designTokens.typography.fontSize[size as keyof typeof designTokens.typography.fontSize];
      baseStyle.fontSize = fontSize;
      baseStyle.lineHeight = fontSize * designTokens.typography.lineHeight.normal;
    }

    // Apply weight override if provided
    if (weight && weight in designTokens.typography.fontWeight) {
      baseStyle.fontWeight = designTokens.typography.fontWeight[weight as keyof typeof designTokens.typography.fontWeight];
    }

    return baseStyle;
  };

  return (
    <RNText><Text>{children}</Text></RNText>
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
  <Text variant="caption" {...props} />
);

export const ButtonText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="button" {...props} />
);

export const SectionHeader: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="section" {...props} />
);

// 'tagline' variant is for secondary/subtitle text (onboarding descriptions, empty state subtitles, etc) 