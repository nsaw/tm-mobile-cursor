import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Bin } from '../types/binTypes';

interface BinCardProps {
  bin: Bin;
  onPress: (bin: Bin) => void;
  onEdit?: (bin: Bin) => void;
  onDelete?: (bin: Bin) => void;
}

export const BinCard: React.FC<BinCardProps> = ({
  bin,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: bin.color }]}
      onPress={() => onPress(bin)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {bin.icon && (
              <Ionicons name={bin.icon as any} size={20} color={bin.color} style={styles.icon} />
            )}
            <Text style={styles.name} numberOfLines={1}>
              {bin.name}
            </Text>
            {bin.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(bin)}
              >
                <Ionicons name='pencil' size={16} color='#666' />
              </TouchableOpacity>
            )}
            {onDelete && !bin.isDefault && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(bin)}
              >
                <Ionicons name='trash' size={16} color='#ff4444' />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {bin.description && (
          <Text style={styles.description} numberOfLines={2}>
            {bin.description}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.thoughtCount}>
            {bin.thoughtCount} thought{bin.thoughtCount !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.date}>
            {new Date(bin.updatedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  defaultBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thoughtCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
