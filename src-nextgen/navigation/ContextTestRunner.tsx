import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

declare const console: any;

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  timestamp: number;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  overallPassed: boolean;
}

export function useNavigationContextTests() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();
  const navigation = useNavigation();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = (testName: string, testFn: () => boolean | Promise<boolean>): TestResult => {
    try {
      const result = testFn();
      const passed = result === true;
      return {
        testName,
        passed,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        error: String(error),
        timestamp: Date.now()
      };
    }
  };

  const runContextTests = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Route access
    results.push(runTest('Route Access', () => {
      return !!(route && route.name);
    }));

    // Test 2: Navigation object access
    results.push(runTest('Navigation Object', () => {
      return !!(navigation && typeof navigation.navigate === 'function');
    }));

    // Test 3: Route params access
    results.push(runTest('Route Params', () => {
      return route?.params !== undefined;
    }));

    // Test 4: Navigation state access
    results.push(runTest('Navigation State', () => {
      return !!(navigation?.getState && typeof navigation.getState === 'function');
    }));

    // Test 5: Focus state
    results.push(runTest('Focus State', () => {
      return !!(navigation?.isFocused && typeof navigation.isFocused === 'function');
    }));

    // Test 6: Context depth
    results.push(runTest('Context Depth', () => {
      const state = navigation?.getState();
      return !!(state && Array.isArray(state.routes));
    }));

    const overallPassed = results.every(r => r.passed);
    const testSuite: TestSuite = {
      name: 'Navigation Context Tests',
      results,
      overallPassed
    };

    setTestSuites(prev => [...prev, testSuite]);
    setIsRunning(false);

    console.log('[ContextTestRunner] Test suite completed:', {
      name: testSuite.name,
      passed: testSuite.overallPassed,
      totalTests: results.length,
      passedTests: results.filter(r => r.passed).length
    });
  };

  useEffect(() => {
    runContextTests();
  }, [route?.name]);

  return { testSuites, isRunning, runContextTests };
}

export default function ContextTestRunner() {
  const { testSuites, isRunning } = useNavigationContextTests();
  const latestSuite = testSuites[testSuites.length - 1];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Navigation Context Test Runner</Text>
      
      {isRunning && (
        <Text style={styles.running}>Running tests...</Text>
      )}

      {latestSuite && (
        <View style={styles.suiteContainer}>
          <Text style={styles.suiteTitle}>
            {latestSuite.name} - {latestSuite.overallPassed ? '✅ PASSED' : '❌ FAILED'}
          </Text>
          {latestSuite.results.map((result, index) => (
            <View key={index} style={styles.testResult}>
              <Text style={[styles.testName, result.passed ? styles.passed : styles.failed]}>
                {result.passed ? '✅' : '❌'} {result.testName}
              </Text>
              {result.error && (
                <Text style={styles.error}>{result.error}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <Text style={styles.summary}>
        Total Test Suites: {testSuites.length}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  running: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10
  },
  suiteContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  suiteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  testResult: {
    marginBottom: 8,
    paddingLeft: 10
  },
  testName: {
    fontSize: 14,
    marginBottom: 2
  },
  passed: {
    color: 'green'
  },
  failed: {
    color: 'red'
  },
  error: {
    fontSize: 12,
    color: 'red',
    fontStyle: 'italic',
    marginLeft: 20
  },
  summary: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: '#666'
  }
}); 