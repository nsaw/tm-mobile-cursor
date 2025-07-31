import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  style, 
  children, 
  ...props 
}) => {
  const variantStyle = styles[variant];
  
  return (
    <RNText style={[variantStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 