import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { ThemeColors } from '../types/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: any;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
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

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.textSecondary : colors.primary,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 