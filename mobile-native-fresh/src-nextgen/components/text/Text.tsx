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
  const { theme } = useTheme();
  const accessibilityProps = useAccessibilityProps({
    role: 'text',
    label: typeof children === 'string' ? children : undefined,
  });

  const getTextStyle = () => {
    const baseStyle = {
      fontFamily: theme.typography.fontFamily[weight],
      fontSize: getFontSize(variant),
      fontWeight: theme.typography.fontWeight[weight],
      lineHeight: getLineHeight(variant),
      color: getTextColor(color),
      textAlign: align,
    };

    return StyleSheet.create({
      text: baseStyle,
    }).text;
  };

  const getFontSize = (variant: TextProps['variant']) => {
    switch (variant) {
      case 'h1': return theme.typography.fontSize.xxl;
      case 'h2': return theme.typography.fontSize.xl;
      case 'h3': return theme.typography.fontSize.lg;
      case 'h4': return theme.typography.fontSize.md;
      case 'h5': return theme.typography.fontSize.sm;
      case 'h6': return theme.typography.fontSize.xs;
      case 'body': return theme.typography.fontSize.md;
      case 'body2': return theme.typography.fontSize.sm;
      case 'caption': return theme.typography.fontSize.xs;
      case 'overline': return theme.typography.fontSize.xs;
      default: return theme.typography.fontSize.md;
    }
  };

  const getLineHeight = (variant: TextProps['variant']) => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return theme.typography.lineHeight.tight;
      case 'h4':
      case 'h5':
      case 'h6':
        return theme.typography.lineHeight.normal;
      case 'body':
      case 'body2':
        return theme.typography.lineHeight.relaxed;
      case 'caption':
      case 'overline':
        return theme.typography.lineHeight.normal;
      default:
        return theme.typography.lineHeight.normal;
    }
  };

  const getTextColor = (color: TextProps['color']) => {
    switch (color) {
      case 'primary': return theme.colors.text;
      case 'secondary': return theme.colors.textSecondary;
      case 'tertiary': return theme.colors.textSecondary;
      case 'error': return theme.colors.error;
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.text;
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