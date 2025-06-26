import React, { useState } from 'react';
import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { getButtonVariants, mergeVariantStyles } from '../../theme/variants';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    onPress,
    children,
    style,
    textStyle,
    leftIcon,
    rightIcon,
  } = props;
  const { tokens } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  // Get variant styles
  const buttonVariants = getButtonVariants(tokens);
  const baseStyle = buttonVariants.base;
  const variantStyle = buttonVariants.variants.variant[variant];
  const sizeStyle = buttonVariants.variants.size[size];

  // Merge all styles
  const buttonStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

  // Only allow margin and padding to be overridden by style prop, not borderRadius
  const { margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical, padding, paddingTop, paddingBottom, paddingLeft, paddingRight, paddingHorizontal, paddingVertical, ...restStyle } = style || {};
  const finalButtonStyle = {
    ...buttonStyle,
    opacity: disabled ? 0.5 : 1,
    backgroundColor: variant === 'primary' && isPressed 
      ? `${tokens.colors.accent}CC`
      : buttonStyle.backgroundColor,
    // Only allow margin and padding overrides
    ...(margin !== undefined ? { margin } : {}),
    ...(marginTop !== undefined ? { marginTop } : {}),
    ...(marginBottom !== undefined ? { marginBottom } : {}),
    ...(marginLeft !== undefined ? { marginLeft } : {}),
    ...(marginRight !== undefined ? { marginRight } : {}),
    ...(marginHorizontal !== undefined ? { marginHorizontal } : {}),
    ...(marginVertical !== undefined ? { marginVertical } : {}),
    ...(padding !== undefined ? { padding } : {}),
    ...(paddingTop !== undefined ? { paddingTop } : {}),
    ...(paddingBottom !== undefined ? { paddingBottom } : {}),
    ...(paddingLeft !== undefined ? { paddingLeft } : {}),
    ...(paddingRight !== undefined ? { paddingRight } : {}),
    ...(paddingHorizontal !== undefined ? { paddingHorizontal } : {}),
    ...(paddingVertical !== undefined ? { paddingVertical } : {}),
    // Ignore all other style overrides (restStyle)
  };

  // Text color based on variant
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return tokens.colors.accent;
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
      onPressIn={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Button"
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
              fontSize: tokens.typography.fontSize.lg,
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