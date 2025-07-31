// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import { useValidation } from '../../hooks/useValidation';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { AutoRoleView } from '../../components/AutoRoleView';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { withPerformanceMonitoring } from '../../utils/PerformanceMonitor';
import { validateEmail } from '../../utils/validation';
import { logSecurityEvent } from '../../utils/security';
import { analytics } from '../../utils/analytics';

// Security constants
const MAX_RESET_ATTEMPTS = 3;
const RESET_COOLDOWN_MINUTES = 15;
const TOKEN_EXPIRY_MINUTES = 30;

interface PasswordResetFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
}

interface PasswordResetState {
  step: 'email' | 'token' | 'password' | 'success';
  attempts: number;
  lastAttemptTime: number;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const PasswordResetScreen: React.FC = () => {
  const navigation = useNavigation();
  const { resetPassword, validateResetToken } = useAuth();
  const { theme, colors } = useTheme();
  const { validateField, validateForm, errors, clearValidationErrors } = useValidation();
  
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: '',
    newPassword: '',
    confirmPassword: '',
    resetToken: '',
  });
  
  const [state, setState] = useState<PasswordResetState>({
    step: 'email',
    attempts: 0,
    lastAttemptTime: 0,
    isLoading: false,
    error: null,
    success: null,
  });

  // Security: Check for rate limiting
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastAttempt = now - state.lastAttemptTime;
    const cooldownMs = RESET_COOLDOWN_MINUTES * 60 * 1000;
    
    if (state.attempts >= MAX_RESET_ATTEMPTS && timeSinceLastAttempt < cooldownMs) {
      const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastAttempt) / (60 * 1000));
      setState(prev => ({ ...prev, error: `Too many attempts. Please wait ${remainingMinutes} minutes.` }));
      return false;
    }
    
    // Reset attempts if cooldown period has passed
    if (timeSinceLastAttempt >= cooldownMs) {
      setState(prev => ({ ...prev, attempts: 0 }));
    }
    
    return true;
  }, [state.attempts, state.lastAttemptTime]);

  // Security: Log security events
  const logSecurityEventLocal = useCallback((event: string, details?: any) => {
    try {
      logSecurityEvent('password_reset', event, {
        email: formData.email,
        step: state.step,
        attempts: state.attempts,
        timestamp: new Date().toISOString(),
        ...details,
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, [formData.email, state.step, state.attempts]);

  // Analytics tracking
  const trackEvent = useCallback((event: string, properties?: any) => {
    try {
      analytics.track(event, {
        screen: 'PasswordResetScreen',
        step: state.step,
        ...properties,
      });
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }, [state.step]);

  // Handle email submission
  const handleEmailSubmit = useCallback(async () => {
    try {
      if (!checkRateLimit()) return;
      
      clearErrors();
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate email
      const emailError = validateField('email', formData.email, [
        { required: true, message: 'Email is required' },
        { validator: validateEmail, message: 'Please enter a valid email address' },
      ]);
      
      if (emailError) {
        setState(prev => ({ ...prev, isLoading: false, error: emailError }));
        return;
      }
      
      // Send reset email
      await resetPassword.sendResetEmail(formData.email);
      
      setState(prev => ({
        ...prev,
        step: 'token',
        isLoading: false,
        success: 'Reset email sent. Please check your inbox.',
        attempts: prev.attempts + 1,
        lastAttemptTime: Date.now(),
      }));
      
      logSecurityEvent('reset_email_sent');
      trackEvent('password_reset_email_sent');
      
    } catch (error) {
      console.error('Password reset email error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send reset email. Please try again.',
        attempts: prev.attempts + 1,
        lastAttemptTime: Date.now(),
      }));
      
      logSecurityEvent('reset_email_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      trackEvent('password_reset_email_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [formData.email, checkRateLimit, clearErrors, validateField, resetPassword, logSecurityEvent, trackEvent]);

  // Handle token validation
  const handleTokenSubmit = useCallback(async () => {
    try {
      if (!checkRateLimit()) return;
      
      clearErrors();
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate token
      const tokenError = validateField('resetToken', formData.resetToken, [
        { required: true, message: 'Reset token is required' },
        { minLength: 6, message: 'Token must be at least 6 characters' },
      ]);
      
      if (tokenError) {
        setState(prev => ({ ...prev, isLoading: false, error: tokenError }));
        return;
      }
      
      // Validate token
      const isValid = await validateResetToken(formData.email, formData.resetToken);
      
      if (!isValid) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid or expired reset token. Please request a new one.',
          attempts: prev.attempts + 1,
          lastAttemptTime: Date.now(),
        }));
        
        logSecurityEvent('invalid_reset_token');
        trackEvent('password_reset_token_invalid');
        return;
      }
      
      setState(prev => ({
        ...prev,
        step: 'password',
        isLoading: false,
        success: 'Token validated. Please enter your new password.',
      }));
      
      logSecurityEvent('reset_token_validated');
      trackEvent('password_reset_token_validated');
      
    } catch (error) {
      console.error('Token validation error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to validate token. Please try again.',
        attempts: prev.attempts + 1,
        lastAttemptTime: Date.now(),
      }));
      
      logSecurityEvent('token_validation_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      trackEvent('password_reset_token_validation_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [formData.email, formData.resetToken, checkRateLimit, clearErrors, validateField, validateResetToken, logSecurityEvent, trackEvent]);

  // Handle password reset
  const handlePasswordSubmit = useCallback(async () => {
    try {
      if (!checkRateLimit()) return;
      
      clearErrors();
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate passwords
      const passwordErrors = await validateForm({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }, {
        newPassword: [
          { required: true, message: 'New password is required' },
          { minLength: 8, message: 'Password must be at least 8 characters' },
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, message: 'Password must contain uppercase, lowercase, number, and special character' },
        ],
        confirmPassword: [
          { required: true, message: 'Please confirm your password' },
          { validator: (value) => value === formData.newPassword, message: 'Passwords do not match' },
        ],
      });
      
      if (Object.keys(passwordErrors).length > 0) {
        setState(prev => ({ ...prev, isLoading: false, error: Object.values(passwordErrors)[0] }));
        return;
      }
      
      // Reset password
      await resetPassword.resetPassword(formData.email, formData.resetToken, formData.newPassword);
      
      setState(prev => ({
        ...prev,
        step: 'success',
        isLoading: false,
        success: 'Password reset successfully. You can now sign in with your new password.',
      }));
      
      logSecurityEvent('password_reset_successful');
      trackEvent('password_reset_successful');
      
    } catch (error) {
      console.error('Password reset error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to reset password. Please try again.',
        attempts: prev.attempts + 1,
        lastAttemptTime: Date.now(),
      }));
      
      logSecurityEvent('password_reset_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      trackEvent('password_reset_failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [formData, checkRateLimit, clearErrors, validateForm, resetPassword, logSecurityEvent, trackEvent]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof PasswordResetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearErrors([field]);
    }
  }, [errors, clearErrors]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (state.step === 'token') {
      setState(prev => ({ ...prev, step: 'email' }));
    } else if (state.step === 'password') {
      setState(prev => ({ ...prev, step: 'token' }));
    } else {
      navigation.goBack();
    }
  }, [state.step, navigation]);

  // Handle success navigation
  const handleSuccess = useCallback(() => {
    navigation.navigate('SignIn' as never);
  }, [navigation]);

  // Auto-clear success message
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  // Render email step
  const renderEmailStep = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
      
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email address"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        accessibilityLabel="Email address input"
        accessibilityHint="Enter your email address to receive a password reset link"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      
      <Button
        title="Send Reset Email"
        onPress={handleEmailSubmit}
        loading={state.isLoading}
        disabled={state.isLoading || !formData.email}
        style={styles.primaryButton}
        accessibilityLabel="Send password reset email"
        accessibilityHint="Sends a password reset link to your email address"
      />
    </View>
  );

  // Render token step
  const renderTokenStep = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Reset Token</Text>
      <Text style={styles.subtitle}>Check your email for the reset token</Text>
      
      <TextInput
        style={[styles.input, errors.resetToken && styles.inputError]}
        placeholder="Reset token"
        value={formData.resetToken}
        onChangeText={(value) => handleInputChange('resetToken', value)}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={8}
        accessibilityLabel="Reset token input"
        accessibilityHint="Enter the reset token from your email"
      />
      {errors.resetToken && <Text style={styles.errorText}>{errors.resetToken}</Text>}
      
      <Button
        title="Validate Token"
        onPress={handleTokenSubmit}
        loading={state.isLoading}
        disabled={state.isLoading || !formData.resetToken}
        style={styles.primaryButton}
        accessibilityLabel="Validate reset token"
        accessibilityHint="Validates the reset token from your email"
      />
    </View>
  );

  // Render password step
  const renderPasswordStep = () => (
    <View style={styles.container}>
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.subtitle}>Enter your new password</Text>
      
      <TextInput
        style={[styles.input, errors.newPassword && styles.inputError]}
        placeholder="New password"
        value={formData.newPassword}
        onChangeText={(value) => handleInputChange('newPassword', value)}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="New password input"
        accessibilityHint="Enter your new password"
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
      
      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm new password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Confirm password input"
        accessibilityHint="Confirm your new password"
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      
      <Button
        title="Reset Password"
        onPress={handlePasswordSubmit}
        loading={state.isLoading}
        disabled={state.isLoading || !formData.newPassword || !formData.confirmPassword}
        style={styles.primaryButton}
        accessibilityLabel="Reset password"
        accessibilityHint="Resets your password with the new password"
      />
    </View>
  );

  // Render success step
  const renderSuccessStep = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Password Reset Successful</Text>
      <Text style={styles.subtitle}>Your password has been reset successfully</Text>
      
      <Button
        title="Sign In"
        onPress={handleSuccess}
        style={styles.primaryButton}
        accessibilityLabel="Go to sign in screen"
        accessibilityHint="Navigates to the sign in screen"
      />
    </View>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (state.step) {
      case 'email':
        return renderEmailStep();
      case 'token':
        return renderTokenStep();
      case 'password':
        return renderPasswordStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderEmailStep();
    }
  };

  return (
    <ErrorBoundary>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AutoRoleView style={styles.mainContent}>
            {state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{state.error}</Text>
              </View>
            )}
            
            {state.success && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>{state.success}</Text>
              </View>
            )}
            
            {renderCurrentStep()}
            
            <Button
              title="Back"
              onPress={handleBack}
              style={styles.secondaryButton}
              accessibilityLabel="Go back"
              accessibilityHint="Goes back to the previous step or screen"
            />
          </AutoRoleView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  mainContent: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
    color: '#6C757D',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    borderColor: '#DEE2E6',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  inputError: {
    borderColor: '#DC3545',
  },
  errorText: {
    fontSize: 12,
    color: '#DC3545',
    marginBottom: 16,
    marginLeft: 4,
  },
  successText: {
    fontSize: 14,
    color: '#28A745',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    height: 48,
    borderRadius: 8,
    marginBottom: 16,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#6C757D',
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#DC3545',
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#DC3545',
    opacity: 0.3,
  },
  successContainer: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#28A745',
    opacity: 0.1,
    borderWidth: 1,
    borderColor: '#28A745',
    opacity: 0.3,
  },
};

export default withPerformanceMonitoring(PasswordResetScreen, 'PasswordResetScreen', 'nextgen'); 