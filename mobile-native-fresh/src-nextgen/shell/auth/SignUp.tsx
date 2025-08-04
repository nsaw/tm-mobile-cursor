import { Text ,
  View,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';

const logo = require('../../../../assets/logo.png');

export const SignUpScreen: React.FC = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleEmailSignUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setIsLoading(true);
      await signUp(firstName + ' ' + lastName, email, password);
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      // Mock Google sign up for now
      console.log('Google sign up requested');
    } catch (err: any) {
      Alert.alert('Google Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    try {
      setIsLoading(true);
      // Mock Apple sign up for now
      console.log('Apple sign up requested');
    } catch (err: any) {
      Alert.alert('Apple Sign Up Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboard: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      justifyContent: 'center',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    logo: {
      width: 100,
      height: 100,
    },
    title: {
      fontSize: theme.typography.fontSize.heading,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.body,
      fontWeight: 'normal',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    formContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingVertical: theme.spacing.sm * 1.5,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.colors.accent,
      borderRadius: 8,
      paddingVertical: theme.spacing.sm * 1.5,
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    primaryButtonText: {
      fontSize: theme.typography.fontSize.body,
      fontWeight: '600',
      color: '#fff',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      marginHorizontal: theme.spacing.sm,
      fontSize: theme.typography.fontSize.body,
      fontWeight: 'normal',
      color: theme.colors.border,
    },
    oauthButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingVertical: theme.spacing.sm * 2,
      marginBottom: theme.spacing.sm,
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
            <View style={styles.input}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={theme.colors.textSecondary}
                style={{ color: theme.colors.text }}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry
                style={{ color: theme.colors.text }}
              />
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleEmailSignUp('test@example.com', 'password')}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.oauthButton}
              onPress={handleGoogleSignUp}
            >
              <Text style={{ color: theme.colors.text }}>Sign up with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.oauthButton}
                onPress={handleAppleSignUp}
              >
                <Text style={{ color: theme.colors.text }}>Sign up with Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 