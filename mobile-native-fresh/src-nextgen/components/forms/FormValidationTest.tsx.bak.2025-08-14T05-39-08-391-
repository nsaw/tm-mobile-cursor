import React from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';
import { FormField } from './FormField';
import { useSignupForm, useSigninForm, useProfileForm } from '../../hooks/useFormValidation';

// Type definitions for form state
interface FormFieldState {
  value: unknown;
  touched: boolean;
  error: string | null;
  rules: unknown;
}

interface FormValidationTestProps {
  environment?: 'legacy' | 'nextgen';
}

export const FormValidationTest: React.FC<FormValidationTestProps> = ({
  environment = 'nextgen'
}) => {
  const signupForm = useSignupForm(environment);
  const signinForm = useSigninForm(environment);
  const profileForm = useProfileForm(environment);

  const handleSignupSubmit = async (values: unknown) => {
    Alert.alert('Signup Form Submitted', JSON.stringify(values, null, 2));
    signupForm.resetForm();
  };

  const handleSigninSubmit = async (values: unknown) => {
    Alert.alert('Signin Form Submitted', JSON.stringify(values, null, 2));
    signinForm.resetForm();
  };

  const handleProfileSubmit = async (values: unknown) => {
    Alert.alert('Profile Form Submitted', JSON.stringify(values, null, 2));
    profileForm.resetForm();
  };

  return (
    <AutoRoleView componentRole="content" style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Form Validation Test ({environment})</Text>
        
        {/* Signup Form Test */}
        <AutoRoleView componentRole="content" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Signup Form Test</Text>
          
          <FormField
            label="Email"
            value={(signupForm.formState.email as FormFieldState)?.value as string}
            error={signupForm.getFieldError('email')}
            touched={(signupForm.formState.email as FormFieldState)?.touched || false}
            onValueChange={(value) => signupForm.updateField('email', value)}
            onBlur={() => signupForm.setFieldTouched('email')}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            environment={environment}
          />

          <FormField
            label="Password"
            value={(signupForm.formState.password as FormFieldState)?.value as string}
            error={signupForm.getFieldError('password')}
            touched={(signupForm.formState.password as FormFieldState)?.touched || false}
            onValueChange={(value) => signupForm.updateField('password', value)}
            onBlur={() => signupForm.setFieldTouched('password')}
            placeholder="Enter your password"
            secureTextEntry
            required
            helperText="Must be at least 8 characters with uppercase, lowercase, and number"
            environment={environment}
          />

          <FormField
            label="Confirm Password"
            value={(signupForm.formState.confirmPassword as FormFieldState)?.value as string}
            error={signupForm.getFieldError('confirmPassword')}
            touched={(signupForm.formState.confirmPassword as FormFieldState)?.touched || false}
            onValueChange={(value) => signupForm.updateField('confirmPassword', value)}
            onBlur={() => signupForm.setFieldTouched('confirmPassword')}
            placeholder="Confirm your password"
            secureTextEntry
            required
            environment={environment}
          />

          <FormField
            label="Username"
            value={(signupForm.formState.username as FormFieldState)?.value as string}
            error={signupForm.getFieldError('username')}
            touched={(signupForm.formState.username as FormFieldState)?.touched || false}
            onValueChange={(value) => signupForm.updateField('username', value)}
            onBlur={() => signupForm.setFieldTouched('username')}
            placeholder="Enter your username"
            autoCapitalize="none"
            required
            helperText="3-20 characters, letters, numbers, and underscores only"
            environment={environment}
          />

                      <AutoRoleView componentRole="interactive" style={styles.buttonContainer}>
            <Text 
              style={[
                styles.submitButton,
                signupForm.isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={() => signupForm.handleSubmit(handleSignupSubmit)}
            >
              {signupForm.isSubmitting ? 'Submitting...' : 'Submit Signup'}
            </Text>
          </AutoRoleView>

          {signupForm.submitError && (
            <AutoRoleView componentRole="feedback" style={styles.errorContainer}>
              <Text style={styles.errorText}>{signupForm.submitError}</Text>
            </AutoRoleView>
          )}
        </AutoRoleView>

        {/* Signin Form Test */}
        <AutoRoleView componentRole="content" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Signin Form Test</Text>
          
          <FormField
            label="Email"
            value={(signinForm.formState.email as FormFieldState)?.value as string}
            error={signinForm.getFieldError('email')}
            touched={(signinForm.formState.email as FormFieldState)?.touched || false}
            onValueChange={(value) => signinForm.updateField('email', value)}
            onBlur={() => signinForm.setFieldTouched('email')}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            required
            environment={environment}
          />

          <FormField
            label="Password"
            value={(signinForm.formState.password as FormFieldState)?.value as string}
            error={signinForm.getFieldError('password')}
            touched={(signinForm.formState.password as FormFieldState)?.touched || false}
            onValueChange={(value) => signinForm.updateField('password', value)}
            onBlur={() => signinForm.setFieldTouched('password')}
            placeholder="Enter your password"
            secureTextEntry
            required
            environment={environment}
          />

                      <AutoRoleView componentRole="interactive" style={styles.buttonContainer}>
            <Text 
              style={[
                styles.submitButton,
                signinForm.isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={() => signinForm.handleSubmit(handleSigninSubmit)}
            >
              {signinForm.isSubmitting ? 'Signing In...' : 'Sign In'}
            </Text>
          </AutoRoleView>

          {signinForm.submitError && (
            <AutoRoleView componentRole="feedback" style={styles.errorContainer}>
              <Text style={styles.errorText}>{signinForm.submitError}</Text>
            </AutoRoleView>
          )}
        </AutoRoleView>

        {/* Profile Form Test */}
        <AutoRoleView componentRole="content" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Profile Form Test</Text>
          
          <FormField
            label="First Name"
            value={(profileForm.formState.firstName as FormFieldState)?.value as string}
            error={profileForm.getFieldError('firstName')}
            touched={(profileForm.formState.firstName as FormFieldState)?.touched || false}
            onValueChange={(value) => profileForm.updateField('firstName', value)}
            onBlur={() => profileForm.setFieldTouched('firstName')}
            placeholder="Enter your first name"
            required
            environment={environment}
          />

          <FormField
            label="Last Name"
            value={(profileForm.formState.lastName as FormFieldState)?.value as string}
            error={profileForm.getFieldError('lastName')}
            touched={(profileForm.formState.lastName as FormFieldState)?.touched || false}
            onValueChange={(value) => profileForm.updateField('lastName', value)}
            onBlur={() => profileForm.setFieldTouched('lastName')}
            placeholder="Enter your last name"
            required
            environment={environment}
          />

          <FormField
            label="Phone"
            value={(profileForm.formState.phone as FormFieldState)?.value as string}
            error={profileForm.getFieldError('phone')}
            touched={(profileForm.formState.phone as FormFieldState)?.touched || false}
            onValueChange={(value) => profileForm.updateField('phone', value)}
            onBlur={() => profileForm.setFieldTouched('phone')}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            environment={environment}
          />

          <FormField
            label="Website"
            value={(profileForm.formState.website as FormFieldState)?.value as string}
            error={profileForm.getFieldError('website')}
            touched={(profileForm.formState.website as FormFieldState)?.touched || false}
            onValueChange={(value) => profileForm.updateField('website', value)}
            onBlur={() => profileForm.setFieldTouched('website')}
            placeholder="Enter your website URL"
            keyboardType="url"
            autoCapitalize="none"
            environment={environment}
          />

                      <AutoRoleView componentRole="interactive" style={styles.buttonContainer}>
            <Text 
              style={[
                styles.submitButton,
                profileForm.isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={() => profileForm.handleSubmit(handleProfileSubmit)}
            >
              {profileForm.isSubmitting ? 'Saving...' : 'Save Profile'}
            </Text>
          </AutoRoleView>

          {profileForm.submitError && (
            <AutoRoleView componentRole="feedback" style={styles.errorContainer}>
              <Text style={styles.errorText}>{profileForm.submitError}</Text>
            </AutoRoleView>
          )}
        </AutoRoleView>

        {/* Validation Status */}
        <AutoRoleView componentRole="feedback" style={styles.statusSection}>
          <Text style={styles.statusTitle}>Validation Status</Text>
          <Text style={styles.statusText}>
            Signup Form: {signupForm.hasErrors() ? '❌ Has Errors' : '✅ Valid'}
          </Text>
          <Text style={styles.statusText}>
            Signin Form: {signinForm.hasErrors() ? '❌ Has Errors' : '✅ Valid'}
          </Text>
          <Text style={styles.statusText}>
            Profile Form: {profileForm.hasErrors() ? '❌ Has Errors' : '✅ Valid'}
          </Text>
        </AutoRoleView>
      </ScrollView>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  statusSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
}); 