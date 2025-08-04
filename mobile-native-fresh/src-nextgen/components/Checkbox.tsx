import React from 'react';
import { TouchableOpacity, View, StyleSheet, AccessibilityRole } from 'react-native';
import { ThemeColors } from '../types/theme';

export interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
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
