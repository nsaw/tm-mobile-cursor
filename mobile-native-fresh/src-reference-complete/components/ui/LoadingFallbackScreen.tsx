import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';

import { Text } from './Text';

interface LoadingFallbackScreenProps {
  message?: string;
  showIcon?: boolean;
}

export const LoadingFallbackScreen: React.FC<LoadingFallbackScreenProps> = ({
  message = 'Loading content...',
  showIcon = true,
}) => {
  const { tokens: designTokens } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: designTokens.colors.background,
      padding: designTokens.spacing.xl,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginBottom: designTokens.spacing.lg,
    },
    message: {
      fontSize: designTokens.typography.fontSize.body,
      color: designTokens.colors.textSecondary,
      textAlign: 'center',
      marginTop: designTokens.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showIcon && (
          <View style={styles.icon}>
            <ActivityIndicator size="large" color={designTokens.colors.accent} />
          </View>
        )}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}; 