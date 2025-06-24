import React, { useState } from 'react';
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
  const [isPressed, setIsPressed] = useState(false);

  // Get variant styles
  const baseStyle = buttonVariants.base;
  const variantStyle = buttonVariants.variants.variant[variant];
  const sizeStyle = buttonVariants.variants.size[size];

  // Merge all styles
  const buttonStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

  // Apply disabled state and press state
  const finalButtonStyle = {
    ...buttonStyle,
    opacity: disabled ? 0.5 : 1,
    // Add 80% opacity fill for primary button when pressed
    backgroundColor: variant === 'primary' && isPressed 
      ? `${tokens.colors.accent}CC` // 80% opacity (CC = 204/255)
      : buttonStyle.backgroundColor,
    ...style,
  };

  // Text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return tokens.colors.accent; // Blue text for outline style
      case 'secondary':
        return tokens.colors.text;
      case 'outline':
        return tokens.colors.text;
      case 'ghost':
        return tokens.colors.text;
      case 'destructive':
        return tokens.colors.danger;
      case 'brand':
        return tokens.colors.brand;
      default:
        return tokens.colors.text;
    }
  };

  const textColor = getTextColor();

  return (
    <Pressable
      style={finalButtonStyle}
      onPress={disabled ? undefined : onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
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