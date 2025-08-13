import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIInsight } from '../types/ai-types';

interface AIInsightsCardProps {
  insight: AIInsight;
  onPress?: (insight: AIInsight) => void;
  onAction?: (insight: AIInsight) => void;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insight,
  onPress,
  onAction,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'productivity': return '⚡';
      case 'organization': return '📁';
      case 'learning': return '🎓';
      case 'recommendation': return '💡';
      default: return '🤖';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return '#666';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#34C759';
    if (confidence >= 60) return '#FF9500';
    return '#FF4444';
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress?.(insight)}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getTypeIcon(insight.type)}</Text>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{insight.title}</Text>
          <View style={styles.badges}>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(insight.priority) + '20' },
            ]}>
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(insight.priority) },
              ]}>
                {insight.priority.toUpperCase()}
              </Text>
            </View>
            <View style={[
              styles.confidenceBadge,
              { backgroundColor: getConfidenceColor(insight.confidence) + '20' },
            ]}>
              <Text style={[
                styles.confidenceText,
                { color: getConfidenceColor(insight.confidence) },
              ]}>
                {insight.confidence}%
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={styles.description}>{insight.description}</Text>
      
      {insight.actionable && insight.action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onAction?.(insight)}
        >
          <Ionicons name="flash" size={16} color="#007AFF" />
          <Text style={styles.actionButtonText}>{insight.action}</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
});
