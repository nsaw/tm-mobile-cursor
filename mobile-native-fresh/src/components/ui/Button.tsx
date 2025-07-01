import React, { useState } from 'react';
import { Pressable, ViewStyle, TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { getButtonVariants, mergeVariantStyles } from '../../theme/variants';

import { ButtonText } from './Text';
import { AutoRoleView } from './AutoRoleView';

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
  const { tokens: designTokens } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  // Get variant styles
  const buttonVariants = getButtonVariants(designTokens);
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
      ? `${designTokens.colors.accent}CC`
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
        return designTokens.colors.accent;
      case 'secondary':
        return designTokens.colors.text;
      case 'outline':
        return designTokens.colors.text;
      case 'ghost':
        return designTokens.colors.text;
      case 'destructive':
        return designTokens.colors.danger;
      case 'brand':
        return designTokens.colors.brand;
      default:
        return designTokens.colors.text;
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
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Button"
      android_ripple={{
        color: designTokens.colors.surfaceHover,
        borderless: false,
      }}
    >
      {leftIcon && (
        <ButtonText style={{ marginRight: designTokens.spacing.sm, color: textColor }}>
          {leftIcon}
        </ButtonText>
      )}
      
      {typeof children === 'string' ? (
        <ButtonText
          style={{
            color: textColor,
            textAlign: 'center',
            ...textStyle,
          }}
        >
          {children}
        </ButtonText>
      ) : (
        children
      )}
      
      {rightIcon && (
        <ButtonText style={{ marginLeft: designTokens.spacing.sm, color: textColor }}>
          {rightIcon}
        </ButtonText>
      )}
    </Pressable>
  );
};