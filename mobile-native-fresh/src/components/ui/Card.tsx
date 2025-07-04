import React from 'react';
import { View, ViewStyle, Text } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { getCardVariants, mergeVariantStyles } from '../../theme/variants';

interface CardProps {
  variant?: 'default' | 'glass' | 'elevated' | 'interactive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  children,
  style,
  onPress,
  disabled = false,
}) => {
  const { tokens } = useTheme();

  // Get variant styles
  const cardVariants = getCardVariants(tokens);
  const baseStyle = cardVariants.base;
  const variantStyle = cardVariants.variants.variant[variant];
  const sizeStyle = cardVariants.variants.size[size];

  // Merge all styles
  const cardStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

  // Apply interactive state
  const finalCardStyle = {
    ...cardStyle,
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  // Handle string children by wrapping them in Text
  const renderChildren = () => {
    if (typeof children === 'string') {
      return (
        <Text style={{
          color: tokens.colors.text,
          fontSize: tokens.typography.fontSize.body,
        }}>
          {children}
        </Text>
      );
    }
    return children;
  };

  if (onPress && !disabled) {
    return (
      <View><Text>{renderChildren()}</Text></View>
    );
  }

  return (
    <View><Text>{renderChildren()}</Text></View>
  );
};

// Card sub-components for consistent layout
export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  // Handle string children by wrapping them in Text
  const renderChildren = () => {
    if (typeof children === 'string') {
      return (
        <Text style={{
          color: tokens.colors.text,
          fontSize: tokens.typography.fontSize.lg,
          fontWeight: tokens.typography.fontWeight.semibold,
        }}>
          {children}
        </Text>
      );
    }
    return children;
  };
  
  return (
    <View><Text>{renderChildren()}</Text></View>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  // Handle string children by wrapping them in Text
  const renderChildren = () => {
    if (typeof children === 'string') {
      return (
        <Text style={{
          color: tokens.colors.text,
          fontSize: tokens.typography.fontSize.body,
        }}>
          {children}
        </Text>
      );
    }
    return children;
  };
  
  return (
    <View><Text>{renderChildren()}</Text></View>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  // Handle string children by wrapping them in Text
  const renderChildren = () => {
    if (typeof children === 'string') {
      return (
        <Text style={{
          color: tokens.colors.text,
          fontSize: tokens.typography.fontSize.body,
        }}>
          {children}
        </Text>
      );
    }
    return children;
  };
  
  return (
    <View><Text>{renderChildren()}</Text></View>
  );
}; 