import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../features/auth/hooks/useAuth';

import { Text } from './Text';
import { Button } from './Button';

interface SessionHydrationGuardProps {
  children: React.ReactNode;
}

export const SessionHydrationGuard: React.FC<SessionHydrationGuardProps> = ({ children }) => {
  const { tokens: designTokens } = useTheme();
  const { loading } = useAuth();
  const [hydrationTimeout, setHydrationTimeout] = useState(false);
  const [hydrationError, setHydrationError] = useState<string | null>(null);

  useEffect(() => {
    // Set a timeout for hydration (10 seconds)
    const timeout = setTimeout(() => {
      if (loading) {
        setHydrationTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading]);

  // Reset timeout state when loading completes
  useEffect(() => {
    if (!loading) {
      setHydrationTimeout(false);
      setHydrationError(null);
    }
  }, [loading]);

  const handleRetry = () => {
    setHydrationTimeout(false);
    setHydrationError(null);
    // Force a re-render by updating loading state
    window.location.reload();
  };

  const styles = getStyles(designTokens);

  // Show loading screen while hydrating
  if (loading && !hydrationTimeout && !hydrationError) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="heading" size="lg" style={styles.title}>
            Loading Thoughtmarks...
          </Text>
          <Text variant="body" size="lg" style={styles.subtitle}>
            Please wait while we restore your session
          </Text>
        </View>
      </View>
    );
  }

  // Show timeout error screen
  if (hydrationTimeout) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="heading" size="lg" style={styles.title}>
            Session Timeout
          </Text>
          <Text variant="body" size="lg" style={styles.subtitle}>
            It&apos;s taking longer than expected to restore your session. This might be due to a slow connection.
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
              onPress={handleRetry}
              variant="primary"
              size="lg"
            >
              <Text variant="body" size="lg">Retry</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // Show hydration error screen
  if (hydrationError) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="heading" size="lg" style={styles.title}>
            Session Error
          </Text>
          <Text variant="body" size="lg" style={styles.subtitle}>
            {hydrationError}
          </Text>
          <View style={styles.buttonContainer}>
            <Button 
              onPress={handleRetry}
              variant="primary"
              size="lg"
            >
              <Text variant="body" size="lg">Retry</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // Show children when hydration is complete
  return <>{children}</>;
};

// tokens are passed from the parent component, useTheme is called in the component scope.
const getStyles = (tokens: any) => StyleSheet.create({
  buttonContainer: {
    maxWidth: 200,
    width: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    lineHeight: 24,
    marginBottom: tokens.spacing.xl,
    textAlign: 'center',
  },
  title: {
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    textAlign: 'center',
  },
}); 