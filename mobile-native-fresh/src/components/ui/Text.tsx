import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { getTextVariants, mergeVariantStyles } from '../../theme/variants';

interface TextProps {
  variant?: 'body' | 'heading' | 'heading2' | 'subheading' | 'caption' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

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
    <RNText
      style={finalTextStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
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
  <Text variant="subheading" {...props} />
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