import React from 'react';
import { Text as RNText, StyleSheet, AccessibilityRole } from 'react-native';

export interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  style?: React.ComponentProps<typeof RNText>['style'];
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  style,
  accessibilityRole = 'text',
  accessibilityLabel,
  accessibilityHint,
  numberOfLines,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      case 'body':
      default:
        return styles.body;
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <RNText
      style={[variantStyle, style]}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      numberOfLines={numberOfLines}
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