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
  const { signIn, loading, signInWithDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { promptAsync: googlePromptAsync } = useGoogleAuth();

  const styles = getStyles(tokens);

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
              accessibilityRole="button" 
              accessible={true} 
              accessibilityLabel="Demo Login"
            >
              <Text style={styles.primaryButtonText}>Demo Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background,
  },
  keyboard: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.md,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: designTokens.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: designTokens.typography.fontSize.heading,
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.text,
    textAlign: 'center',
    marginBottom: designTokens.spacing.sm,
  },
  subtitle: {
    fontSize: designTokens.typography.fontSize.body,
    color: designTokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: designTokens.spacing.lg,
  },
  formContainer: {
    backgroundColor: designTokens.colors.surface,
    borderRadius: 16,
    padding: designTokens.spacing.md,
    marginHorizontal: designTokens.spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  input: {
    backgroundColor: designTokens.colors.backgroundSecondary,
    color: designTokens.colors.text,
    borderWidth: 1,
    borderColor: designTokens.colors.border,
    borderRadius: 8,
    paddingVertical: designTokens.spacing.sm * 1.5,
    paddingHorizontal: designTokens.spacing.md,
    marginBottom: designTokens.spacing.md,
  },
  primaryButton: {
    backgroundColor: designTokens.colors.accent,
    borderRadius: 8,
    paddingVertical: designTokens.spacing.sm * 1.5,
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  primaryButtonText: {
    fontSize: designTokens.typography.fontSize.body,
    color: '#ffffff',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: designTokens.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: designTokens.colors.border,
  },
  dividerText: {
    marginHorizontal: designTokens.spacing.sm,
    fontSize: designTokens.typography.fontSize.body,
    color: designTokens.colors.textSecondary,
  },
});
