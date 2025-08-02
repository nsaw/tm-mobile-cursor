import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { useAccessibilityProps } from '../../hooks/useAccessibilityProps';
import { AutoRoleView } from '../AutoRoleView';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body2' | 'caption' | 'overline';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  numberOfLines?: number;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  truncate = false,
  numberOfLines,
  style,
  children,
  ...props
}) => {
  const { tokens } = useTheme();
  const accessibilityProps = useAccessibilityProps({
    role: 'text',
    label: typeof children === 'string' ? children : undefined,
  });

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: getFontSize(variant),
      fontWeight: tokens.typography.fontWeight[weight] as '400' | '500' | '600' | '700',
      color: getTextColor(color),
      textAlign: align,
    };

    return StyleSheet.create({
      text: baseStyle,
    }).text;
  };

  const getFontSize = (variant: TextProps['variant']) => {
    switch (variant) {
      case 'h1': return tokens.typography.fontSize.heading;
      case 'h2': return tokens.typography.fontSize.xl;
      case 'h3': return tokens.typography.fontSize.lg;
      case 'h4': return tokens.typography.fontSize.body;
      case 'h5': return tokens.typography.fontSize.sm;
      case 'h6': return tokens.typography.fontSize.xs;
      case 'body': return tokens.typography.fontSize.body;
      case 'body2': return tokens.typography.fontSize.sm;
      case 'caption': return tokens.typography.fontSize.xs;
      case 'overline': return tokens.typography.fontSize.xs;
      default: return tokens.typography.fontSize.body;
    }
  };

  const getTextColor = (color: TextProps['color']) => {
    switch (color) {
      case 'primary': return tokens.colors.text;
      case 'secondary': return tokens.colors.textSecondary;
      case 'tertiary': return tokens.colors.textSecondary;
      case 'error': return tokens.colors.error;
      case 'success': return tokens.colors.success;
      case 'warning': return tokens.colors.warning;
      case 'info': return tokens.colors.accent;
      default: return tokens.colors.text;
    }
  };

  const textStyle = getTextStyle();
  const finalNumberOfLines = truncate ? 1 : numberOfLines;

  return (
    <AutoRoleView {...accessibilityProps}>
      <RNText
        style={[textStyle, style]}
        numberOfLines={finalNumberOfLines}
        {...props}
      >
        {children}
      </RNText>
    </AutoRoleView>
  );
}; 