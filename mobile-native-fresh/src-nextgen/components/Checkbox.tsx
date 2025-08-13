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
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    textMuted: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    accent: '#007AFF',
    onAccent: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#8E8E93',
    onBackground: '#000000',
    onPrimary: '#FFFFFF',
    outline: '#C6C6C8',
    // Add missing properties
    danger: '#FF3B30',
    backgroundSecondary: '#F8F8F8',
    divider: '#E5E5EA',
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
      onPress={() => {
        if (!disabled) {
          onValueChange(!value);
        }
      }}
      disabled={disabled}
      accessibilityLabel="Button"
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
