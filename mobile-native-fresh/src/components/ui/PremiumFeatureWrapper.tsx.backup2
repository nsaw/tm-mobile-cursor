import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';

import { Text } from './Text';
import { Button } from './Button';

interface PremiumFeatureWrapperProps {
  children: React.ReactNode;
  fallbackText?: string;
  onUpgrade?: () => void;
}

export const PremiumFeatureWrapper: React.FC<PremiumFeatureWrapperProps> = ({
  children,
  fallbackText = 'This feature is available for premium users. Upgrade to unlock.',
  onUpgrade,
}) => {
  const { user } = useAuth();
  const hasPremiumAccess = user?.isPremium || user?.isTestUser;
  const styles = getStyles(tokens);

  if (hasPremiumAccess) {
    return <>{children}</>;
  }

  return (
    <View style={styles.overlay}>
      <Text variant="heading" size="lg" style={styles.title}>
        Premium Feature
      </Text>
      <Text variant="body" size="lg" style={styles.subtitle}>
        {fallbackText}
      </Text>
      <Button
        variant="primary"
        size="lg"
        onPress={onUpgrade}
        style={styles.button}
      >
        <Text variant="body" size="lg" style={{ color: designTokens.colors.background, fontWeight: '700', textAlign: 'center' }}>
          Upgrade Now
        </Text>
      </Button>
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: designTokens.colors.background,
    padding: designTokens.spacing.xl,
  },
  title: {
    color: designTokens.colors.text,
    marginBottom: designTokens.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
    lineHeight: 22,
  },
  button: {
    width: 180,
    backgroundColor: designTokens.colors.accent,
  },
}); 