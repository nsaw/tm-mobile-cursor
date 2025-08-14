import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BulkOperation } from '../types/bulk-operations';

interface BulkOperationCardProps {
  operation: BulkOperation;
  onPress: (operation: BulkOperation) => void;
  onCancel?: (operationId: string) => void;
}

export const BulkOperationCard: React.FC<BulkOperationCardProps> = ({
  operation,
  onPress,
  onCancel,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'running': return '#007AFF';
      case 'completed': return '#34C759';
      case 'failed': return '#FF4444';
      case 'cancelled': return '#666';
      default: return '#999';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'move': return '📁';
      case 'delete': return '🗑️';
      case 'tag': return '🏷️';
      case 'untag': return '🏷️';
      case 'archive': return '📦';
      case 'export': return '📤';
      case 'merge': return '🔗';
      case 'duplicate': return '📋';
      default: return '⚙️';
    }
  };

  const successfulResults = operation.results.filter(r => r.success).length;
  const totalResults = operation.results.length;

  return (
    <TouchableOpacity style={styles.container} onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onPress(operation)}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getTypeIcon(operation.type)}</Text>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{operation.type.toUpperCase()} {operation.targetType}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(operation.status) + '20' },
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(operation.status) },
            ]}>
              {getStatusIcon(operation.status)} {operation.status.toUpperCase()}
            </Text>
          </View>
        </View>
        {operation.status === 'running' && onCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onCancel(operation.id)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>Items: {operation.itemIds.length}</Text>
        {operation.status === 'running' && (
          <Text style={styles.detailText}>Progress: {operation.progress}%</Text>
        )}
        {operation.status === 'completed' && totalResults > 0 && (
          <Text style={styles.detailText}>
            Results: {successfulResults}/{totalResults} successful
          </Text>
        )}
      </View>
      
      {operation.status === 'running' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${operation.progress}%` }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e1e5e9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
});
