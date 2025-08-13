import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useValidation } from '../hooks/useValidation';
import { ValidationReport } from '../components/ValidationReport';

export const FinalValidationScreen: React.FC = () => {
  const { report, loading, error, runValidation } = useValidation();

  const handleRunValidation = async () => {
    Alert.alert(
      'Run Complete Validation',
      'This will run all validation tests. This may take several minutes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Run Validation',
          onPress: runValidation,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Running complete validation...</Text>
        <Text style={styles.loadingSubtext}>This may take several minutes</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={runValidation} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.retryButtonText}>Retry Validation</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!report ? (
        <View style={styles.welcome}>
          <Text style={styles.title}>Final Complete Validation</Text>
          <Text style={styles.subtitle}>
            Run comprehensive validation to ensure the app is ready for production
          </Text>
          <TouchableOpacity style={styles.runButton} onPress={handleRunValidation} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.runButtonText}>Start Complete Validation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ValidationReport report={report} />
      )}

      {report && (
        <TouchableOpacity style={styles.rerunButton} onPress={handleRunValidation} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.rerunButtonText}>Run Validation Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  welcome: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  runButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  runButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  rerunButton: {
    backgroundColor: '#f0f0f0',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rerunButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#1a1a1a',
    marginTop: 100,
  },
  loadingSubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ff4444',
    marginTop: 100,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
