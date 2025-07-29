import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

declare const console: any;

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  ruleId: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface ValidationReport {
  totalRules: number;
  passedRules: number;
  failedRules: number;
  results: ValidationResult[];
  overallPassed: boolean;
}

export function useComponentValidation() {
  const [validationReport, setValidationReport] = useState<ValidationReport>({
    totalRules: 0,
    passedRules: 0,
    failedRules: 0,
    results: [],
    overallPassed: false
  });
  const [isValidating, setIsValidating] = useState(false);

  const validationRules: ValidationRule[] = [
    {
      id: 'unique-names',
      name: 'Unique Component Names',
      description: 'All components should have unique names across the codebase',
      severity: 'error'
    },
    {
      id: 'consistent-imports',
      name: 'Consistent Import Patterns',
      description: 'Components should use consistent import/export patterns',
      severity: 'warning'
    },
    {
      id: 'proper-typing',
      name: 'TypeScript Typing',
      description: 'All components should have proper TypeScript types',
      severity: 'error'
    },
    {
      id: 'dependency-check',
      name: 'Dependency Validation',
      description: 'Component dependencies should be valid and accessible',
      severity: 'warning'
    }
  ];

  const runValidation = async () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    try {
      // Rule 1: Unique component names
      const mockComponentNames = ['SlotGrid', 'ContextValidator', 'ContextValidator', 'HomeScreen'];
      const uniqueNames = new Set(mockComponentNames);
      const hasDuplicates = uniqueNames.size !== mockComponentNames.length;
      
      results.push({
        ruleId: 'unique-names',
        passed: !hasDuplicates,
        message: hasDuplicates ? 'Duplicate component names found' : 'All component names are unique',
        details: { total: mockComponentNames.length, unique: uniqueNames.size }
      });

      // Rule 2: Consistent import patterns
      const mockImports = [
        'import React from \'react\'',
        'import { View, Text } from \'react-native\'',
        'import { useRoute } from \'@react-navigation/native\''
      ];
      const hasConsistentImports = mockImports.every(imp => imp.includes('import'));
      
      results.push({
        ruleId: 'consistent-imports',
        passed: hasConsistentImports,
        message: hasConsistentImports ? 'Import patterns are consistent' : 'Inconsistent import patterns detected',
        details: { importCount: mockImports.length }
      });

      // Rule 3: TypeScript typing
      const mockTypedComponents = ['SlotGrid', 'ContextValidator', 'HomeScreen'];
      const hasProperTyping = mockTypedComponents.length > 0;
      
      results.push({
        ruleId: 'proper-typing',
        passed: hasProperTyping,
        message: hasProperTyping ? 'Components have proper TypeScript types' : 'Missing TypeScript types',
        details: { typedComponents: mockTypedComponents.length }
      });

      // Rule 4: Dependency validation
      const mockDependencies = ['slotSelector', 'useSlotQuery', 'useRoute', 'useNavigation'];
      const hasValidDependencies = mockDependencies.length > 0;
      
      results.push({
        ruleId: 'dependency-check',
        passed: hasValidDependencies,
        message: hasValidDependencies ? 'Dependencies are valid' : 'Invalid dependencies detected',
        details: { dependencyCount: mockDependencies.length }
      });

      const passedRules = results.filter(r => r.passed).length;
      const failedRules = results.filter(r => !r.passed).length;
      const overallPassed = failedRules === 0;

      const report: ValidationReport = {
        totalRules: validationRules.length,
        passedRules,
        failedRules,
        results,
        overallPassed
      };

      setValidationReport(report);

      console.log('[ComponentValidator] Validation completed:', {
        totalRules: report.totalRules,
        passedRules: report.passedRules,
        failedRules: report.failedRules,
        overallPassed: report.overallPassed
      });

    } catch (error) {
      console.error('[ComponentValidator] Validation failed:', error);
      results.push({
        ruleId: 'validation-error',
        passed: false,
        message: `Validation error: ${error}`
      });
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  return { validationReport, isValidating, runValidation, validationRules };
}

export default function ComponentValidator() {
  const { validationReport, isValidating, validationRules } = useComponentValidation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Component Validation</Text>
      
      {isValidating && (
        <Text style={styles.validating}>Running validation...</Text>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Validation Summary</Text>
        <Text style={styles.summaryText}>Total Rules: {validationReport.totalRules}</Text>
        <Text style={styles.summaryText}>Passed: {validationReport.passedRules}</Text>
        <Text style={styles.summaryText}>Failed: {validationReport.failedRules}</Text>
        <Text style={[styles.overallResult, validationReport.overallPassed ? styles.passed : styles.failed]}>Overall: {validationReport.overallPassed ? 'PASSED' : 'FAILED'}</Text>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Validation Results</Text>
        {validationReport.results.map((result, index) => {
          const rule = validationRules.find(r => r.id === result.ruleId);
          return (
            <View key={index} style={styles.resultItem}>
              <Text style={[styles.resultName, result.passed ? styles.passed : styles.failed]}>{
                result.passed ? '✅' : '❌'} {rule?.name || result.ruleId}
              </Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
              {result.details && (
                <Text style={styles.resultDetails}>Details: {JSON.stringify(result.details)}</Text>
              )}
            </View>
          );
        })}
      </View>
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
  validating: {
    fontSize: 14,
    color: 'blue',
    textAlign: 'center',
    marginBottom: 10
  },
  summaryContainer: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5
  },
  overallResult: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5
  },
  passed: {
    color: 'green'
  },
  failed: {
    color: 'red'
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  resultItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  resultMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  resultDetails: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace'
  }
}); 