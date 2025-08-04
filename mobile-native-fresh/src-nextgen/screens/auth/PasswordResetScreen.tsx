import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useValidation } from '../../hooks/useValidation';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/ui/Button';
import { AutoRoleView } from '../../shell/wrappers/AutoRoleView';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { withPerformanceMonitoring } from '../../utils/PerformanceMonitor';
import { ValidationService } from '../../utils/validation';

// Security constants
const MAX_RESET_ATTEMPTS = 3;
const RESET_COOLDOWN_MINUTES = 15;

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
  const { resetPassword } = useAuth();
  const { colors } = useTheme();
  const { validationErrors, clearValidationErrors } = useValidation();
  
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
  const logSecurityEvent = useCallback((event: string, details?: Record<string, unknown>) => {
    try {
      console.log('Security event:', { event, email: formData.email, step: state.step, attempts: state.attempts, timestamp: new Date().toISOString(), ...details });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }, [formData.email, state.step, state.attempts]);

  // Analytics tracking
  const trackEvent = useCallback((event: string, properties?: Record<string, unknown>) => {
    try {
      console.log('Analytics event:', { event, screen: 'PasswordResetScreen', step: state.step, ...properties });
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  }, [state.step]);

  // Handle email submission
  const handleEmailSubmit = useCallback(async () => {
    try {
      if (!checkRateLimit()) return;
      
      clearValidationErrors();
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate email
      const emailValidation = ValidationService.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        setState(prev => ({ ...prev, isLoading: false, error: emailValidation.errors[0] }));
        return;
      }
      
      // Send reset email
      await resetPassword(formData.email);
      
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
  }, [formData.email, checkRateLimit, clearValidationErrors, resetPassword, logSecurityEvent, trackEvent]);

  // Handle password reset
  const handlePasswordSubmit = useCallback(async () => {
    try {
      if (!checkRateLimit()) return;
      
      clearValidationErrors();
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Validate passwords
      const passwordValidation = ValidationService.validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        setState(prev => ({ ...prev, isLoading: false, error: passwordValidation.errors[0] }));
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setState(prev => ({ ...prev, isLoading: false, error: 'Passwords do not match' }));
        return;
      }
      
      // Reset password
      await resetPassword(formData.email);
      
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
  }, [formData, checkRateLimit, clearValidationErrors, resetPassword, logSecurityEvent, trackEvent]);

  // Handle input changes
  const handleInputChange = useCallback((field: keyof PasswordResetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      clearValidationErrors();
    }
  }, [validationErrors, clearValidationErrors]);

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
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Reset Password</Text>
      <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 20 }}>Enter your email to receive a reset link</Text>
      
      <TextInput
        style={{ 
          borderWidth: 1, 
          borderColor: validationErrors.email ? colors.error : colors.border, 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 10,
          backgroundColor: colors.surface,
          color: colors.text
        }}
        placeholder="Email address"
        placeholderTextColor={colors.textSecondary}
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        accessibilityLabel="Email address input"
        accessibilityHint="Enter your email address to receive a password reset link"
      />
      {validationErrors.email && <Text style={{ color: colors.error, fontSize: 14, marginBottom: 10 }}>{validationErrors.email}</Text>}
      
      <Button
        title="Send Reset Email"
        onPress={handleEmailSubmit}
        loading={state.isLoading}
        disabled={state.isLoading || !formData.email}
        style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' }}
        accessibilityLabel="Send password reset email"
        accessibilityHint="Sends a password reset link to your email address"
      />
    </View>
  );



  // Render password step
  const renderPasswordStep = () => (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>New Password</Text>
      <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 20 }}>Enter your new password</Text>
      
      <TextInput
        style={{ 
          borderWidth: 1, 
          borderColor: validationErrors.newPassword ? colors.error : colors.border, 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 10,
          backgroundColor: colors.surface,
          color: colors.text
        }}
        placeholder="New password"
        placeholderTextColor={colors.textSecondary}
        value={formData.newPassword}
        onChangeText={(value) => handleInputChange('newPassword', value)}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="New password input"
        accessibilityHint="Enter your new password"
      />
      {validationErrors.newPassword && <Text style={{ color: colors.error, fontSize: 14, marginBottom: 10 }}>{validationErrors.newPassword}</Text>}
      
      <TextInput
        style={{ 
          borderWidth: 1, 
          borderColor: validationErrors.confirmPassword ? colors.error : colors.border, 
          borderRadius: 8, 
          padding: 12, 
          marginBottom: 10,
          backgroundColor: colors.surface,
          color: colors.text
        }}
        placeholder="Confirm new password"
        placeholderTextColor={colors.textSecondary}
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Confirm password input"
        accessibilityHint="Confirm your new password"
      />
      {validationErrors.confirmPassword && <Text style={{ color: colors.error, fontSize: 14, marginBottom: 10 }}>{validationErrors.confirmPassword}</Text>}
      
      <Button
        title="Reset Password"
        onPress={handlePasswordSubmit}
        loading={state.isLoading}
        disabled={state.isLoading || !formData.newPassword || !formData.confirmPassword}
        style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' }}
        accessibilityLabel="Reset password"
        accessibilityHint="Resets your password with the new password"
      />
    </View>
  );

  // Render success step
  const renderSuccessStep = () => (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 10 }}>Password Reset Successful</Text>
      <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 20 }}>Your password has been reset successfully</Text>
      
      <Button
        title="Sign In"
        onPress={handleSuccess}
        style={{ backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' }}
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
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <AutoRoleView contentRole="text-display" style={{ flex: 1 }}>
            {state.error && (
              <View style={{ backgroundColor: colors.error, padding: 15, margin: 20, borderRadius: 8 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{state.error}</Text>
              </View>
            )}
            
            {state.success && (
              <View style={{ backgroundColor: colors.primary, padding: 15, margin: 20, borderRadius: 8 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 14 }}>{state.success}</Text>
              </View>
            )}
            
            {renderCurrentStep()}
            
            <Button
              title="Back"
              onPress={handleBack}
              style={{ backgroundColor: colors.border, padding: 15, margin: 20, borderRadius: 8, alignItems: 'center' }}
              accessibilityLabel="Go back"
              accessibilityHint="Goes back to the previous step or screen"
            />
          </AutoRoleView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ErrorBoundary>
  );
};

export default withPerformanceMonitoring(PasswordResetScreen, 'PasswordResetScreen', 'nextgen'); 
