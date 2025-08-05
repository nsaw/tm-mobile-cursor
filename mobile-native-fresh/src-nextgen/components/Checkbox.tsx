import React from 'react';
import { TouchableOpacity, View, StyleSheet, AccessibilityRole } from 'react-native';
import { ThemeColors } from '../types/theme';

export interface CheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'checkbox' as AccessibilityRole,
}) => {
  const colors: ThemeColors = {
    primary: '#007AFF',
    secondary: '#5E5CE6',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    textMuted: '#6C757D',
    border: '#DEE2E6',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    accent: '#007AFF',
    onAccent: '#FFFFFF',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#6C757D',
    onBackground: '#1A1A1A',
    onPrimary: '#FFFFFF',
    outline: '#DEE2E6',
  };

  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        {
          borderColor: disabled ? colors.textSecondary : colors.border,
          backgroundColor: value ? colors.primary : 'transparent',
        },
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ checked: value, disabled }}
    >
      {value && (
        <View style={styles.checkmark}>
          <View style={[styles.checkmarkLine, { backgroundColor: '#FFFFFF' }]} />
          <View style={[styles.checkmarkLine, { backgroundColor: '#FFFFFF' }]} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkLine: {
    position: 'absolute',
    width: 2,
    height: 6,
    borderRadius: 1,
  },
}); 
