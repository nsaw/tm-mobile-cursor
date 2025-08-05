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
