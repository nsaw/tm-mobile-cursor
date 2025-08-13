import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  _Image,

  TextStyle,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import type { FontWeight } from '../../theme/ThemeProvider';

// Convert require to ES6 import
// import logo from '../../../assets/logo.png';

export const PasswordResetScreen: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      // Mock password reset logic
      Alert.alert('Success', 'Password reset email sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email');
    }
  };

  const styles: Record<string, ViewStyle | TextStyle | ImageStyle> = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboard: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
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
      fontSize: theme.fontSize.h1,
      fontWeight: theme.fontWeight.bold as FontWeight,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.normal as FontWeight,
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
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold as FontWeight,
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
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.medium as FontWeight,
      color: theme.colors.text,
    },
  };

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
            {/* <Image source={logo as ImageSourcePropType} style={styles.logo} resizeMode="contain" /> */}
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
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Send password reset email"
            >
              <Text style={styles.primaryButtonText}>Send Reset Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                // Navigate back placeholder
                Alert.alert('Navigation', 'Back to Sign In');
              }}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Back to sign in"
            >
              <Text style={styles.secondaryButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 