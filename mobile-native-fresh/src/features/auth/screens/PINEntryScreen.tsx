import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../../theme/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '../../../navigation/types';

type PINEntryRouteProp = RouteProp<'PINEntry'>;

interface PINEntryScreenProps {
  route: PINEntryRouteProp;
}

export const PINEntryScreen: React.FC<PINEntryScreenProps> = ({
  onSuccess,
  onCancel,
  isSetup = false,
}) => {
  const { tokens } = useTheme();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const pinInputRef = useRef<TextInput>(null);
  const confirmPinInputRef = useRef<TextInput>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    keyboard: {
      flex: 1,
      paddingHorizontal: tokens.spacing.lg,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xl,
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
    pinContainer: {
      alignItems: 'center',
      marginBottom: tokens.spacing.xl,
    },
    pinInput: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 8,
      color: tokens.colors.text,
      backgroundColor: tokens.colors.surface,
      borderWidth: 2,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      minWidth: 200,
      marginBottom: tokens.spacing.md,
    },
    pinInputFocused: {
      borderColor: tokens.colors.accent,
    },
    pinInputError: {
      borderColor: '#ff4444',
    },
    confirmPinInput: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 8,
      color: tokens.colors.text,
      backgroundColor: tokens.colors.surface,
      borderWidth: 2,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      minWidth: 200,
      marginBottom: tokens.spacing.md,
    },
    errorText: {
      color: '#ff4444',
      fontSize: tokens.typography.fontSize.xs,
      textAlign: 'center',
      marginBottom: tokens.spacing.md,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: tokens.spacing.lg,
    },
    button: {
      backgroundColor: tokens.colors.accent,
      borderRadius: tokens.radius.md,
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.xl,
      minWidth: 120,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: tokens.colors.border,
      opacity: 0.6,
    },
    buttonText: {
      color: tokens.colors.buttonText,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.semibold,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    cancelButtonText: {
      color: tokens.colors.textSecondary,
    },
    pinDots: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: tokens.spacing.md,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: tokens.colors.border,
      marginHorizontal: 4,
    },
    dotFilled: {
      backgroundColor: tokens.colors.accent,
    },
  });

  useEffect(() => {
    // Auto-focus PIN input on mount
    setTimeout(() => {
      pinInputRef.current?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    // Auto-advance to confirm PIN when setup mode and PIN is 4 digits
    if (isSetup && pin.length === 4 && !isConfirming) {
      setIsConfirming(true);
      setTimeout(() => {
        confirmPinInputRef.current?.focus();
      }, 100);
    }
  }, [pin, isSetup, isConfirming]);

  const validatePIN = (pinValue: string) => {
    if (pinValue.length !== 4) {
      return 'PIN must be 4 digits';
    }
    if (!/^\d{4}$/.test(pinValue)) {
      return 'PIN must contain only numbers';
    }
    return null;
  };

  const handlePINChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setPin(numericValue);
      setError('');
    }
  };

  const handleConfirmPINChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setConfirmPin(numericValue);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (isSetup) {
      // Setup mode - validate both PINs match
      const pinError = validatePIN(pin);
      if (pinError) {
        setError(pinError);
        return;
      }

      const confirmError = validatePIN(confirmPin);
      if (confirmError) {
        setError(confirmError);
        return;
      }

      if (pin !== confirmPin) {
        setError('PINs do not match');
        return;
      }

      setLoading(true);
      try {
        // TODO: Store PIN securely (e.g., in Keychain/Keystore)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate storage
        onSuccess();
      } catch (error) {
        setError('Failed to save PIN');
      } finally {
        setLoading(false);
      }
    } else {
      // Verification mode
      const pinError = validatePIN(pin);
      if (pinError) {
        setError(pinError);
        return;
      }

      setLoading(true);
      try {
        // TODO: Verify PIN against stored value
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification
        onSuccess();
      } catch (error) {
        setError('Invalid PIN');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel PIN Setup',
      'Are you sure you want to cancel? You can set up your PIN later in Settings.',
      [
        { text: 'Continue Setup', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: onCancel },
      ]
    );
  };

  const renderPinDots = (pinValue: string) => (
    <View style={styles.pinDots}>
      {[0, 1, 2, 3].map((index) => (
        <View><Text>))}</Text></View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {isSetup ? 'Set Up PIN' : 'Enter PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {isSetup
              ? 'Create a 4-digit PIN to secure your account'
              : 'Enter your 4-digit PIN to continue'}
          </Text>
        </View>

        <View style={styles.pinContainer}>
          {!isConfirming ? (
            <>
              <TextInput
                ref={pinInputRef}
                style={[
                  styles.pinInput,
                  pinInputRef.current?.isFocused() && styles.pinInputFocused,
                  error && styles.pinInputError,
                ]}
                value={pin}
                onChangeText={handlePINChange}
                placeholder="0000"
                placeholderTextColor={tokens.colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                autoFocus={true}
              />
              {renderPinDots(pin)}
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>Confirm your PIN</Text>
              <TextInput
                ref={confirmPinInputRef}
                style={[
                  styles.confirmPinInput,
                  confirmPinInputRef.current?.isFocused() && styles.pinInputFocused,
                  error && styles.pinInputError,
                ]}
                value={confirmPin}
                onChangeText={handleConfirmPINChange}
                placeholder="0000"
                placeholderTextColor={tokens.colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
                autoFocus={true}
              />
              {renderPinDots(confirmPin)}
            </>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.buttonContainer}>
          {isSetup && (
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
             accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (loading || (isSetup ? !pin || !confirmPin : !pin)) &&
                styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              loading || (isSetup ? !pin || !confirmPin : !pin)
            }
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            {loading ? (
              <ActivityIndicator color={tokens.colors.buttonText} />
            ) : (
              <Text style={styles.buttonText}>
                {isSetup ? 'Set PIN' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}; 