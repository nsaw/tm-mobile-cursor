// src/features/auth/screens/SignUp.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { RegistrationForm } from '../components/RegistrationForm';
import { OAuthButton } from '../components/OAuthButton';

const logo = require('/Users/sawyer/gitSync/thoughtmarks-mobile/mobile-native-fresh/assets/AppIcon.png');

export const SignUpScreen = () => {
  const { signUp, signInWithGoogle, signInWithApple, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setIsLoading(true);
      await signUp(email, password, firstName, lastName);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign Up Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Apple Sign Up Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Thoughtmarks to get started</Text>

          <View style={styles.formContainer}>
            <RegistrationForm
              onSubmit={handleEmailSignUp}
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
              onPress={handleGoogleSignUp}
              loading={isLoading || loading}
              style={styles.oauthButton}
              textStyle={styles.oauthButtonText}
              text="Continue with Google"
            />

            {Platform.OS === 'ios' && (
              <OAuthButton
                provider="apple"
                onPress={handleAppleSignUp}
                loading={isLoading || loading}
                style={styles.oauthButton}
                textStyle={styles.oauthButtonText}
                text="Continue with Apple"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const BRAND = '#007AFF';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboard: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },

  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 100, height: 100 },

  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#1a1a1a' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: '#666' },

  formContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: BRAND,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
  dividerText: { marginHorizontal: 12, fontSize: 14, color: '#999' },

  oauthButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  oauthButtonText: { color: '#333', fontSize: 16, fontWeight: '500' },
});
