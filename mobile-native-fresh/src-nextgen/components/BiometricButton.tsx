import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { ThemeColors } from '../types/theme';

export interface BiometricButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

export const BiometricButton: React.FC<BiometricButtonProps> = ({
  icon,
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
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
          backgroundColor: disabled ? colors.textSecondary : colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 