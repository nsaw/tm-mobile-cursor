import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';
import { FormRestoreSentinel } from './FormRestoreSentinel';
import { FormField } from './FormField';
import { useSignupForm } from '../../hooks/useFormValidation';

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

  const handleStateRestored = (state: any) => {
    addTestResult(`✅ Form state restored: ${JSON.stringify(state)}`);
    
    // Apply restored state to form
    if (state) {
      Object.keys(state).forEach(fieldName => {
        if (signupForm.formState[fieldName]) {
          signupForm.updateField(fieldName, state[fieldName]);
        }
      });
    }
  };

  const handleStateSaved = (state: any) => {
    addTestResult(`💾 Form state saved: ${JSON.stringify(state)}`);
  };

  const handleSubmit = async (values: any) => {
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
    <AutoRoleView role="form-restore-sentinel-test" style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Form Restore Sentinel Test ({environment})</Text>
        
        {/* Test Controls */}
        <AutoRoleView role="test-controls" style={styles.testSection}>
          <Text style={styles.sectionTitle}>Test Controls</Text>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testEnvironmentSwitch}
          >
            <Text style={styles.buttonText}>Test Environment Switch</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={testDataLoss}
          >
            <Text style={styles.buttonText}>Test Data Loss Scenario</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.testButton}
            onPress={clearTestResults}
          >
            <Text style={styles.buttonText}>Clear Test Results</Text>
          </TouchableOpacity>
        </AutoRoleView>

        {/* Form with Sentinel */}
        <AutoRoleView role="form-with-sentinel" style={styles.formSection}>
          <Text style={styles.sectionTitle}>Form with Restore Sentinel</Text>
          
          <FormRestoreSentinel
            formKey="signup-form-test"
            environment={environment}
            onStateRestored={handleStateRestored}
            onStateSaved={handleStateSaved}
            autoRestore={true}
            autoSave={true}
            saveInterval={1000} // 1 second for testing
          >
            <FormField
              label="Email"
              name="email"
              value={signupForm.formState.email.value}
              error={signupForm.getFieldError('email')}
              touched={signupForm.formState.email.touched}
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
              name="password"
              value={signupForm.formState.password.value}
              error={signupForm.getFieldError('password')}
              touched={signupForm.formState.password.touched}
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
              name="confirmPassword"
              value={signupForm.formState.confirmPassword.value}
              error={signupForm.getFieldError('confirmPassword')}
              touched={signupForm.formState.confirmPassword.touched}
              onValueChange={(value) => signupForm.updateField('confirmPassword', value)}
              onBlur={() => signupForm.setFieldTouched('confirmPassword')}
              placeholder="Confirm your password"
              secureTextEntry
              required
              environment={environment}
            />

            <FormField
              label="Username"
              name="username"
              value={signupForm.formState.username.value}
              error={signupForm.getFieldError('username')}
              touched={signupForm.formState.username.touched}
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
              <AutoRoleView role="submit-error" style={styles.errorContainer}>
                <Text style={styles.errorText}>{signupForm.submitError}</Text>
              </AutoRoleView>
            )}
          </FormRestoreSentinel>
        </AutoRoleView>

        {/* Form State Display */}
        <AutoRoleView role="form-state-display" style={styles.stateSection}>
          <Text style={styles.sectionTitle}>Current Form State</Text>
          <Text style={styles.stateText}>
            {JSON.stringify(signupForm.getFormValues(), null, 2)}
          </Text>
        </AutoRoleView>

        {/* Test Results */}
        <AutoRoleView role="test-results" style={styles.resultsSection}>
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
        <AutoRoleView role="sentinel-features" style={styles.featuresSection}>
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