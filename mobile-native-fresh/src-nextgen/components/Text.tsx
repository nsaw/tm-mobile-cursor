import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

import { ThemeColors } from '../types/theme';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  style?: any;
  accessibilityRole?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  style,
  accessibilityRole = 'text',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const colors: ThemeColors = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    primary: '#007AFF',
    error: '#DC3545',
    border: '#DEE2E6',
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      default:
        return styles.body;
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: colors.text },
        style,
      ]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
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
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 