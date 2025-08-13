import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ValidationReport as ValidationReportType } from '../types/validation';
import { ValidationResultItem } from './ValidationResultItem';

interface ValidationReportProps {
  report: ValidationReportType;
}

export const ValidationReport: React.FC<ValidationReportProps> = ({ report }) => {
  const getOverallStatus = () => {
    if (report.failedTests === 0 && report.warningTests === 0) {
      return { icon: '✅', color: '#4CAF50', text: 'ALL TESTS PASSED' };
    } else if (report.failedTests === 0) {
      return { icon: '⚠️', color: '#FF9800', text: 'PASSED WITH WARNINGS' };
    } else {
      return { icon: '❌', color: '#F44336', text: 'TESTS FAILED' };
    }
  };

  const status = getOverallStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Validation Report</Text>
        <Text style={styles.subtitle}>Complete system validation results</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.statusIcon}>{status.icon}</Text>
        <Text style={[styles.statusText, { color: status.color }]}>{status.text}</Text>
        <Text style={styles.summaryText}>{report.summary}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{report.totalTests}</Text>
          <Text style={styles.statLabel}>Total Tests</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{report.passedTests}</Text>
          <Text style={styles.statLabel}>Passed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{report.failedTests}</Text>
          <Text style={styles.statLabel}>Failed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#FF9800' }]}>{report.warningTests}</Text>
          <Text style={styles.statLabel}>Warnings</Text>
        </View>
      </View>

      <View style={styles.results}>
        <Text style={styles.resultsTitle}>Test Results</Text>
        {report.results.map((result) => (
          <ValidationResultItem key={result.id} result={result} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          Generated: {report.timestamp.toLocaleString()}
        </Text>
        <Text style={styles.reportId}>Report ID: {report.id}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  results: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  reportId: {
    fontSize: 10,
    color: '#999',
  },
});
