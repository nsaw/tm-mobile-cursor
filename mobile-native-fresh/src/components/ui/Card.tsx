import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { cardVariants, mergeVariantStyles } from '../../theme/variants';

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

  if (onPress && !disabled) {
    return (
      <View
        style={finalCardStyle}
        onTouchEnd={onPress}
        accessible={true}
        accessibilityRole="button"
      >
        {children}
      </View>
    );
  }

  return (
    <View style={finalCardStyle}>
      {children}
    </View>
  );
};

// Card sub-components for consistent layout
export const CardHeader: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  return (
    <View
      style={[
        {
          paddingBottom: tokens.spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: tokens.colors.divider,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  return (
    <View
      style={[
        {
          paddingTop: tokens.spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; style?: ViewStyle }> = ({
  children,
  style,
}) => {
  const { tokens } = useTheme();
  
  return (
    <View
      style={[
        {
          paddingTop: tokens.spacing.md,
          borderTopWidth: 1,
          borderTopColor: tokens.colors.divider,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}; 