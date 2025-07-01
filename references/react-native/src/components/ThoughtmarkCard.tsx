import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TagChip } from './TagChip';
import { Thoughtmark } from '../types';

interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  onPress: () => void;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({ 
  thoughtmark, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {thoughtmark.title}
        </Text>
        {thoughtmark.isPinned && (
          <View style={styles.pinnedIndicator}>
            <Text style={styles.pinnedText}>📌</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.content} numberOfLines={3}>
        {thoughtmark.content}
      </Text>
      
      {thoughtmark.tags && thoughtmark.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {thoughtmark.tags.slice(0, 3).map((tag, index) => (
            <TagChip key={index} tag={tag} />
          ))}
          {thoughtmark.tags.length > 3 && (
            <Text style={styles.moreTagsText}>
              +{thoughtmark.tags.length - 3} more
            </Text>
          )}
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date(thoughtmark.createdAt).toLocaleDateString()}
        </Text>
        {thoughtmark.isTask && (
          <View style={[
            styles.taskBadge, 
            thoughtmark.isCompleted && styles.completedBadge
          ]}>
            <Text style={styles.taskText}>
              {thoughtmark.isCompleted ? '✓ Done' : '◯ Task'}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  pinnedIndicator: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pinnedText: {
    fontSize: 12,
  },
  content: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  moreTagsText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  taskBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
  },
  taskText: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '500',
  },
});