// src/features/auth/screens/SignUp.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth, signInWithApple } from '../hooks/useNativeSocialAuth';
import { RegistrationForm } from '../components/RegistrationForm';
import { OAuthButton } from '../components/OAuthButton';
import { colors, spacing, typography } from '../../../theme/theme';
import { useTheme } from '../../../theme/ThemeProvider';

const logo = require('../../../../assets/logo.png');

export const SignUpScreen: React.FC = () => {
  const { signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { promptAsync: googlePromptAsync } = useGoogleAuth();
  const { tokens } = useTheme();

  const handleEmailSignUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setIsLoading(true);
      await signUp(email, password, firstName, lastName);
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await googlePromptAsync();
    } catch (err: any) {
      Alert.alert('Google Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (err: any) {
      Alert.alert('Apple Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboard: {
      flex: 1,
      paddingHorizontal: spacing.md,
      justifyContent: 'center',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    logo: {
      width: 100,
      height: 100,
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
      borderRadius: tokens.radius.md,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
      paddingVertical: spacing.sm * 1.5,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: tokens.radius.md,
      paddingVertical: spacing.sm * 1.5,
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    primaryButtonText: {
      ...typography.body,
      color: '#fff',
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
      color: colors.border,
    },
    oauthButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: tokens.radius.md,
      paddingVertical: spacing.sm * 2,
      marginBottom: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Thoughtmarks to get started</Text>

          <View style={styles.formContainer}>
            <RegistrationForm
              onSubmit={handleEmailSignUp}
              loading={isLoading || loading}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <OAuthButton
              provider="google"
              onPress={handleGoogleSignUp}
              loading={isLoading || loading}
            />

            {Platform.OS === 'ios' && (
              <OAuthButton
                provider="apple"
                onPress={handleAppleSignUp}
                loading={isLoading || loading}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
