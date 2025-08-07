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

interface SignInScreenProps {
  onAuthenticationSuccess?: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onAuthenticationSuccess }) => {
  const { tokens: designTokens } = useTheme();
  // const { signIn, loading, signInWithDemo } = useAuth(); // TEMPORARILY DISABLED
  const [isLoading, setIsLoading] = useState(false);
  // const { promptAsync: googlePromptAsync } = useGoogleAuth(); // TEMPORARILY DISABLED

  // Runtime validation hook
  React.useEffect(() => {
    console.log('🔐 Legacy SignInScreen initialized - Runtime validation active');
    console.log('📊 Legacy SignInScreen state:', {
      isLoading,
      hasDesignTokens: !!designTokens,
      tokensKeys: designTokens ? Object.keys(designTokens).length : 0
    });
  }, [isLoading, designTokens]);

  const styles = getStyles(designTokens);

  const handleEmailSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('[LEGACY-SIGNIN] Email sign in attempted:', email);
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
      console.log('[LEGACY-SIGNIN] Google sign in attempted');
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
      console.log('[LEGACY-SIGNIN] Apple sign in attempted');
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
      console.log('[LEGACY-SIGNIN] Demo sign in attempted');
      // await signInWithDemo(); // TEMPORARILY DISABLED
      Alert.alert('Sign In', 'Demo auth temporarily disabled for testing');
    } catch (err: any) {
      Alert.alert('Demo Sign In Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassLogin = async () => {
    try {
      setIsLoading(true);
      console.log('[LEGACY-SIGNIN] Bypass login attempted');
      
      // Simulate successful authentication
      setTimeout(() => {
        console.log('[LEGACY-SIGNIN] Bypass login successful');
        Alert.alert(
          'Legacy App - Bypass Login',
          'Authentication successful! This is the legacy app version.\n\nNote: Legacy app has limited functionality for comparison purposes.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('[LEGACY-SIGNIN] User acknowledged bypass login');
                // Call the success callback to advance to main app
                if (onAuthenticationSuccess) {
                  onAuthenticationSuccess();
                }
              }
            }
          ]
        );
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      Alert.alert('Bypass Login Failed', err.message);
      setIsLoading(false);
    }
  };

  const handleSwitchToNextGen = () => {
    Alert.alert(
      'Switch to NextGen',
      'Switch to NextGen app version?\n\nThis will require restarting the Expo server.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch to NextGen',
          onPress: () => {
            console.log('[LEGACY-SIGNIN] User requested switch to NextGen');
            Alert.alert(
              'Manual Switch Required',
              'To switch to NextGen mode:\n\n1. Stop Expo server (Ctrl+C)\n2. Set EXPO_PUBLIC_USE_NEXTGEN=true\n3. Restart: npx expo start --ios --clear',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Dual Mount Toggle */}
      <TouchableOpacity
        style={[styles.dualMountToggle, { backgroundColor: designTokens.colors.surface }]}
        onPress={handleSwitchToNextGen}
      >
        <Text style={[styles.dualMountText, { color: designTokens.colors.text }]}>
          🚀 Switch to NextGen
        </Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>WELCOME TO THOUGHTMARKS!</Text>
        <Text style={styles.subtitle}>please sign in to continue</Text>
        <Text style={styles.legacyNote}>📱 Legacy App Version</Text>

        <View style={styles.formContainer}>
          {/* TEMPORARILY DISABLED: LoginForm component
          <LoginForm
            onSubmit={handleEmailSignIn}
            loading={isLoading || loading}
          />
          */}

          <View style={styles.simpleForm}>
            <Text style={styles.formText}>Email/Password form temporarily disabled</Text>
            
            {/* Working Bypass Login Button */}
            <TouchableOpacity 
              style={styles.bypassButton}
              onPress={handleBypassLogin}
              disabled={isLoading}
            >
              <Text style={styles.bypassButtonText}>
                {isLoading ? 'Loading...' : '🔓 Bypass Login (Legacy)'}
              </Text>
            </TouchableOpacity>

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
  dualMountToggle: {
    position: 'absolute',
    top: 50,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    zIndex: 1000,
  },
  dualMountText: {
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: tokens.spacing.sm,
  },
  legacyNote: {
    fontSize: tokens.typography.fontSize.body,
    color: tokens.colors.accent,
    textAlign: 'center',
    marginBottom: tokens.spacing.lg,
    fontWeight: '600',
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
  bypassButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: tokens.spacing.sm * 1.5,
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  bypassButtonText: {
    fontSize: tokens.typography.fontSize.body,
    color: '#ffffff',
    fontWeight: '600',
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
