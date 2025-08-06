import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './ui/Text';
import { useTheme } from '../theme/ThemeProvider';
import { AutoRoleView } from './AutoRoleView';
import { Thoughtmark } from '../types/DataTypes';

export interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  _slotType?: 'SEARCH_RESULT' | 'DASHBOARD' | 'BIN_VIEW' | 'PROFILE' | 'DASHBOARD_ENTRY' | 'HOME_RECENT';
  onPress?: (thoughtmark: Thoughtmark) => void;
  onLongPress?: (thoughtmark: Thoughtmark) => void;
  showAuthor?: boolean;
  showStats?: boolean;
  showTags?: boolean;
  compact?: boolean;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  _slotType = 'DASHBOARD',
  onPress,
  onLongPress,
  showAuthor = true,
  showStats = true,
  showTags = true,
  compact = false,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    onPress?.(thoughtmark);
  };

  const handleLongPress = () => {
    onLongPress?.(thoughtmark);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    content: {
      padding: compact ? theme.spacing.sm : theme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    title: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    meta: {
      alignItems: 'flex-end',
    },
    author: {
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    date: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    body: {
      marginBottom: theme.spacing.sm,
    },
    contentText: {
      color: theme.colors.text,
      lineHeight: 20,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.sm,
    },
    tag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    tagText: {
      color: theme.colors.onPrimary,
      fontSize: 12,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <AutoRoleView componentRole="card" style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Thoughtmark: ${thoughtmark.title}`}
        accessibilityHint="Double tap to view details"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.title}>
              <Text variant="body" style={{ color: theme.colors.text, fontWeight: '600' }}>
                {thoughtmark.title}
              </Text>
            </View>
            <View style={styles.meta}>
              {showAuthor && (
                <Text variant="caption" style={styles.author}>
                  {thoughtmark.author}
                </Text>
              )}
              <Text variant="caption" style={styles.date}>
                {formatDate(thoughtmark.createdAt)}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.body}>
            <Text variant="body" style={styles.contentText} numberOfLines={compact ? 2 : 4}>
              {thoughtmark.content}
            </Text>
          </View>

          {/* Tags */}
          {showTags && thoughtmark.tags.length > 0 && (
            <View style={styles.tags}>
              {thoughtmark.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text variant="caption" style={styles.tagText}>
                    #{tag}
                  </Text>
                </View>
              ))}
              {thoughtmark.tags.length > 3 && (
                <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
                  +{thoughtmark.tags.length - 3} more
                </Text>
              )}
            </View>
          )}

          {/* Stats */}
          {showStats && (
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text variant="caption" style={styles.statText}>❤️ {thoughtmark.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="caption" style={styles.statText}>💬 {thoughtmark.comments}</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="caption" style={styles.statText}>📤 {thoughtmark.shares}</Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </AutoRoleView>
  );
}; 