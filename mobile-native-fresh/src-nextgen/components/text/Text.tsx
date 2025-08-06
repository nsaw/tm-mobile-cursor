import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body2' | 'caption' | 'overline';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  numberOfLines?: number;
  children: React.ReactNode;
}

export interface TextPropsExtended extends TextProps {
  _truncate?: boolean;
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
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: getFontSize(variant),
      fontWeight: getFontWeight(weight),
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
      case 'h1': return 32;
      case 'h2': return 28;
      case 'h3': return 24;
      case 'h4': return 20;
      case 'h5': return 18;
      case 'h6': return 16;
      case 'body': return 16;
      case 'body2': return 14;
      case 'caption': return 12;
      case 'overline': return 12;
      default: return 16;
    }
  };

  const getFontWeight = (weight: TextProps['weight']): TextStyle['fontWeight'] => {
    switch (weight) {
      case 'normal': return 'normal';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return 'bold';
      default: return 'normal';
    }
  };

  const getLineHeight = (variant: TextProps['variant']) => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
        return 1.2;
      case 'h4':
      case 'h5':
      case 'h6':
        return 1.4;
      case 'body':
      case 'body2':
        return 1.6;
      case 'caption':
      case 'overline':
        return 1.4;
      default:
        return 1.4;
    }
  };

  const getTextColor = (color: TextProps['color']) => {
    switch (color) {
      case 'primary': return '#1A1A1A';
      case 'secondary': return '#6C757D';
      case 'tertiary': return '#6C757D';
      case 'error': return '#DC3545';
      case 'success': return '#28A745';
      case 'warning': return '#FFC107';
      case 'info': return '#17A2B8';
      default: return '#1A1A1A';
    }
  };

  const textStyle = getTextStyle();
  const finalNumberOfLines = truncate ? 1 : numberOfLines;

  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={finalNumberOfLines}
      {...props}
    >
      {children}
    </RNText>
  );
}; 