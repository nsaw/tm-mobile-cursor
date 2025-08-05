import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

type PasswordResetScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'PasswordReset'>;

export const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation<PasswordResetScreenNavigationProp>();
  const theme = useTheme();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    }
  };

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <AutoRoleView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Enter your email address and we&apos;ll send you a link to reset your password
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface, 
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleResetPassword}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.resetButtonText, { color: theme.colors.onPrimary }]}>
              Send Reset Email
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBackToSignIn} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.backToSignInText, { color: theme.colors.primary }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  resetButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  backToSignInText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// TODO: Implement full feature after navigation unblocked 