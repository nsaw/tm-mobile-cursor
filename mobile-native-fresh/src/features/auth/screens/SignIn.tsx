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
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

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
    <AutoRoleView role="group" accessibilityRole="none" style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AutoRoleView role="group" accessibilityRole="none" style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </AutoRoleView>

        <Text style={styles.title}>WELCOME TO THOUGHTMARKS!</Text>
        <Text style={styles.subtitle}>please sign in to continue</Text>

        <AutoRoleView role="group" accessibilityRole="none" style={styles.formContainer}>
          <LoginForm
            onSubmit={handleEmailSignIn}
            loading={isLoading || loading}
          />

          <AutoRoleView style={styles.divider}>
            <AutoRoleView style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <AutoRoleView style={styles.dividerLine} />
          </AutoRoleView>

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
          <AutoRoleView style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDemoSignIn}
              disabled={isLoading || loading}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={styles.primaryButtonText}>Demo Login</Text>
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      </KeyboardAvoidingView>
    </AutoRoleView>
  );
};

// tokens are passed from the parent component, useTheme is called in the component scope.
const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: tokens.typography.fontSize.heading,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
  },
  formContainer: {
    backgroundColor: tokens.colors.surface,
    borderRadius: 16,
    padding: tokens.spacing.md,
    marginHorizontal: tokens.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    backgroundColor: tokens.colors.backgroundSecondary,
    color: tokens.colors.text,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm * 1.5,
    paddingHorizontal: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  primaryButton: {
    backgroundColor: tokens.colors.accent,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm * 1.5,
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  primaryButtonText: {
    fontSize: tokens.typography.fontSize.body,
    color: '#ffffff',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: tokens.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.colors.border,
  },
  dividerText: {
    marginHorizontal: tokens.spacing.sm,
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
  },
});
