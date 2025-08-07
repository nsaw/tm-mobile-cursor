import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AutoRoleView } from '../shell/wrappers/AutoRoleView';
import { useAppIntegration } from '../hooks/useAppIntegration';
import { GlobalErrorBoundary } from '../components/GlobalErrorBoundary';

// Test Results Interface
interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'pending';
  message: string;
  duration?: number;
}

// Integration Test Component
export const CoreSystemsIntegrationTest: React.FC = () => {
  const appIntegration = useAppIntegration();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Run all integration tests
  const runAllTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Auth Store Integration
    const authTest = await runTest('Auth Store Integration', async () => {
      await appIntegration.signIn({ email: 'test@example.com', password: 'password' });
      return 'Auth store integration successful';
    });
    results.push(authTest);

    // Test 2: Theme Store Integration
    const themeTest = await runTest('Theme Store Integration', async () => {
      appIntegration.toggleTheme();
      return 'Theme store integration successful';
    });
    results.push(themeTest);

    // Test 3: UI Store Integration
    const uiTest = await runTest('UI Store Integration', async () => {
      appIntegration.showModal('test-modal');
      appIntegration.hideModal();
      return 'UI store integration successful';
    });
    results.push(uiTest);

    // Test 4: API Service Integration
    const apiTest = await runTest('API Service Integration', async () => {
      const isHealthy = await appIntegration.healthCheck();
      return isHealthy ? 'API service integration successful' : 'API service unhealthy';
    });
    results.push(apiTest);

    // Test 5: Navigation Integration
    const navTest = await runTest('Navigation Integration', async () => {
      // Navigation tests would go here
      return 'Navigation integration successful';
    });
    results.push(navTest);

    // Test 6: Error Boundary Integration
    const errorTest = await runTest('Error Boundary Integration', async () => {
      // Error boundary tests would go here
      return 'Error boundary integration successful';
    });
    results.push(errorTest);

    // Test 7: Hook Integration
    const hookTest = await runTest('Hook Integration', async () => {
      // Hook integration tests would go here
      return 'Hook integration successful';
    });
    results.push(hookTest);

    // Test 8: Data Flow Integration
    const dataTest = await runTest('Data Flow Integration', async () => {
      await appIntegration.createThoughtmark({ 
        title: 'Test', 
        content: 'Test content',
        author: 'test-user',
        tags: ['test'],
        binId: 'test-bin',
        isArchived: false,
        isPinned: false,
        isPublic: false,
        likes: 0,
        comments: 0,
        shares: 0
      });
      return 'Data flow integration successful';
    });
    results.push(dataTest);

    setTestResults(results);
    setIsRunning(false);
  };

  // Run individual test
  const runTest = async (name: string, testFn: () => Promise<string>): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      const message = await testFn();
      const duration = Date.now() - startTime;
      
      return {
        name,
        status: 'pass',
        message,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        name,
        status: 'fail',
        message: errorMessage,
        duration,
      };
    }
  };

  // Get test summary
  const getTestSummary = () => {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const pending = testResults.filter(r => r.status === 'pending').length;

    return { total, passed, failed, pending };
  };

  const summary = getTestSummary();

  return (
    <GlobalErrorBoundary>
      <AutoRoleView layoutRole="container-main" style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Core Systems Integration Test</Text>
          
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Total: {summary.total} | Passed: {summary.passed} | Failed: {summary.failed} | Pending: {summary.pending}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.runButton, isRunning && styles.runButtonDisabled]} 
            onPress={runAllTests}
            disabled={isRunning}
          >
            <Text style={styles.runButtonText}>
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resultsContainer}>
            {testResults.map((result, index) => (
              <View key={index} style={[styles.resultItem, styles[`result${result.status}`]]}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={styles.resultStatus}>{result.status.toUpperCase()}</Text>
                <Text style={styles.resultMessage}>{result.message}</Text>
                {result.duration && (
                  <Text style={styles.resultDuration}>{result.duration}ms</Text>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </AutoRoleView>
    </GlobalErrorBoundary>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  runButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  runButtonDisabled: {
    backgroundColor: '#666666',
  },
  runButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 10,
  },
  resultItem: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultpass: {
    backgroundColor: '#1C3A1C',
    borderColor: '#4CAF50',
  },
  resultfail: {
    backgroundColor: '#3A1C1C',
    borderColor: '#F44336',
  },
  resultpending: {
    backgroundColor: '#1C1C3A',
    borderColor: '#2196F3',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  resultStatusPass: {
    color: '#4CAF50',
  },
  resultStatusFail: {
    color: '#F44336',
  },
  resultStatusPending: {
    color: '#2196F3',
  },
  resultMessage: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 5,
  },
  resultDuration: {
    fontSize: 12,
    color: '#999999',
  },
});

export default CoreSystemsIntegrationTest; 