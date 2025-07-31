import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, AccessibilityRole } from 'react-native';
import { ThemeColors } from '../types/theme';

export interface PINInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length: number;
  showValue?: boolean;
  onToggleVisibility?: () => void;
  disabled?: boolean;
  error?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: any;
}

export const PINInput = forwardRef<TextInput, PINInputProps>((
  {
    value,
    onChangeText,
    length,
    showValue = false,
    onToggleVisibility,
    disabled = false,
    error = false,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'text' as AccessibilityRole,
    accessibilityState,
  },
  ref
) => {
  const colors: ThemeColors = {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6C757D',
    primary: '#007AFF',
    error: '#DC3545',
    border: '#DEE2E6',
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < length; i++) {
      const isFilled = i < value.length;
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: isFilled ? colors.primary : 'transparent',
              borderColor: error ? colors.error : colors.border,
            },
          ]}
        >
          {isFilled && (
            <Text style={[styles.dotText, { color: colors.primary }]}>•</Text>
          )}
        </View>
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        style={styles.hiddenInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={length}
        secureTextEntry={!showValue}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
      />
      <View style={styles.dotsContainer}>{renderDots()}</View>
      {onToggleVisibility && (
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={onToggleVisibility}
          disabled={disabled}
          accessibilityLabel={showValue ? 'Hide PIN' : 'Show PIN'}
          accessibilityRole="button"
        >
          <Text style={[styles.visibilityText, { color: colors.textSecondary }]}>
            {showValue ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  visibilityButton: {
    position: 'absolute',
    right: -40,
    top: 0,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibilityText: {
    fontSize: 16,
  },
});

PINInput.displayName = 'PINInput'; 