import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

type PinEntryScreenRouteProp = RouteProp<AuthStackParamList, 'PinEntry'>;

export const PinEntryScreen: React.FC = () => {
  const route = useRoute<PinEntryScreenRouteProp>();
  const theme = useTheme();
  const { verifyPin } = useAuth();
  const [pin, setPin] = useState('');

  const handleVerifyPin = async () => {
    try {
      const result = await verifyPin(pin, route.params.purpose);
      if (result.success) {
        // Navigation will be handled by auth state change
      } else {
        Alert.alert('PIN Error', 'Invalid PIN. Please try again.');
      }
    } catch (error) {
      Alert.alert('PIN Error', 'Invalid PIN. Please try again.');
    }
  };

  const handleResendPin = () => {
    // TODO: Implement resend PIN functionality
    Alert.alert('Resend PIN', 'PIN resent to your email');
  };

  const getTitle = () => {
    return route.params.purpose === 'verification' ? 'Verify Your Account' : 'Set Up PIN';
  };

  const getSubtitle = () => {
    return route.params.purpose === 'verification' 
      ? 'Enter the PIN sent to your email' 
      : 'Create a PIN for your account';
  };

  return (
    <AutoRoleView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{getTitle()}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {getSubtitle()}
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.pinInput, { 
              backgroundColor: theme.colors.surface, 
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            placeholder="Enter PIN"
            placeholderTextColor={theme.colors.textSecondary}
            value={pin}
            onChangeText={setPin}
            keyboardType="numeric"
            maxLength={6}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.verifyButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleVerifyPin}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.verifyButtonText, { color: theme.colors.onPrimary }]}>
              Verify PIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendPin}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.resendText, { color: theme.colors.primary }]}>
              Resend PIN
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
  },
  form: {
    marginBottom: 24,
  },
  pinInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
  },
});

// TODO: Implement full feature after navigation unblocked 
