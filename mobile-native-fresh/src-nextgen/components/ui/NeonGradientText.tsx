import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface NeonGradientTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  glow?: boolean;
}

export const NeonGradientText: React.FC<NeonGradientTextProps> = ({
  children,
  variant = 'primary',
  size = 'body',
  weight = 'normal',
  glow = true,
  style,
  ...props
}) => {
  const { colors, fontSize, fontWeight } = useTheme();

  const getColor = () => {
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs':
        return fontSize.xs;
      case 'sm':
        return fontSize.sm;
      case 'md':
        return fontSize.md;
      case 'lg':
        return fontSize.lg;
      case 'xl':
        return fontSize.xl;
      case 'h1':
        return fontSize.h1;
      case 'h2':
        return fontSize.h2;
      case 'h3':
        return fontSize.h3;
      case 'body':
        return fontSize.body;
      case 'caption':
        return fontSize.caption;
      default:
        return fontSize.body;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'light':
        return fontWeight.light;
      case 'normal':
        return fontWeight.normal;
      case 'medium':
        return fontWeight.medium;
      case 'semibold':
        return fontWeight.semibold;
      case 'bold':
        return fontWeight.bold;
      default:
        return fontWeight.normal;
    }
  };

  const textStyle = {
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    color: getColor(),
    textShadowColor: glow ? getColor() : 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: glow ? 8 : 0,
  };

  return (
    <Text style={[styles.text, textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'transparent',
  },
});
