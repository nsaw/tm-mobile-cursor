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
import { authService } from '../../services/authService';
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
      handleAuthError({ code: 'AUTH_ERROR', message: authError });
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
          { text: 'Reset Password', onPress: () => navigation.navigate('PasswordReset' as never) },
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
    errorService.reportError(new Error('sign_in_error'), {
      error,
      attemptCount: attemptCount + 1,
      timestamp: new Date().toISOString()
    });
  }, [authError, attemptCount, formData.email, navigation]);

  const handleInputChange = useCallback((field: keyof SignInFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      clearValidationErrors();
    }
  }, [validationErrors, clearValidationErrors]);

  const validateFormData = useCallback(async (): Promise<boolean> => {
    const isValid = await validateForm(formData);
    
    if (!isValid) {
      analyticsService.track('sign_in_validation_failed', {
        errors: Object.keys(validationErrors).join(','),
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
      errorService.reportError(new Error('sign_in_unexpected_error'), {
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
    navigation.navigate('PasswordReset' as never);
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    analyticsService.track('sign_up_clicked');
    navigation.navigate('SignUp' as never);
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
          style={styles.content}
        >
          {/* Header */}
          <AutoRoleView style={styles.header}>
            <CustomText
              variant="heading"
              style={{ ...styles.title, color: colors.text }}
              accessibilityRole="header"
            >
              Welcome Back
            </CustomText>
            <CustomText
              variant="body"
              style={{ ...styles.subtitle, color: colors.textSecondary }}
            >
              Sign in to your account
            </CustomText>
          </AutoRoleView>

          {/* Form */}
          <AutoRoleView style={styles.form}>
            {/* Email Input */}
            <AutoRoleView style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={{ ...styles.label, color: colors.text }}
                accessibilityRole="text"
              >
                Email
              </CustomText>
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
                accessibilityState={{ disabled: !!validationErrors.email }}
                editable={!isLockedOut && !isLoading}
              />
              {validationErrors.email && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }] as any}
                  accessibilityRole="text"
                >
                  {validationErrors.email}
                </CustomText>
              )}
            </AutoRoleView>

            {/* Password Input */}
            <AutoRoleView style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={{ ...styles.label, color: colors.text }}
                accessibilityRole="text"
              >
                Password
              </CustomText>
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
                  accessibilityState={{ disabled: !!validationErrors.password }}
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
                    style={{ ...styles.eyeButtonText, color: colors.textSecondary }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </CustomText>
                </TouchableOpacity>
              </View>
              {validationErrors.password && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }] as any}
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
                style={{ ...styles.forgotPasswordText, color: colors.primary }}
              >
                Forgot your password?
              </CustomText>
            </TouchableOpacity>

            {/* Sign In Button */}
            <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={!isFormValid || isLockedOut || isLoading}
              loading={isLoading}
              style={styles.signInButton}
            />

            {/* Lockout Message */}
            {isLockedOut && lockoutEndTime && (
              <AutoRoleView style={styles.lockoutContainer}>
                <CustomText
                  variant="body"
                  style={[styles.lockoutText, { color: colors.error }] as any}
                  accessibilityRole="text"
                >
                  Account temporarily locked. Please try again in {Math.ceil((lockoutEndTime - Date.now()) / 1000 / 60)} minutes.
                </CustomText>
              </AutoRoleView>
            )}
          </AutoRoleView>

          {/* Footer */}
          <AutoRoleView style={styles.footer}>
            <CustomText
              variant="body"
              style={[styles.footerText, { color: colors.textSecondary }] as any}
              accessibilityRole="text"
            >
              Don't have an account?{' '}
            </CustomText>
            <TouchableOpacity
              onPress={handleSignUp}
              accessibilityLabel="Sign up link"
              accessibilityRole="link"
              disabled={isLockedOut || isLoading}
            >
              <CustomText
                variant="body"
                style={[styles.signUpLink, { color: colors.primary }] as any}
              >
                Sign Up
              </CustomText>
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 
