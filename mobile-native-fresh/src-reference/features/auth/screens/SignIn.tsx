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

// import { useAuth } from '../hooks/useAuth'; // TEMPORARILY DISABLED
// import { LoginForm } from '../components/LoginForm'; // TEMPORARILY DISABLED
// import { OAuthButton } from '../components/OAuthButton'; // TEMPORARILY DISABLED
import { useTheme } from '../../../theme/ThemeProvider';
// import { useGoogleAuth, signInWithApple } from '../hooks/useNativeSocialAuth'; // TEMPORARILY DISABLED

const logo = require('../../../../assets/logo.png');

export const SignInScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();
  // const { signIn, loading, signInWithDemo } = useAuth(); // TEMPORARILY DISABLED
  const [isLoading, setIsLoading] = useState(false);
  // const { promptAsync: googlePromptAsync } = useGoogleAuth(); // TEMPORARILY DISABLED

  const styles = getStyles(designTokens);

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[SIGNIN] Email sign in attempted:', email);
      // await signIn(email, password); // TEMPORARILY DISABLED
      Alert.alert('Sign In', 'Firebase auth temporarily disabled for testing');
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('[SIGNIN] Google sign in attempted');
      // await googlePromptAsync(); // TEMPORARILY DISABLED
      Alert.alert('Sign In', 'Google auth temporarily disabled for testing');
    } catch (err: any) {
      Alert.alert('Google Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('[SIGNIN] Apple sign in attempted');
      // await signInWithApple(); // TEMPORARILY DISABLED
      Alert.alert('Sign In', 'Apple auth temporarily disabled for testing');
    } catch (err: any) {
      Alert.alert('Apple Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('[SIGNIN] Demo sign in attempted');
      // await signInWithDemo(); // TEMPORARILY DISABLED
      Alert.alert('Sign In', 'Demo auth temporarily disabled for testing');
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
          {/* TEMPORARILY DISABLED: LoginForm component
          <LoginForm
            onSubmit={handleEmailSignIn}
            loading={isLoading || loading}
          />
          */}

          <View style={styles.simpleForm}>
            <Text style={styles.formText}>Email/Password form temporarily disabled</Text>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleDemoSignIn}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>
                {isLoading ? 'Loading...' : 'Demo Sign In (Test)'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* TEMPORARILY DISABLED: OAuthButton component
          <OAuthButton
            provider="google"
            onPress={handleGoogleSignIn}
            loading={isLoading}
          />
          <OAuthButton
            provider="apple"
            onPress={handleAppleSignIn}
            loading={isLoading}
          />
          */}

          <View style={styles.simpleOAuth}>
            <TouchableOpacity 
              style={styles.oauthButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.oauthButtonText}>
                {isLoading ? 'Loading...' : 'Google Sign In (Test)'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.oauthButton}
              onPress={handleAppleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.oauthButtonText}>
                {isLoading ? 'Loading...' : 'Apple Sign In (Test)'}
              </Text>
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
  simpleForm: {
    marginBottom: tokens.spacing.md,
  },
  formText: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  demoButton: {
    backgroundColor: tokens.colors.accent,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm * 1.5,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: tokens.typography.fontSize.body,
    color: '#ffffff',
    fontWeight: '600',
  },
  simpleOAuth: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: tokens.spacing.sm,
  },
  oauthButton: {
    backgroundColor: tokens.colors.accent,
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm * 1.5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: tokens.spacing.sm,
  },
  oauthButtonText: {
    fontSize: tokens.typography.fontSize.body,
    color: '#ffffff',
    fontWeight: '600',
  },
});
