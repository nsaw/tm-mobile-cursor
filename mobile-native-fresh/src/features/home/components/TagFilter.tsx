import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagToggle,
  onClearAll,
}) => {
  const { tokens } = useTheme();
  const [showAllTags, setShowAllTags] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: tokens.spacing.lg ?? 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm ?? 10,
    },
    title: {
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.textSecondary ?? '#888',
      marginLeft: tokens.spacing.sm ?? 10,
    },
    clearButton: {
      paddingHorizontal: tokens.spacing.sm ?? 10,
    },
    clearText: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary ?? '#888',
    },
    tagsContainer: {
      paddingHorizontal: tokens.spacing.lg ?? 20,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md ?? 10,
      paddingHorizontal: tokens.spacing.md ?? 10,
      paddingVertical: tokens.spacing.sm ?? 5,
    },
    tag: {
      paddingHorizontal: tokens.spacing.lg ?? 20,
      paddingVertical: tokens.spacing.sm ?? 5,
      borderRadius: tokens.radius.md ?? 20,
      borderWidth: 1,
      borderColor: tokens.colors.border ?? '#888',
      marginRight: tokens.spacing.sm ?? 10,
    },
    tagSelected: {
      backgroundColor: tokens.colors.accent ?? '#FFD500',
      borderColor: tokens.colors.accent ?? '#FFD500',
    },
    tagText: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary ?? '#888',
    },
    filterIcon: {
      marginRight: tokens.spacing.xs,
    },
  });

  const displayedTags = showAllTags ? tags : tags.slice(0, 5);
  const hasMoreTags = tags.length > 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="filter-outline" size={16} color={tokens.colors.textSecondary ?? '#888'} />
          <Text style={styles.title}>Filter by tags</Text>
        </View>
        {selectedTags.length > 0 && (
          <TouchableOpacity onPress={onClearAll} style={styles.clearButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagsContainer}
      >
        <View style={styles.tagRow}>
          {displayedTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                selectedTags.includes(tag) && styles.tagSelected,
              ]}
              onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onTagToggle(tag)}
            >
              <Text style={[
                styles.tagText,
                selectedTags.includes(tag) && { color: tokens.colors.background }
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
          
          {hasMoreTags && (
            <TouchableOpacity
              style={styles.tag}
              onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setShowAllTags(!showAllTags)}
            >
              <Text style={styles.tagText}>
                {showAllTags ? 'Show less' : `+${tags.length - 5} more`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}; 