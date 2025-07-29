import { Text ,
  View,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
// src/features/auth/screens/SignUp.tsx
import React, { useState } from 'react';
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
  const { tokens: designTokens } = useTheme();

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
      backgroundColor: colors.background,
      flex: 1,
    },
    divider: {
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: spacing.lg,
    },
    dividerLine: {
      backgroundColor: colors.border,
      flex: 1,
      height: 1,
    },
    dividerText: {
      marginHorizontal: spacing.sm,
      ...typography.body,
      color: colors.border,
    },
    formContainer: {
      backgroundColor: colors.card,
      borderRadius: designTokens.radius.md,
      elevation: 3,
      padding: spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    input: {
      borderColor: colors.border,
      borderRadius: designTokens.radius.md,
      borderWidth: 1,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm * 1.5,
    },
    keyboard: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
    },
    logo: {
      height: 100,
      width: 100,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    oauthButton: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: designTokens.radius.md,
      borderWidth: 1,
      marginBottom: spacing.sm,
      paddingVertical: spacing.sm * 2,
    },
    primaryButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: designTokens.radius.md,
      marginBottom: spacing.md,
      paddingVertical: spacing.sm * 1.5,
    },
    primaryButtonText: {
      ...typography.body,
      color: '#fff',
      fontWeight: '600',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    subtitle: {
      ...typography.body,
      color: colors.subtext,
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    title: {
      ...typography.heading,
      color: colors.text,
      marginBottom: spacing.sm,
      textAlign: 'center',
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
