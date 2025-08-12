import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';

interface Thoughtmark {
  id: string;
  title: string;
  content?: string;
  tags?: string[];
}

interface ThoughtmarkCardProps {
  thoughtmark: Thoughtmark;
  pinned?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onPinToggle: (id: string, pinned: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export const ThoughtmarkCard: React.FC<ThoughtmarkCardProps> = ({
  thoughtmark,
  pinned = false,
  onClick,
  onEdit,
  onPinToggle,
  style,
}) => {
  const { tokens } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onClick}
      accessibilityRole='button'
      accessible={true}
      accessibilityLabel='Thoughtmark card'
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {thoughtmark.title || 'Untitled'}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPinToggle(thoughtmark.id, !pinned)}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Toggle pin'
          >
            <Ionicons
              name={pinned ? 'pin' : 'pin-outline'}
              size={16}
              color={pinned ? tokens.colors.accent : tokens.colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Edit thoughtmark'
          >
            <Ionicons name='create-outline' size={16} color={tokens.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {thoughtmark.content || 'No content'}
      </Text>
      {thoughtmark.tags && thoughtmark.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {thoughtmark.tags.slice(0, 3).map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {thoughtmark.tags.length > 3 && (
            <Text style={styles.moreTags}>+{thoughtmark.tags.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
    marginLeft: 4,
  },
  content: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#333333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  moreTags: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});
