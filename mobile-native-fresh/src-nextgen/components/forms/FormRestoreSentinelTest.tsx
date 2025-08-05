import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';
import { FormRestoreSentinel } from './FormRestoreSentinel';
import { FormField } from './FormField';
import { useSignupForm } from '../../hooks/useFormValidation';


// Type definitions for form state
interface FormFieldState {
  value: unknown;
  touched: boolean;
  error: string | null;
  rules: unknown;
}

interface FormRestoreSentinelTestProps {
  environment?: 'legacy' | 'nextgen';
}

export const FormRestoreSentinelTest: React.FC<FormRestoreSentinelTestProps> = ({
  environment = 'nextgen'
}) => {
  const signupForm = useSignupForm(environment);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handleStateRestored = (state: unknown) => {
    addTestResult(`✅ Form state restored: ${JSON.stringify(state)}`);
    
    // Apply restored state to form
    if (state && typeof state === 'object' && state !== null) {
      Object.keys(state).forEach(fieldName => {
        const fieldState = signupForm.formState[fieldName] as FormFieldState;
        if (fieldState && typeof fieldState === 'object' && 'value' in fieldState) {
          signupForm.updateField(fieldName, (state as Record<string, unknown>)[fieldName]);
        }
      });
    }
  };

  const handleStateSaved = (state: unknown) => {
    addTestResult(`💾 Form state saved: ${JSON.stringify(state)}`);
  };

  const handleSubmit = async (values: unknown) => {
    Alert.alert('Form Submitted', JSON.stringify(values, null, 2));
    addTestResult(`📤 Form submitted: ${JSON.stringify(values)}`);
    signupForm.resetForm();
  };

  const testEnvironmentSwitch = () => {
    addTestResult(`🔄 Testing environment switch: ${environment}`);
    
    // Simulate environment switch by clearing and restoring
    const currentState = signupForm.getFormValues();
    addTestResult(`📋 Current state before switch: ${JSON.stringify(currentState)}`);
    
    // In a real scenario, this would happen when switching environments
    setTimeout(() => {
      addTestResult(`🔄 Environment switched, attempting to restore...`);
    }, 1000);
  };

  const testDataLoss = () => {
    addTestResult(`⚠️ Testing data loss scenario...`);
    
    // Fill form with data
    signupForm.updateField('email', 'test@example.com');
    signupForm.updateField('password', 'TestPassword123');
    signupForm.updateField('confirmPassword', 'TestPassword123');
    signupForm.updateField('username', 'testuser');
    
    addTestResult(`📝 Form filled with test data`);
    
    // Simulate app crash or navigation
    setTimeout(() => {
      addTestResult(`💥 Simulating app crash/navigation...`);
      addTestResult(`🔄 Form sentinel should restore data on next load`);
    }, 2000);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <AutoRoleView role="content" style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Form Restore Sentinel Test ({environment})</Text>
        
        {/* Test Controls */}
        <AutoRoleView role="interactive" style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Controls</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testEnvironmentSwitch}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.buttonText}>Test Environment Switch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testDataLoss}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.buttonText}>Test Data Loss Scenario</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={clearTestResults}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.buttonText}>Clear Test Results</Text>
          </TouchableOpacity>
        </AutoRoleView>

        {/* Form with Sentinel */}
        <AutoRoleView role="content" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Form with Restore Sentinel</Text>
          
          <FormRestoreSentinel
            formKey="signup-form-test"
            environment={environment}
            onStateRestored={handleStateRestored}
            onStateSaved={handleStateSaved}
            autoRestore={true}
            autoSave={true}
          >
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

            <TouchableOpacity 
              style={[
                styles.submitButton,
                signupForm.isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={() => signupForm.handleSubmit(handleSubmit)}
            >
              <Text style={styles.submitButtonText}>
                {signupForm.isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Text>
            </TouchableOpacity>

            {signupForm.submitError && (
              <AutoRoleView role="feedback" style={styles.errorContainer}>
                <Text style={styles.errorText}>{signupForm.submitError}</Text>
              </AutoRoleView>
            )}
          </FormRestoreSentinel>
        </AutoRoleView>

        {/* Form State Display */}
        <AutoRoleView role="content" style={styles.stateSection}>
          <Text style={styles.sectionTitle}>Current Form State</Text>
          <Text style={styles.stateText}>
            {JSON.stringify(signupForm.getFormValues(), null, 2)}
          </Text>
        </AutoRoleView>

        {/* Test Results */}
        <AutoRoleView role="content" style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          {testResults.length === 0 ? (
            <Text style={styles.noResultsText}>No test results yet. Run a test to see results.</Text>
          ) : (
            testResults.map((result, index) => (
              <Text key={index} style={styles.resultText}>
                {result}
              </Text>
            ))
          )}
        </AutoRoleView>

        {/* Sentinel Features */}
        <AutoRoleView role="content" style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Sentinel Features</Text>
          <Text style={styles.featureText}>✅ Auto-save form state every 1 second</Text>
          <Text style={styles.featureText}>✅ Auto-restore form state on mount</Text>
          <Text style={styles.featureText}>✅ Environment-aware storage (legacy/nextgen)</Text>
          <Text style={styles.featureText}>✅ 24-hour expiration for saved state</Text>
          <Text style={styles.featureText}>✅ Visual status indicators</Text>
          <Text style={styles.featureText}>✅ Error handling and fallbacks</Text>
          <Text style={styles.featureText}>✅ Debug information in development</Text>
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
  testSection: {
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
  stateSection: {
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
  resultsSection: {
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
  featuresSection: {
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
  testButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
  stateText: {
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    color: '#333',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
}); 