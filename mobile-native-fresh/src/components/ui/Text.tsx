import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
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
  const { tokens } = useTheme();
  
  const getVariantStyle = () => {
    // Map missing variants to existing ones
    const mappedVariant = variant === 'subheading' ? 'subtitle' : 
                         variant === 'heading2' ? 'heading' : 
                         variant === 'label' ? 'caption' : 
                         variant;
    
    let baseStyle;
    switch (mappedVariant) {
      case 'heading':
        baseStyle = {
          fontSize: tokens.typography.fontSize.heading,
          fontWeight: tokens.typography.fontWeight.bold,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.heading * tokens.typography.lineHeight.tight,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.lg * tokens.typography.lineHeight.normal,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: tokens.typography.fontSize.body,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.textSecondary,
          lineHeight: tokens.typography.fontSize.body * tokens.typography.lineHeight.normal,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: tokens.typography.fontSize.body,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.body * tokens.typography.lineHeight.normal,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: tokens.typography.fontSize.xs,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.textSecondary,
          lineHeight: tokens.typography.fontSize.xs * tokens.typography.lineHeight.normal,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.textMuted,
          lineHeight: tokens.typography.fontSize.sm * tokens.typography.lineHeight.normal,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: tokens.typography.fontSize.xl,
          fontWeight: tokens.typography.fontWeight.light,
          color: tokens.colors.textSecondary,
          lineHeight: tokens.typography.fontSize.xl * tokens.typography.lineHeight.relaxed,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.sm * tokens.typography.lineHeight.normal,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.lg * tokens.typography.lineHeight.normal,
        };
        break;
      default:
        baseStyle = {
          fontSize: tokens.typography.fontSize.body,
          fontWeight: tokens.typography.fontWeight.normal,
          color: tokens.colors.text,
          lineHeight: tokens.typography.fontSize.body * tokens.typography.lineHeight.normal,
        };
    }

    // Apply size override if provided
    if (size && size in tokens.typography.fontSize) {
      const fontSize = tokens.typography.fontSize[size as keyof typeof tokens.typography.fontSize];
      baseStyle.fontSize = fontSize;
      baseStyle.lineHeight = (fontSize * tokens.typography.lineHeight.normal) as any;
    }

    // Apply weight override if provided
    if (weight && weight in tokens.typography.fontWeight) {
      baseStyle.fontWeight = tokens.typography.fontWeight[weight as keyof typeof tokens.typography.fontWeight];
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