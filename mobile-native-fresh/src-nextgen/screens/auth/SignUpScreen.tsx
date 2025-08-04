import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useValidation } from '../../hooks/useValidation';
import { useAccessibility } from '../../hooks/useAccessibility';
import { Button } from '../../components/Button';
import { Text as CustomText } from '../../components/Text';
import { AutoRoleView } from '../../components/AutoRoleView';
import { SignUpFormData, SignUpValidationSchema } from '../../types/forms';
import { createStyles } from './SignUpScreen.styles';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const { colors } = useTheme();
  const { validateForm, validationErrors, clearValidationErrors } = useValidation();
  const { isScreenReaderEnabled } = useAccessibility();

  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptMarketing: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof SignUpFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearValidationErrors();
  }, [clearValidationErrors]);

  const handleSignUp = useCallback(async () => {
    setIsLoading(true);
    try {
      const isValid = validateForm(formData);
      if (!isValid) {
        Alert.alert('Validation Error', 'Please check your input and try again.');
        return;
      }

      await signUp(formData.firstName + ' ' + formData.lastName, formData.email, formData.password);
      Alert.alert('Success', 'Account created successfully!');
      // Navigate to next screen
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, signUp]);

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <AutoRoleView style={styles.header}>
            <CustomText variant="heading" style={styles.title}>
              Create Account
            </CustomText>
          </AutoRoleView>

          <AutoRoleView style={styles.subtitle}>
            <CustomText variant="body" style={styles.subtitle}>
              Join Thoughtmarks to get started
            </CustomText>
          </AutoRoleView>

          <AutoRoleView style={styles.form}>
            <View style={styles.inputContainer}>
              <CustomText variant="label">First Name</CustomText>
              <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter your first name"
                accessibilityLabel="First name input"
                accessibilityHint="Enter your first name"
              />
              {validationErrors.firstName && (
                <CustomText variant="caption" style={styles.errorText}>
                  {validationErrors.firstName}
                </CustomText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomText variant="label">Last Name</CustomText>
              <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter your last name"
                accessibilityLabel="Last name input"
                accessibilityHint="Enter your last name"
              />
              {validationErrors.lastName && (
                <CustomText variant="caption" style={styles.errorText}>
                  {validationErrors.lastName}
                </CustomText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomText variant="label">Email</CustomText>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email input"
                accessibilityHint="Enter your email address"
              />
              {validationErrors.email && (
                <CustomText variant="caption" style={styles.errorText}>
                  {validationErrors.email}
                </CustomText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomText variant="label">Password</CustomText>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Enter your password"
                secureTextEntry
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
              />
              {validationErrors.password && (
                <CustomText variant="caption" style={styles.errorText}>
                  {validationErrors.password}
                </CustomText>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomText variant="label">Confirm Password</CustomText>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
                accessibilityLabel="Confirm password input"
                accessibilityHint="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <CustomText variant="caption" style={styles.errorText}>
                  {validationErrors.confirmPassword}
                </CustomText>
              )}
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleInputChange('acceptTerms', !formData.acceptTerms)}
                accessibilityLabel="Accept terms checkbox"
                accessibilityHint="Toggle to accept terms and conditions"
              >
                <View style={[styles.checkboxInner, formData.acceptTerms && styles.checkboxChecked]} />
              </TouchableOpacity>
              <CustomText variant="body" style={styles.checkboxLabel}>
                I accept the Terms and Conditions
              </CustomText>
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleInputChange('acceptMarketing', !formData.acceptMarketing)}
                accessibilityLabel="Accept marketing checkbox"
                accessibilityHint="Toggle to accept marketing communications"
              >
                <View style={[styles.checkboxInner, formData.acceptMarketing && styles.checkboxChecked]} />
              </TouchableOpacity>
              <CustomText variant="body" style={styles.checkboxLabel}>
                I would like to receive marketing communications
              </CustomText>
            </View>
          </AutoRoleView>

          <Button
            title="Create Account"
            onPress={handleSignUp}
            disabled={isLoading}
            loading={isLoading}
            style={styles.signUpButton}
          />

          <AutoRoleView style={styles.footer}>
            <CustomText variant="body" style={styles.footerText}>
              Already have an account?{' '}
            </CustomText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CustomText variant="body" style={styles.linkText}>
                Sign In
              </CustomText>
            </TouchableOpacity>
          </AutoRoleView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 
