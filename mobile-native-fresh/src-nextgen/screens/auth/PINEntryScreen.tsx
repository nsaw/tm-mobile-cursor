import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { Text as CustomText } from '../../components/ui/Text';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';
import { createStyles } from './PINEntryScreen.styles';

export const PINEntryScreen: React.FC = () => {
  const { verifyPIN } = useAuth();
  const { colors } = useTheme();

  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handlePINChange = useCallback((value: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 6) {
      setPin(numericValue);
    }
  }, []);

  const handleVerifyPIN = useCallback(async () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter a 6-digit PIN.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyPIN(pin);
      Alert.alert('Success', 'PIN verified successfully!');
      // Navigate to next screen
    } catch (error) {
      Alert.alert('Error', 'Invalid PIN. Please try again.');
      setPin('');
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  }, [pin, verifyPIN]);

  const handleResendPIN = useCallback(() => {
    Alert.alert('PIN Resent', 'A new PIN has been sent to your device.');
  }, []);

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <AutoRoleView contentRole="text-display" style={styles.header}>
            <Text style={styles.title}>Enter PIN</Text>
          </AutoRoleView>

          <AutoRoleView contentRole="text-display" style={styles.subtitle}>
            <Text style={styles.subtitle}>Please enter your 4-digit PIN</Text>
          </AutoRoleView>

          <AutoRoleView contentRole="text-display" style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={pin}
                onChangeText={handlePINChange}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
                textAlign="center"
                accessibilityLabel="PIN input"
                accessibilityHint="Enter your 6-digit PIN"
                autoFocus
              />
            </View>

            <CustomText variant="caption" style={styles.hintText}>
              Enter the 6-digit PIN to verify your identity
            </CustomText>
          </AutoRoleView>

          <Button
            title="Verify PIN"
            onPress={handleVerifyPIN}
            disabled={pin.length !== 6 || isLoading}
            loading={isLoading}
            style={styles.verifyButton}
            accessibilityLabel="Verify PIN button"
            accessibilityHint="Tap to verify your PIN"
          />

          <AutoRoleView contentRole="text-display" style={styles.footer}>
            <CustomText variant="body" style={styles.footerText}>
              Didn't receive the PIN?{' '}
            </CustomText>
            <Button
              title="Resend PIN"
              onPress={handleResendPIN}
              style={styles.resendButton}
              accessibilityLabel="Resend PIN button"
              accessibilityHint="Tap to resend PIN"
            />
          </AutoRoleView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 
