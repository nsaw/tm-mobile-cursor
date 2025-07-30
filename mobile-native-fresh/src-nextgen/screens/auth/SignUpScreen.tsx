import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useValidation } from '../../hooks/useValidation';
import { useAccessibility } from '../../hooks/useAccessibility';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import { useCaptcha } from '../../hooks/useCaptcha';
import { Button } from '../../components/Button';
import { Text as CustomText } from '../../components/Text';
import { AutoRoleView } from '../../components/AutoRoleView';
import { PasswordStrengthIndicator } from '../../components/PasswordStrengthIndicator';
import { Checkbox } from '../../components/Checkbox';
import { AuthError } from '../../types/auth';
import { SignUpFormData, SignUpValidationSchema } from '../../types/forms';
import { analyticsService } from '../../services/analyticsService';
import { errorService } from '../../services/errorService';
import { emailService } from '../../services/emailService';

import { styles } from './SignUpScreen.styles';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signUp, isLoading: authLoading, error: authError } = useAuth();
  const { theme, colors } = useTheme();
  const { validateForm, validationErrors, clearValidationErrors } = useValidation();
  const { isScreenReaderEnabled } = useAccessibility();
  const { passwordStrength, validatePassword } = usePasswordStrength();
  const { captchaToken, verifyCaptcha, resetCaptcha } = useCaptcha();

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Refs for form navigation
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Password strength requirements
  const MIN_PASSWORD_LENGTH = 8;
  const PASSWORD_REQUIREMENTS = {
    minLength: MIN_PASSWORD_LENGTH,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  };

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      handleAuthError(authError);
    }
  }, [authError]);

  // Handle password strength validation
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password, PASSWORD_REQUIREMENTS);
    }
  }, [formData.password, validatePassword]);

  const handleAuthError = useCallback((error: AuthError) => {
    Alert.alert(
      'Registration Failed',
      error.message,
      [
        { text: 'Try Again', onPress: () => resetCaptcha() },
        { text: 'OK', style: 'default' }
      ]
    );

    // Analytics tracking
    analyticsService.track('sign_up_failed', {
      error: error.code,
      email: formData.email ? 'provided' : 'not_provided'
    });

    // Error reporting
    errorService.reportError('sign_up_error', {
      error,
      timestamp: new Date().toISOString()
    });
  }, [authError, formData.email, resetCaptcha]);

  const handleInputChange = useCallback((field: keyof SignUpFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[field]) {
      clearValidationErrors([field]);
    }
  }, [validationErrors, clearValidationErrors]);

  const validateFormData = useCallback(async (): Promise<boolean> => {
    // Check password strength
    if (passwordStrength.score < 3) {
      Alert.alert(
        'Weak Password',
        'Please choose a stronger password that meets all requirements.'
      );
      return false;
    }

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Passwords do not match. Please try again.'
      );
      return false;
    }

    // Check terms acceptance
    if (!formData.acceptTerms) {
      Alert.alert(
        'Terms of Service',
        'You must accept the Terms of Service to continue.'
      );
      return false;
    }

    // Validate form with schema
    const isValid = await validateForm(formData, SignUpValidationSchema);
    
    if (!isValid) {
      analyticsService.track('sign_up_validation_failed', {
        errors: Object.keys(validationErrors),
        email: formData.email ? 'provided' : 'not_provided'
      });
    }

    return isValid;
  }, [formData, validateForm, validationErrors, passwordStrength.score]);

  const handleSendVerificationCode = useCallback(async () => {
    if (!formData.email) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }

    try {
      await emailService.sendVerificationCode(formData.email);
      setEmailVerificationSent(true);
      setShowVerificationInput(true);
      
      Alert.alert(
        'Verification Code Sent',
        'Please check your email and enter the verification code.'
      );

      analyticsService.track('verification_code_sent', {
        email: formData.email
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to send verification code. Please try again.'
      );

      errorService.reportError('verification_code_send_error', {
        error,
        email: formData.email,
        timestamp: new Date().toISOString()
      });
    }
  }, [formData.email]);

  const handleSignUp = useCallback(async () => {
    if (isSubmitting || authLoading) return;

    setIsSubmitting(true);

    try {
      // Validate form data
      const isValid = await validateFormData();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      // Verify CAPTCHA
      if (!captchaToken) {
        Alert.alert(
          'Security Check Required',
          'Please complete the security check to continue.'
        );
        setIsSubmitting(false);
        return;
      }

      // Verify email if verification code is provided
      if (showVerificationInput && verificationCode) {
        const isEmailVerified = await emailService.verifyCode(formData.email, verificationCode);
        if (!isEmailVerified) {
          Alert.alert(
            'Invalid Code',
            'The verification code is incorrect. Please try again.'
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Analytics tracking
      analyticsService.track('sign_up_attempt', {
        email: formData.email ? 'provided' : 'not_provided',
        marketingOptIn: formData.acceptMarketing
      });

      // Attempt sign up
      await signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        acceptMarketing: formData.acceptMarketing,
        captchaToken,
      });

      // Success tracking
      analyticsService.track('sign_up_success', {
        marketingOptIn: formData.acceptMarketing
      });

    } catch (error) {
      console.error('Sign up error:', error);
      
      // Error reporting
      errorService.reportError('sign_up_unexpected_error', {
        error,
        formData: { 
          email: formData.email ? 'provided' : 'not_provided',
          marketingOptIn: formData.acceptMarketing
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    authLoading,
    validateFormData,
    captchaToken,
    showVerificationInput,
    verificationCode,
    formData,
    signUp
  ]);

  const handleTermsPress = useCallback(() => {
    Linking.openURL('https://thoughtmarks.app/terms');
  }, []);

  const handlePrivacyPress = useCallback(() => {
    Linking.openURL('https://thoughtmarks.app/privacy');
  }, []);

  const handleSignIn = useCallback(() => {
    analyticsService.track('sign_in_clicked_from_signup');
    navigation.navigate('SignIn');
  }, [navigation]);

  const isFormValid = 
    formData.firstName.length > 0 &&
    formData.lastName.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length >= MIN_PASSWORD_LENGTH &&
    formData.confirmPassword === formData.password &&
    formData.acceptTerms &&
    passwordStrength.score >= 3;

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
            ><Text>Create Account</Text></CustomText>
            <CustomText
              variant="body"
              style={[styles.subtitle, { color: colors.textSecondary }]}
            ><Text>Join Thoughtmarks and start organizing your ideas</Text></CustomText>
          </AutoRoleView>

          {/* Form */}
          <AutoRoleView layoutRole="auth-form" style={styles.form}>
            {/* Name Fields */}
            <View style={styles.nameContainer}>
              <AutoRoleView layoutRole="form-field" style={styles.nameField}>
                <CustomText
                  variant="label"
                  style={[styles.label, { color: colors.text }]}
                  accessibilityRole="text"
                ><Text>First Name</Text></CustomText>
                <TextInput
                  ref={firstNameRef}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: validationErrors.firstName ? colors.error : colors.border
                    }
                  ]}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  placeholder="First name"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="givenName"
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                  accessibilityLabel="First name input field"
                  accessibilityHint="Enter your first name"
                  accessibilityRole="text"
                  accessibilityState={{ invalid: !!validationErrors.firstName }}
                  editable={!isLoading}
                />
                {validationErrors.firstName && (
                  <CustomText
                    variant="caption"
                    style={[styles.errorText, { color: colors.error }]}
                    accessibilityRole="text"
                  >
                    {validationErrors.firstName}
                  </CustomText>
                )}
              </AutoRoleView>

              <AutoRoleView layoutRole="form-field" style={styles.nameField}>
                <CustomText
                  variant="label"
                  style={[styles.label, { color: colors.text }]}
                  accessibilityRole="text"
                ><Text>Last Name</Text></CustomText>
                <TextInput
                  ref={lastNameRef}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: validationErrors.lastName ? colors.error : colors.border
                    }
                  ]}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  placeholder="Last name"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="familyName"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  accessibilityLabel="Last name input field"
                  accessibilityHint="Enter your last name"
                  accessibilityRole="text"
                  accessibilityState={{ invalid: !!validationErrors.lastName }}
                  editable={!isLoading}
                />
                {validationErrors.lastName && (
                  <CustomText
                    variant="caption"
                    style={[styles.errorText, { color: colors.error }]}
                    accessibilityRole="text"
                  >
                    {validationErrors.lastName}
                  </CustomText>
                )}
              </AutoRoleView>
            </View>

            {/* Email Input */}
            <AutoRoleView layoutRole="form-field" style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={[styles.label, { color: colors.text }]}
                accessibilityRole="text"
              ><Text>Email</Text></CustomText>
              <TextInput
                ref={emailRef}
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
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel="Email input field"
                accessibilityHint="Enter your email address"
                accessibilityRole="text"
                accessibilityState={{ invalid: !!validationErrors.email }}
                editable={!isLoading}
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
                  ref={passwordRef}
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
                  placeholder="Create a password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  accessibilityLabel="Password input field"
                  accessibilityHint="Create a strong password"
                  accessibilityRole="text"
                  accessibilityState={{ invalid: !!validationErrors.password }}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                  disabled={isLoading}
                >
                  <CustomText
                    variant="body"
                    style={[styles.eyeButtonText, { color: colors.textSecondary }]}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </CustomText>
                </TouchableOpacity>
              </View>
              
              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator
                strength={passwordStrength}
                requirements={PASSWORD_REQUIREMENTS}
                style={styles.passwordStrength}
              />
              
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

            {/* Confirm Password Input */}
            <AutoRoleView layoutRole="form-field" style={styles.inputContainer}>
              <CustomText
                variant="label"
                style={[styles.label, { color: colors.text }]}
                accessibilityRole="text"
              ><Text>Confirm Password</Text></CustomText>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: formData.confirmPassword && formData.password !== formData.confirmPassword ? colors.error : colors.border
                    }
                  ]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  accessibilityLabel="Confirm password input field"
                  accessibilityHint="Confirm your password"
                  accessibilityRole="text"
                  accessibilityState={{ 
                    invalid: formData.confirmPassword && formData.password !== formData.confirmPassword 
                  }}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  accessibilityRole="button"
                  disabled={isLoading}
                >
                  <CustomText
                    variant="body"
                    style={[styles.eyeButtonText, { color: colors.textSecondary }]}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </CustomText>
                </TouchableOpacity>
              </View>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <CustomText
                  variant="caption"
                  style={[styles.errorText, { color: colors.error }]}
                  accessibilityRole="text"
                ><Text>Passwords do not match</Text></CustomText>
              )}
            </AutoRoleView>

            {/* Email Verification */}
            {!emailVerificationSent && formData.email && (
              <TouchableOpacity
                style={styles.verificationButton}
                onPress={handleSendVerificationCode}
                accessibilityLabel="Send verification code button"
                accessibilityRole="button"
                disabled={isLoading}
              >
                <CustomText
                  variant="body"
                  style={[styles.verificationButtonText, { color: colors.primary }]}
                ><Text>Send Verification Code</Text></CustomText>
              </TouchableOpacity>
            )}

            {showVerificationInput && (
              <AutoRoleView layoutRole="form-field" style={styles.inputContainer}>
                <CustomText
                  variant="label"
                  style={[styles.label, { color: colors.text }]}
                  accessibilityRole="text"
                ><Text>Verification Code</Text></CustomText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder="Enter verification code"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={6}
                  accessibilityLabel="Verification code input field"
                  accessibilityHint="Enter the 6-digit verification code sent to your email"
                  accessibilityRole="text"
                  editable={!isLoading}
                />
              </AutoRoleView>
            )}

            {/* Terms and Conditions */}
            <AutoRoleView layoutRole="form-field" style={styles.checkboxContainer}>
              <Checkbox
                value={formData.acceptTerms}
                onValueChange={(value) => handleInputChange('acceptTerms', value)}
                accessibilityLabel="Accept terms and conditions checkbox"
                accessibilityRole="checkbox"
                disabled={isLoading}
              />
              <View style={styles.termsTextContainer}>
                <CustomText
                  variant="body"
                  style={[styles.termsText, { color: colors.textSecondary }]}
                  accessibilityRole="text"
                ><Text>I accept the</Text>{' '}
                </CustomText>
                <TouchableOpacity
                  onPress={handleTermsPress}
                  accessibilityLabel="Terms of service link"
                  accessibilityRole="link"
                  disabled={isLoading}
                >
                  <CustomText
                    variant="body"
                    style={[styles.termsLink, { color: colors.primary }]}
                  ><Text>Terms of Service</Text></CustomText>
                </TouchableOpacity>
                <CustomText
                  variant="body"
                  style={[styles.termsText, { color: colors.textSecondary }]}
                  accessibilityRole="text"
                >
                  {' '}<Text>and</Text>{' '}
                </CustomText>
                <TouchableOpacity
                  onPress={handlePrivacyPress}
                  accessibilityLabel="Privacy policy link"
                  accessibilityRole="link"
                  disabled={isLoading}
                >
                  <CustomText
                    variant="body"
                    style={[styles.termsLink, { color: colors.primary }]}
                  ><Text>Privacy Policy</Text></CustomText>
                </TouchableOpacity>
              </View>
            </AutoRoleView>

            {/* Marketing Opt-in */}
            <AutoRoleView layoutRole="form-field" style={styles.checkboxContainer}>
              <Checkbox
                value={formData.acceptMarketing}
                onValueChange={(value) => handleInputChange('acceptMarketing', value)}
                accessibilityLabel="Accept marketing communications checkbox"
                accessibilityRole="checkbox"
                disabled={isLoading}
              />
              <CustomText
                variant="body"
                style={[styles.marketingText, { color: colors.textSecondary }]}
                accessibilityRole="text"
              ><Text>I would like to receive updates about new features and promotions</Text></CustomText>
            </AutoRoleView>

            {/* Sign Up Button */}
            <Button
              title={isLoading ? 'Creating Account...' : 'Create Account'}
              onPress={handleSignUp}
              disabled={!isFormValid || isLoading}
              loading={isLoading}
              style={styles.signUpButton}
              accessibilityLabel="Create account button"
              accessibilityHint="Tap to create your account"
              accessibilityRole="button"
              accessibilityState={{ disabled: !isFormValid || isLoading }}
            />
          </AutoRoleView>

          {/* Footer */}
          <AutoRoleView layoutRole="auth-footer" style={styles.footer}>
            <CustomText
              variant="body"
              style={[styles.footerText, { color: colors.textSecondary }]}
              accessibilityRole="text"
            ><Text>Already have an account?</Text>{' '}
            </CustomText>
            <TouchableOpacity
              onPress={handleSignIn}
              accessibilityLabel="Sign in link"
              accessibilityRole="link"
              disabled={isLoading}
            >
              <CustomText
                variant="body"
                style={[styles.signInLink, { color: colors.primary }]}
              ><Text>Sign In</Text></CustomText>
            </TouchableOpacity>
          </AutoRoleView>
        </AutoRoleView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 