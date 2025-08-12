import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PasswordStrength, PasswordRequirements } from '../hooks/usePasswordStrength';
import { ThemeColors } from '../types/theme';
import { Text as CustomText } from './Text';

export interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  requirements: PasswordRequirements;
  style?: object;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  style,
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

  const getStrengthColor = () => {
    if (strength.score <= 2) return colors.error;
    if (strength.score <= 3) return '#FFC107';
    return '#28A745';
  };

  const getStrengthText = () => {
    if (strength.score <= 2) return 'Weak';
    if (strength.score <= 3) return 'Fair';
    return 'Strong';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progress,
              {
                width: `${(strength.score / 5) * 100}%`,
                backgroundColor: getStrengthColor(),
              },
            ]}
          />
        </View>
        <CustomText><Text>{getStrengthText()}</Text></CustomText>
      </View>
      {strength.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.map((feedback, index) => (
            <CustomText key={index}><Text>• {feedback}</Text></CustomText>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
  },
  feedbackContainer: {
    marginTop: 4,
  },
  feedbackText: {
    fontSize: 11,
    lineHeight: 14,
  },
}); 
