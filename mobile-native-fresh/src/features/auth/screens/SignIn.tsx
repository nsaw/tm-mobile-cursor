import { Text ,
  View,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
// src/features/auth/screens/SignIn.tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { OAuthButton } from '../components/OAuthButton';
import { useTheme } from '../../../theme/ThemeProvider';
import { useGoogleAuth, signInWithApple } from '../hooks/useNativeSocialAuth';

const logo = require('../../../../assets/logo.png');

export const SignInScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();
  const { signIn, loading, signInWithDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { promptAsync: googlePromptAsync } = useGoogleAuth();

  const styles = getStyles(designTokens);

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await googlePromptAsync();
    } catch (err: any) {
      Alert.alert('Google Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (err: any) {
      Alert.alert('Apple Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithDemo();
    } catch (err: any) {
      Alert.alert('Demo Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>WELCOME TO THOUGHTMARKS!</Text>
        <Text style={styles.subtitle}>please sign in to continue</Text>

        <View style={styles.formContainer}>
          <LoginForm
            onSubmit={handleEmailSignIn}
            loading={isLoading || loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <OAuthButton
            provider="google"
            onPress={handleGoogleSignIn}
          />

          {Platform.OS === 'ios' && (
            <OAuthButton
              provider="apple"
              onPress={handleAppleSignIn}
            />
          )}

          {/* Demo Login Button */}
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDemoSignIn}
              disabled={isLoading || loading}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={styles.primaryButtonText}>Demo Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// tokens are passed from the parent component, useTheme is called in the component scope.
const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background,
    flex: 1,
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: tokens.spacing.lg,
  },
  dividerLine: {
    backgroundColor: tokens.colors.border,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body,
    marginHorizontal: tokens.spacing.sm,
  },
  formContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    elevation: 6,
    marginHorizontal: tokens.spacing.sm,
    padding: tokens.spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  input: {
    backgroundColor: tokens.colors.backgroundSecondary,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm * 1.5,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.md,
  },
  logo: {
    height: 120,
    width: 120,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.accent,
    borderRadius: 8,
    marginBottom: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm * 1.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: tokens.typography.fontSize.body,
    fontWeight: '600',
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    fontSize: tokens.typography.fontSize.body,
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
  },
  title: {
    color: tokens.colors.text,
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: tokens.typography.fontWeight.bold,
    marginBottom: tokens.spacing.sm,
    textAlign: 'center',
  },
});
