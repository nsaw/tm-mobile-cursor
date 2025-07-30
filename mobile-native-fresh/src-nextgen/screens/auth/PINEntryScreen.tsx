import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useValidation } from '../../hooks/useValidation';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useBiometrics } from '../../hooks/useBiometrics';
import { useSecurity } from '../../hooks/useSecurity';
import { Text as CustomText } from '../../components/Text';
import { AutoRoleView } from '../../components/AutoRoleView';
import { PINInput } from '../../components/PINInput';
import { BiometricButton } from '../../components/BiometricButton';
import { AuthError } from '../../types/auth';
import { PINValidationSchema } from '../../types/forms';
import { analyticsService } from '../../services/analyticsService';
import { errorService } from '../../services/errorService';

import { styles } from './PINEntryScreen.styles';

export const PINEntryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { verifyPIN, isLoading: authLoading, error: authError } = useAuth();
  const { theme, colors } = useTheme();
  const { validateForm, validationErrors, clearValidationErrors } = useValidation();
  const { isScreenReaderEnabled } = useAccessibility();
  const { 
    isBiometricAvailable, 
    biometricType, 
    authenticateWithBiometrics,
    isBiometricSupported 
  } = useBiometrics();
  const { 
    isLockedOut, 
    lockoutEndTime, 
    failedAttempts, 
    maxAttempts,
    lockoutDuration,
    recordFailedAttempt,
    resetFailedAttempts 
  } = useSecurity();

  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);
  const [securityTimeout, setSecurityTimeout] = useState<number | null>(null);

  const pinInputRef = useRef<TextInput>(null);

  // Security constants
  const PIN_LENGTH = 6;
  const SECURITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const MAX_PIN_ATTEMPTS = 3;

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      handleAuthError(authError);
    }
  }, [authError]);

  // Handle security timeout
  useEffect(() => {
    if (securityTimeout) {
      const timer = setTimeout(() => {
        setSecurityTimeout(null);
        setPin('');
        Alert.alert(
          'Security Timeout',
          'Session expired for security. Please enter your PIN again.'
        );
      }, SECURITY_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [securityTimeout]);

  // Auto-focus PIN input when screen loads
  useEffect(() => {
    const timer = setTimeout(() => {
      pinInputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthError = useCallback((error: AuthError) => {
    recordFailedAttempt();
    
    if (failedAttempts >= MAX_PIN_ATTEMPTS) {
      Alert.alert(
        'Account Locked',
        'Too many failed PIN attempts. Please try again later or use biometric authentication.'
      );
    } else {
      const remainingAttempts = MAX_PIN_ATTEMPTS - failedAttempts;
      Alert.alert(
        'Invalid PIN',
        `Incorrect PIN. ${remainingAttempts} attempts remaining.`
      );
    }

    // Haptic feedback for error
    Vibration.vibrate(100);

    // Analytics tracking
    analyticsService.track('pin_verification_failed', {
      error: error.code,
      attemptCount: failedAttempts + 1,
      biometricAvailable: isBiometricAvailable
    });

    // Error reporting
    errorService.reportError('pin_verification_error', {
      error,
      attemptCount: failedAttempts + 1,
      timestamp: new Date().toISOString()
    });
  }, [authError, failedAttempts, recordFailedAttempt, isBiometricAvailable]);

  const handlePINChange = useCallback((value: string) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= PIN_LENGTH) {
      setPin(numericValue);
      
      // Clear validation errors
      if (validationErrors.pin) {
        clearValidationErrors(['pin']);
      }

      // Auto-submit when PIN is complete
      if (numericValue.length === PIN_LENGTH) {
        handlePINSubmit(numericValue);
      }
    }
  }, [validationErrors.pin, clearValidationErrors]);

  const validatePIN = useCallback(async (pinValue: string): Promise<boolean> => {
    const isValid = await validateForm({ pin: pinValue }, PINValidationSchema);
    
    if (!isValid) {
      analyticsService.track('pin_validation_failed', {
        errors: Object.keys(validationErrors),
        pinLength: pinValue.length
      });
    }

    return isValid;
  }, [validateForm, validationErrors]);

  const handlePINSubmit = useCallback(async (pinValue?: string) => {
    const pinToVerify = pinValue || pin;
    
    if (isSubmitting || authLoading || isLockedOut) return;
    if (pinToVerify.length !== PIN_LENGTH) return;

    setIsSubmitting(true);

    try {
      // Validate PIN format
      const isValid = await validatePIN(pinToVerify);
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Analytics tracking
      analyticsService.track('pin_verification_attempt', {
        pinLength: pinToVerify.length,
        attemptCount: failedAttempts + 1
      });

      // Attempt PIN verification
      await verifyPIN(pinToVerify);

      // Reset failed attempts on success
      resetFailedAttempts();

      // Success tracking
      analyticsService.track('pin_verification_success', {
        attemptCount: failedAttempts + 1
      });

      // Navigate to main app
      navigation.navigate('Main');

    } catch (error) {
      console.error('PIN verification error:', error);
      
      // Error reporting
      errorService.reportError('pin_verification_unexpected_error', {
        error,
        pinLength: pinToVerify.length,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    pin,
    isSubmitting,
    authLoading,
    isLockedOut,
    validatePIN,
    verifyPIN,
    failedAttempts,
    resetFailedAttempts,
    navigation
  ]);

  const handleBiometricAuth = useCallback(async () => {
    if (isBiometricLoading || !isBiometricAvailable) return;

    setIsBiometricLoading(true);

    try {
      // Analytics tracking
      analyticsService.track('biometric_auth_attempt', {
        biometricType,
        attemptCount: failedAttempts + 1
      });

      // Attempt biometric authentication
      const isAuthenticated = await authenticateWithBiometrics();

      if (isAuthenticated) {
        // Reset failed attempts on success
        resetFailedAttempts();

        // Success tracking
        analyticsService.track('biometric_auth_success', {
          biometricType,
          attemptCount: failedAttempts + 1
        });

        // Navigate to main app
        navigation.navigate('Main');
      } else {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication failed. Please try again or use your PIN.'
        );
      }

    } catch (error) {
      console.error('Biometric authentication error:', error);
      
      Alert.alert(
        'Authentication Error',
        'Biometric authentication encountered an error. Please use your PIN.'
      );

      // Error reporting
      errorService.reportError('biometric_auth_error', {
        error,
        biometricType,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsBiometricLoading(false);
    }
  }, [
    isBiometricLoading,
    isBiometricAvailable,
    biometricType,
    authenticateWithBiometrics,
    failedAttempts,
    resetFailedAttempts,
    navigation
  ]);

  const handleForgotPIN = useCallback(() => {
    analyticsService.track('forgot_pin_clicked');
    navigation.navigate('PasswordReset');
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    analyticsService.track('sign_out_from_pin');
    navigation.navigate('SignIn');
  }, [navigation]);

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'TouchID':
        return '👆';
      case 'FaceID':
        return '👤';
      case 'Fingerprint':
        return '👆';
      default:
        return '🔐';
    }
  };

  const getBiometricLabel = () => {
    switch (biometricType) {
      case 'TouchID':
        return 'Use Touch ID';
      case 'FaceID':
        return 'Use Face ID';
      case 'Fingerprint':
        return 'Use Fingerprint';
      default:
        return 'Use Biometrics';
    }
  };

  const isLoading = isSubmitting || authLoading;
  const isPINComplete = pin.length === PIN_LENGTH;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AutoRoleView
          layoutRole="auth-container"
          style={styles.content}
        >
          {/* Header */}
          <AutoRoleView layoutRole="auth-header" style={styles.header}>
            <CustomText
              variant="h1"
              style={[styles.title, { color: colors.text }]}
              accessibilityRole="header"
            ><Text>Enter PIN</Text></CustomText>
            <CustomText
              variant="body"
              style={[styles.subtitle, { color: colors.textSecondary }]}
            ><Text>Enter your 6-digit PIN to continue</Text></CustomText>
          </AutoRoleView>

          {/* PIN Input */}
          <AutoRoleView layoutRole="auth-form" style={styles.form}>
            <AutoRoleView layoutRole="form-field" style={styles.pinContainer}>
              <PINInput
                ref={pinInputRef}
                value={pin}
                onChangeText={handlePINChange}
                length={PIN_LENGTH}
                showValue={showPIN}
                onToggleVisibility={() => setShowPIN(!showPIN)}
                disabled={isLoading || isLockedOut}
                error={!!validationErrors.pin}
                accessibilityLabel="PIN input field"
                accessibilityHint="Enter your 6-digit PIN"
                accessibilityRole="text"
                accessibilityState={{ 
                  invalid: !!validationErrors.pin,
                  disabled: isLoading || isLockedOut
                }}
              />
              {validationErrors.pin && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }]}
                  accessibilityRole="text"
                >
                  {validationErrors.pin}
                </CustomText>
              )}
            </AutoRoleView>

            {/* Biometric Authentication */}
            {isBiometricAvailable && !isLockedOut && (
              <AutoRoleView layoutRole="auth-option" style={styles.biometricContainer}>
                <BiometricButton
                  icon={getBiometricIcon()}
                  label={getBiometricLabel()}
                  onPress={handleBiometricAuth}
                  loading={isBiometricLoading}
                  disabled={isLoading}
                  style={styles.biometricButton}
                  accessibilityLabel={`${getBiometricLabel()} button`}
                  accessibilityHint="Use biometric authentication instead of PIN"
                  accessibilityRole="button"
                />
              </AutoRoleView>
            )}

            {/* Security Status */}
            {isLockedOut && (
              <AutoRoleView layoutRole="error-message" style={styles.lockoutContainer}>
                <CustomText
                  variant="body"
                  style={[styles.lockoutText, { color: colors.error }]}
                  accessibilityRole="text"
                ><Text>Account temporarily locked. Please try again in</Text>{Math.ceil((lockoutEndTime! - Date.now()) / 1000 / 60)}<Text>minutes.</Text></CustomText>
              </AutoRoleView>
            )}

            {failedAttempts > 0 && !isLockedOut && (
              <AutoRoleView layoutRole="warning-message" style={styles.warningContainer}>
                <CustomText
                  variant="body"
                  style={[styles.warningText, { color: colors.warning }]}
                  accessibilityRole="text"
                >
                  {MAX_PIN_ATTEMPTS - failedAttempts}<Text>attempts remaining</Text></CustomText>
              </AutoRoleView>
            )}

            {/* Action Buttons */}
            <AutoRoleView layoutRole="auth-actions" style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.forgotPINButton}
                onPress={handleForgotPIN}
                accessibilityLabel="Forgot PIN link"
                accessibilityRole="link"
                disabled={isLoading || isLockedOut}
              >
                <CustomText
                  variant="body"
                  style={[styles.forgotPINText, { color: colors.primary }]}
                ><Text>Forgot PIN?</Text></CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
                accessibilityLabel="Sign out button"
                accessibilityRole="button"
                disabled={isLoading || isLockedOut}
              >
                <CustomText
                  variant="body"
                  style={[styles.signOutText, { color: colors.textSecondary }]}
                ><Text>Sign Out</Text></CustomText>
              </TouchableOpacity>
            </AutoRoleView>
          </AutoRoleView>

          {/* Security Notice */}
          <AutoRoleView layoutRole="security-notice" style={styles.securityNotice}>
            <CustomText
              variant="caption"
              style={[styles.securityText, { color: colors.textSecondary }]}
              accessibilityRole="text"
            ><Text>Your PIN is encrypted and stored securely on your device.</Text></CustomText>
          </AutoRoleView>
        </AutoRoleView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 