import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickAction } from '../types/dashboard';

interface QuickActionsGridProps {
  actions: QuickAction[];
  columns?: number;
  onActionPress?: (action: QuickAction) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  actions,
  columns = 2,
  onActionPress,
}) => {
  const renderAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionButton}
      onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onActionPress?.(action)}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={action.title}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={action.icon as any} size={24} color='#007AFF' />
        {action.requiresPremium && (
          <View style={styles.premiumBadge}>
            <Ionicons name='star' size={12} color='#FFD700' />
          </View>
        )}
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const chunkedActions: QuickAction[][] = [];
  for (let i = 0; i < actions.length; i += columns) {
    chunkedActions.push(actions.slice(i, i + columns));
  }

  return (
    <View style={styles.container}>
      {chunkedActions.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(renderAction)}
          {row.length < columns && Array(columns - row.length).fill(null).map((_, index) => (
            <View><Text>))}</Text></View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  actionIcon: {
    position: 'relative',
    marginBottom: 8,
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  emptySlot: {
    flex: 1,
  },
});
