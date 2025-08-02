import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { AutoRoleView } from '../AutoRoleView';

interface FormFieldProps extends TextInputProps {
  label: string;
  name: string;
  value: string;
  error?: string | null;
  touched?: boolean;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  helperText?: string;
  environment?: 'legacy' | 'nextgen';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  error,
  touched = false,
  onValueChange,
  onBlur,
  required = false,
  helperText,
  environment = 'nextgen',
  ...textInputProps
}) => {
  const showError = touched && error;
  const hasError = showError !== null;

  return (
    <AutoRoleView role="form-field" style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, hasError && styles.labelError]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          hasError && styles.inputError,
          environment === 'legacy' && styles.legacyInput,
        ]}
        value={value}
        onChangeText={onValueChange}
        onBlur={onBlur}
        placeholderTextColor="#999"
        {...textInputProps}
      />

      {showError && (
        <AutoRoleView role="form-error" style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </AutoRoleView>
      )}

      {helperText && !showError && (
        <AutoRoleView role="form-helper" style={styles.helperContainer}>
          <Text style={styles.helperText}>{helperText}</Text>
        </AutoRoleView>
      )}
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  labelError: {
    color: '#d32f2f',
  },
  required: {
    color: '#d32f2f',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  legacyInput: {
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  helperContainer: {
    marginTop: 4,
  },
  helperText: {
    color: '#666',
    fontSize: 14,
  },
}); 