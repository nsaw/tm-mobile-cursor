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
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { OAuthButton } from '../components/OAuthButton';

// Replace with your actual logo file
const logo = require('/Users/sawyer/gitSync/thoughtmarks-mobile/mobile-native-fresh/assets/AppIcon.png');

export const SignInScreen = () => {
  const { signIn, signInWithGoogle, signInWithApple, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithApple();
    } catch (error: any) {
      Alert.alert('Apple Sign In Failed', error.message);
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
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Welcome to Thoughtmarks</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

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

const BRAND = '#007AFF';
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboard: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 120, height: 120 },

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
