import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { buttonVariants, mergeVariantStyles } from '../../theme/variants';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPress,
  children,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const { tokens } = useTheme();

  // Get variant styles
  const baseStyle = buttonVariants.base;
  const variantStyle = buttonVariants.variants.variant[variant];
  const sizeStyle = buttonVariants.variants.size[size];

  // Merge all styles
  const buttonStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

  // Apply disabled state
  const finalButtonStyle = {
    ...buttonStyle,
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  // Text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'destructive':
      case 'brand':
        return tokens.colors.text;
      case 'secondary':
      case 'outline':
        return tokens.colors.text;
      case 'ghost':
        return tokens.colors.text;
      default:
        return tokens.colors.text;
    }
  };

  const textColor = getTextColor();

  return (
    <Pressable
      style={finalButtonStyle}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      android_ripple={{
        color: tokens.colors.surfaceHover,
        borderless: false,
      }}
    >
      {leftIcon && (
        <Text style={{ marginRight: tokens.spacing.sm, color: textColor }}>
          {leftIcon}
        </Text>
      )}
      
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              color: textColor,
              fontSize: tokens.typography.fontSize.body,
              fontWeight: tokens.typography.fontWeight.medium,
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      
      {rightIcon && (
        <Text style={{ marginLeft: tokens.spacing.sm, color: textColor }}>
          {rightIcon}
        </Text>
      )}
    </Pressable>
  );
};