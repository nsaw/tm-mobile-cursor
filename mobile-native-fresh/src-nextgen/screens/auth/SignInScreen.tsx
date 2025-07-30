import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useValidation } from '../../hooks/useValidation';
import { useAccessibility } from '../../hooks/useAccessibility';
import { Button } from '../../components/Button';
import { Text as CustomText } from '../../components/Text';
import { AutoRoleView } from '../../components/AutoRoleView';
import { AuthError } from '../../types/auth';
import { SignInFormData, SignInValidationSchema } from '../../types/forms';
import { analyticsService } from '../../services/analyticsService';
import { errorService } from '../../services/errorService';

import { styles } from './SignInScreen.styles';

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signIn, isLoading: authLoading, error: authError } = useAuth();
  const { theme, colors } = useTheme();
  const { validateForm, validationErrors, clearValidationErrors } = useValidation();
  const { isScreenReaderEnabled } = useAccessibility();

  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Security: Rate limiting for failed attempts
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutEndTime) {
      const timer = setInterval(() => {
        if (Date.now() >= lockoutEndTime) {
          setIsLockedOut(false);
          setLockoutEndTime(null);
          setAttemptCount(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutEndTime]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      handleAuthError(authError);
    }
  }, [authError]);

  const handleAuthError = useCallback((error: AuthError) => {
    setAttemptCount(prev => prev + 1);
    
    if (attemptCount >= MAX_ATTEMPTS - 1) {
      setIsLockedOut(true);
      setLockoutEndTime(Date.now() + LOCKOUT_DURATION);
      
      Alert.alert(
        'Account Temporarily Locked',
        'Too many failed attempts. Please try again in 15 minutes or reset your password.',
        [
          { text: 'Reset Password', onPress: () => navigation.navigate('PasswordReset') },
          { text: 'OK', style: 'default' }
        ]
      );
    } else {
      const remainingAttempts = MAX_ATTEMPTS - attemptCount - 1;
      Alert.alert(
        'Sign In Failed',
        `${error.message}\n\nRemaining attempts: ${remainingAttempts}`
      );
    }

    // Analytics tracking
    analyticsService.track('sign_in_failed', {
      error: error.code,
      attemptCount: attemptCount + 1,
      email: formData.email ? 'provided' : 'not_provided'
    });

    // Error reporting
    errorService.reportError('sign_in_error', {
      error,
      attemptCount: attemptCount + 1,
      timestamp: new Date().toISOString()
    });
  }, [authError, attemptCount, formData.email, navigation]);

  const handleInputChange = useCallback((field: keyof SignInFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      clearValidationErrors([field]);
    }
  }, [validationErrors, clearValidationErrors]);

  const validateFormData = useCallback(async (): Promise<boolean> => {
    const isValid = await validateForm(formData, SignInValidationSchema);
    
    if (!isValid) {
      analyticsService.track('sign_in_validation_failed', {
        errors: Object.keys(validationErrors),
        email: formData.email ? 'provided' : 'not_provided'
      });
    }

    return isValid;
  }, [formData, validateForm, validationErrors]);

  const handleSignIn = useCallback(async () => {
    if (isLockedOut) {
      const remainingTime = Math.ceil((lockoutEndTime! - Date.now()) / 1000 / 60);
      Alert.alert(
        'Account Locked',
        `Please wait ${remainingTime} minutes before trying again.`
      );
      return;
    }

    if (isSubmitting || authLoading) return;

    setIsSubmitting(true);

    try {
      // Validate form data
      const isValid = await validateFormData();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Analytics tracking
      analyticsService.track('sign_in_attempt', {
        email: formData.email ? 'provided' : 'not_provided',
        attemptCount: attemptCount + 1
      });

      // Attempt sign in
      await signIn(formData.email, formData.password);

      // Success tracking
      analyticsService.track('sign_in_success', {
        attemptCount: attemptCount + 1
      });

    } catch (error) {
      console.error('Sign in error:', error);
      
      // Error reporting
      errorService.reportError('sign_in_unexpected_error', {
        error,
        formData: { email: formData.email ? 'provided' : 'not_provided' },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isLockedOut,
    lockoutEndTime,
    isSubmitting,
    authLoading,
    validateFormData,
    formData,
    attemptCount,
    signIn
  ]);

  const handleForgotPassword = useCallback(() => {
    analyticsService.track('forgot_password_clicked');
    navigation.navigate('PasswordReset');
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    analyticsService.track('sign_up_clicked');
    navigation.navigate('SignUp');
  }, [navigation]);

  const isFormValid = formData.email.length > 0 && formData.password.length > 0;
  const isLoading = isSubmitting || authLoading;

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
            ><Text>Welcome Back</Text></CustomText>
            <CustomText
              variant="body"
              style={[styles.subtitle, { color: colors.textSecondary }]}
            ><Text>Sign in to your account</Text></CustomText>
          </AutoRoleView>

          {/* Form */}
          <AutoRoleView layoutRole="auth-form" style={styles.form}>
            {/* Email Input */}
            <AutoRoleView layoutRole="form-field" style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={[styles.label, { color: colors.text }]}
                accessibilityRole="text"
              ><Text>Email</Text></CustomText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: validationErrors.email ? colors.error : colors.border
                  }
                ]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                accessibilityLabel="Email input field"
                accessibilityHint="Enter your email address"
                accessibilityRole="text"
                accessibilityState={{ invalid: !!validationErrors.email }}
                editable={!isLockedOut && !isLoading}
              />
              {validationErrors.email && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }]}
                  accessibilityRole="text"
                >
                  {validationErrors.email}
                </CustomText>
              )}
            </AutoRoleView>

            {/* Password Input */}
            <AutoRoleView layoutRole="form-field" style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={[styles.label, { color: colors.text }]}
                accessibilityRole="text"
              ><Text>Password</Text></CustomText>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: validationErrors.password ? colors.error : colors.border
                    }
                  ]}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  accessibilityLabel="Password input field"
                  accessibilityHint="Enter your password"
                  accessibilityRole="text"
                  accessibilityState={{ invalid: !!validationErrors.password }}
                  editable={!isLockedOut && !isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  disabled={isLockedOut || isLoading}
                >
                  <CustomText
                    variant="body"
                    style={[styles.eyeButtonText, { color: colors.textSecondary }]}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </CustomText>
                </TouchableOpacity>
              </View>
              {validationErrors.password && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }]}
                  accessibilityRole="text"
                >
                  {validationErrors.password}
                </CustomText>
              )}
            </AutoRoleView>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              accessibilityLabel="Forgot password link"
              accessibilityRole="link"
              disabled={isLockedOut || isLoading}
            >
              <CustomText
                variant="body"
                style={[styles.forgotPasswordText, { color: colors.primary }]}
              ><Text>Forgot your password?</Text></CustomText>
            </TouchableOpacity>

            {/* Sign In Button */}
            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={!isFormValid || isLockedOut || isLoading}
              loading={isLoading}
              style={styles.signInButton}
              accessibilityLabel="Sign in button"
              accessibilityHint="Tap to sign in to your account"
              accessibilityRole="button"
              accessibilityState={{ disabled: !isFormValid || isLockedOut || isLoading }}
            />

            {/* Lockout Message */}
            {isLockedOut && lockoutEndTime && (
              <AutoRoleView layoutRole="error-message" style={styles.lockoutContainer}>
                <CustomText
                  variant="body"
                  style={[styles.lockoutText, { color: colors.error }]}
                  accessibilityRole="text"
                ><Text>Account temporarily locked. Please try again in</Text>{Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)}<Text>minutes.</Text></CustomText>
              </AutoRoleView>
            )}
          </AutoRoleView>

          {/* Footer */}
          <AutoRoleView layoutRole="auth-footer" style={styles.footer}>
            <CustomText
              variant="body"
              style={[styles.footerText, { color: colors.textSecondary }]}
              accessibilityRole="text"
            ><Text>Don't have an account?</Text>{' '}
            </CustomText>
            <TouchableOpacity
              onPress={handleSignUp}
              accessibilityLabel="Sign up link"
              accessibilityRole="link"
              disabled={isLockedOut || isLoading}
            >
              <CustomText
                variant="body"
                style={[styles.signUpLink, { color: colors.primary }]}
              ><Text>Sign Up</Text></CustomText>
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 