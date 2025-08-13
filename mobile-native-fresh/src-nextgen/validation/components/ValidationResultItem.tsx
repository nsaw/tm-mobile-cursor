import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ValidationResult } from '../types/validation';

interface ValidationResultItemProps {
  result: ValidationResult;
}

export const ValidationResultItem: React.FC<ValidationResultItemProps> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case 'pass':
        return '✅';
      case 'fail':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'pass':
        return '#4CAF50';
      case 'fail':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <Text style={styles.name}>{result.name}</Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {result.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.message}>{result.message}</Text>
      {result.details && <Text style={styles.details}>{result.details}</Text>}
      <Text style={styles.timestamp}>
        {result.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
});
