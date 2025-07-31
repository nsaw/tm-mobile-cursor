// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PasswordStrength, PasswordRequirements } from '../hooks/usePasswordStrength';
import { ThemeColors } from '../types/theme';

export interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  requirements: PasswordRequirements;
  style?: any;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  strength,
  requirements,
  style,
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
        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
          {getStrengthText()}
        </Text>
      </View>
      {strength.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.map((feedback, index) => (
            <Text key={index} style={[styles.feedbackText, { color: colors.textSecondary }]}>
              • {feedback}
            </Text>
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