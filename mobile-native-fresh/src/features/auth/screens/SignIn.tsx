// src/features/auth/screens/SignIn.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { OAuthButton } from '../components/OAuthButton';
import { colors, spacing, typography } from '../../../theme/theme';

const logo = require('../../../../assets/logo.png');

export const SignInScreen: React.FC = () => {
  const { signIn, signInWithGoogle, signInWithApple, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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
      await signInWithGoogle();
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
            inputStyle={styles.input}
            buttonStyle={styles.primaryButton}
            buttonTextStyle={styles.primaryButtonText}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <OAuthButton
            provider="google"
            onPress={handleGoogleSignIn}
            loading={isLoading || loading}
            style={styles.oauthButton}
            textStyle={styles.oauthButtonText}
          />

          {Platform.OS === 'ios' && (
            <OAuthButton
              provider="apple"
              onPress={handleAppleSignIn}
              loading={isLoading || loading}
              style={styles.oauthButton}
              textStyle={styles.oauthButtonText}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginHorizontal: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    backgroundColor: colors.inputBackground,   // NEW
    color: colors.text,                        // NEW
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm * 1.5,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.sm * 1.5,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    ...typography.body,
    color: '#ffffff',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    ...typography.body,
    color: colors.subtext,                    // switched to subtext
  },
  oauthButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm * 1.5,
    marginBottom: spacing.md,
  },
  oauthButtonText: {
    ...typography.body,
    color: colors.text,
  },
})
