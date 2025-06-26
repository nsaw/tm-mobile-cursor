import React from 'react';
import { Text as RNText, TextStyle, Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { getTextVariants, mergeVariantStyles } from '../../theme/variants';

interface TextProps {
  variant?: 'body' | 'heading' | 'title' | 'subtitle' | 'caption' | 'muted' | 'tagline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

// Runtime guard to prevent circular usage
const textComponentStack = new Set();

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  size,
  children,
  style,
  color,
  weight,
  align = 'left',
  numberOfLines,
  ellipsizeMode,
}) => {
  const { tokens } = useTheme();

  // Runtime guard: Check for circular usage
  const componentId = Math.random().toString(36).substr(2, 9);
  if (textComponentStack.has(componentId)) {
    console.error('🚨 CIRCULAR TEXT USAGE DETECTED!');
    console.error('The Text component is being used recursively, which causes infinite loops.');
    console.error('Stack trace:', new Error().stack);
    throw new Error(
      'Circular usage of Text component detected. This causes infinite recursion. ' +
      'Check for patterns like <Text><Text>{children}</Text></Text> or similar nested Text usage.'
    );
  }

  // Add to stack for this render
  textComponentStack.add(componentId);

  try {
  // Get variant styles
  const textVariants = getTextVariants(tokens);
  const baseStyle = textVariants.base;
  const variantStyle = textVariants.variants.variant[variant];
  const sizeStyle = size ? textVariants.variants.size[size] : {};

  // Merge all styles
  const textStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

  // Apply custom overrides
  const finalTextStyle = {
    ...textStyle,
    color: color || textStyle.color,
    fontWeight: weight ? tokens.typography.fontWeight[weight] : textStyle.fontWeight,
    textAlign: align,
    ...style,
  };

  return (
      <RNText><Text>{children}</Text></RNText>
  );
  } finally {
    // Always remove from stack, even if an error occurs
    textComponentStack.delete(componentId);
  }
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

// 'tagline' variant is for secondary/subtitle text (onboarding descriptions, empty state subtitles, etc) 