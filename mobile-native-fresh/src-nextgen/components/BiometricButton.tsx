import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, AccessibilityRole } from 'react-native';
import { ThemeColors } from '../types/theme';
import { Text as CustomText } from './Text';

export interface BiometricButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
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
  accessibilityRole = 'button' as AccessibilityRole,
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
          <CustomText variant="body" style={styles.icon}>
            {icon}
          </CustomText>
          <CustomText variant="body" style={{ ...styles.label, color: colors.text }}>
            {label}
          </CustomText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
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
