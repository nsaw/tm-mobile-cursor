import { Text,
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
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';

const logo = require('../../../../assets/logo.png');

export const PasswordResetScreen: React.FC = () => {
  const { resetPassword, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { theme } = useTheme();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      Alert.alert(
        'Password Reset Sent',
        'Check your email for password reset instructions.'
      );
    } catch (err: any) {
      Alert.alert('Password Reset Failed', err.message);
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
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingVertical: theme.spacing.sm * 1.5,
      paddingHorizontal: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
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
    secondaryButton: {
      backgroundColor: 'transparent',
      borderRadius: 8,
      paddingVertical: theme.spacing.sm * 1.5,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryButtonText: {
      fontSize: theme.typography.fontSize.body,
      fontWeight: '500',
      color: theme.colors.text,
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
            <Image source={logo} style={styles.logo as any} resizeMode="contain" />
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePasswordReset}
              disabled={isLoading || loading}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading || loading ? 'Sending...' : 'Send Reset Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {/* TODO: Navigate back to SignIn */}}
            >
              <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 