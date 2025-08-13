import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, AccessibilityRole, Text } from 'react-native';
import { ThemeColors } from '../types/theme';
import { Text as CustomText } from './Text';

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
  accessibilityState?: object;
}

export const PINInput = forwardRef<TextInput, PINInputProps>(
  (
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
              <CustomText variant="caption" style={{ ...styles.dotText, color: colors.primary }}>
                •
              </CustomText>
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
          accessibilityLabel="Button"
          accessibilityHint={accessibilityHint}
          accessibilityRole={accessibilityRole}
          accessibilityState={accessibilityState}
        />
        <View><Text>{renderDots()}</Text></View>
        {onToggleVisibility && (
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={onToggleVisibility}
            disabled={disabled}
            accessibilityLabel="Button"
            accessibilityRole="button"
           accessible={true}>
            <CustomText><Text>{showValue ? '👁️' : '👁️‍🗨️'}</Text></CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

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
