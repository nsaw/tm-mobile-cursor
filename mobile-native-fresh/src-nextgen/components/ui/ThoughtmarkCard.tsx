import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export interface Thoughtmark {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  isTask?: boolean;
  isDeleted?: boolean;
  binId?: number;
}

export interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: any;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  onPress,
  onLongPress,
  style,
}) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: theme.typography.fontSize.heading,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    content: {
      fontSize: theme.typography.fontSize.body,
      fontWeight: theme.typography.fontWeight.normal as any,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    tag: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
    },
    tagText: {
      fontSize: theme.typography.fontSize.caption,
      fontWeight: theme.typography.fontWeight.medium as any,
      color: theme.colors.onAccent,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{thoughtmark.title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {thoughtmark.content}
      </Text>
      {thoughtmark.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {thoughtmark.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}; 