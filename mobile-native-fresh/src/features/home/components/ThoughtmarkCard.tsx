import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Alert,
} from 'react-native';
import { formatDistanceToNow, isWithinInterval, subDays } from 'date-fns';
import { apiService } from '../../../services/api';
import type { Thoughtmark } from '../../../types';

interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  style?: ViewStyle;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionToggle?: (id: number) => void;
  showSimilarity?: boolean;
  similarity?: number;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  onPress,
  onEdit,
  onDelete,
  onArchive,
  style,
  isSelectable = false,
  isSelected = false,
  onSelectionToggle,
  showSimilarity = false,
  similarity,
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    const createdDate = new Date(dateString);
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    
    if (isWithinInterval(createdDate, { start: sevenDaysAgo, end: now })) {
      return createdDate.toLocaleDateString('en-US', { weekday: 'short' });
    }
    
    return createdDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: createdDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const truncateContent = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handleTogglePin = async () => {
    try {
      await apiService.togglePin(thoughtmark.id);
      // Refresh data or use callback
    } catch (error) {
      Alert.alert('Error', 'Failed to update pin status');
    }
  };

  const handleCardPress = () => {
    if (isSelectable && onSelectionToggle) {
      onSelectionToggle(thoughtmark.id);
    } else {
      onPress();
    }
  };

  const showActionMenu = () => {
    const options = ['View', 'Edit', thoughtmark.isPinned ? 'Unpin' : 'Pin', 'Share'];
    if (onArchive) options.push(thoughtmark.isArchived ? 'Unarchive' : 'Archive');
    if (onDelete) options.push('Delete');
    options.push('Cancel');

    Alert.alert(
      thoughtmark.title,
      'Choose an action',
      options.map((option, index) => ({
        text: option,
        style: option === 'Delete' ? 'destructive' : option === 'Cancel' ? 'cancel' : 'default',
        onPress: () => {
          switch (option) {
            case 'View': onPress(); break;
            case 'Edit': onEdit?.(); break;
            case 'Pin':
            case 'Unpin': handleTogglePin(); break;
            case 'Archive':
            case 'Unarchive': onArchive?.(); break;
            case 'Delete': onDelete?.(); break;
          }
        }
      }))
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        thoughtmark.isPinned && styles.pinnedContainer,
        isSelected && styles.selectedContainer,
        style
      ]}
      onPress={handleCardPress}
      onLongPress={showActionMenu}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {isSelectable && (
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {thoughtmark.title}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {showSimilarity && similarity !== undefined && (
            <View style={styles.similarityBadge}>
              <Text style={styles.similarityText}>{Math.round(similarity * 100)}%</Text>
            </View>
          )}
          {thoughtmark.isPinned && (
            <View style={styles.pinnedIndicator}>
              <Text style={styles.pinnedIcon}>📌</Text>
            </View>
          )}
          <Text style={styles.timestamp}>
            {formatDate(thoughtmark.createdAt)}
          </Text>
        </View>
      </View>

      {thoughtmark.content && (
        <Text style={styles.content} numberOfLines={3}>
          {truncateContent(thoughtmark.content)}
        </Text>
      )}

      {thoughtmark.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {thoughtmark.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {thoughtmark.tags.length > 3 && (
            <Text style={styles.moreTagsText}>+{thoughtmark.tags.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.indicators}>
          {thoughtmark.voiceNoteUrl && (
            <Text style={styles.indicatorIcon}>🎤</Text>
          )}
          {thoughtmark.aiSummary && (
            <Text style={styles.indicatorIcon}>🤖</Text>
          )}
          {thoughtmark.completedAt && (
            <Text style={styles.indicatorIcon}>✅</Text>
          )}
        </View>
      </View>

      {thoughtmark.isArchived && (
        <View style={styles.archivedOverlay}>
          <Text style={styles.archivedText}>Archived</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  pinnedIndicator: {
    marginLeft: 8,
  },
  pinnedIcon: {
    fontSize: 14,
  },
  content: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#999999',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    marginLeft: 6,
  },
  indicatorIcon: {
    fontSize: 12,
  },
  archivedOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  archivedText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});