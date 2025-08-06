import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';

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
          fontSize: 24,
          fontWeight: 'bold',
          color: '#1A1A1A',
          lineHeight: 32,
        };
        break;
      case 'title':
        baseStyle = {
          fontSize: 20,
          fontWeight: '600',
          color: '#1A1A1A',
          lineHeight: 28,
        };
        break;
      case 'subtitle':
        baseStyle = {
          fontSize: 16,
          fontWeight: '500',
          color: '#6C757D',
          lineHeight: 24,
        };
        break;
      case 'body':
        baseStyle = {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#1A1A1A',
          lineHeight: 24,
        };
        break;
      case 'caption':
        baseStyle = {
          fontSize: 12,
          fontWeight: 'normal',
          color: '#6C757D',
          lineHeight: 16,
        };
        break;
      case 'muted':
        baseStyle = {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#6C757D',
          lineHeight: 20,
        };
        break;
      case 'tagline':
        baseStyle = {
          fontSize: 18,
          fontWeight: '300',
          color: '#6C757D',
          lineHeight: 26,
        };
        break;
      case 'button':
        baseStyle = {
          fontSize: 14,
          fontWeight: '500',
          color: '#1A1A1A',
          lineHeight: 20,
        };
        break;
      case 'section':
        baseStyle = {
          fontSize: 20,
          fontWeight: '600',
          color: '#1A1A1A',
          lineHeight: 28,
        };
        break;
      default:
        baseStyle = {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#1A1A1A',
          lineHeight: 24,
        };
    }
    
    // Apply size override if provided
    if (size) {
      const sizeMap: Record<string, number> = {
        xs: 12,
        sm: 14,
        body: 16,
        lg: 18,
        xl: 20,
        heading: 24,
        '2xl': 28,
        '3xl': 32,
      };
      baseStyle.fontSize = sizeMap[size] || baseStyle.fontSize;
    }
    
    // Apply weight override if provided
    if (weight) {
      const weightMap: Record<string, TextStyle['fontWeight']> = {
        light: '300',
        normal: 'normal',
        medium: '500',
        semibold: '600',
        bold: 'bold',
      };
      baseStyle.fontWeight = weightMap[weight] || baseStyle.fontWeight;
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