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
  const { tokens: designTokens } = useTheme();
  const [showAllTags, setShowAllTags] = useState(false);

  const styles = StyleSheet.create({
    clearButton: {
      paddingHorizontal: designTokens.spacing.sm ?? 10,
    },
    clearText: {
      color: designTokens.colors.textSecondary ?? '#888',
      fontSize: designTokens.typography.fontSize.sm,
    },
    container: {
      marginBottom: designTokens.spacing.lg ?? 20,
    },
    filterIcon: {
      marginRight: designTokens.spacing.xs,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: designTokens.spacing.sm ?? 10,
    },
    tag: {
      borderColor: designTokens.colors.border ?? '#888',
      borderRadius: designTokens.radius.md ?? 20,
      borderWidth: 1,
      marginRight: designTokens.spacing.sm ?? 10,
      paddingHorizontal: designTokens.spacing.lg ?? 20,
      paddingVertical: designTokens.spacing.sm ?? 5,
    },
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: designTokens.spacing.md ?? 10,
      paddingHorizontal: designTokens.spacing.md ?? 10,
      paddingVertical: designTokens.spacing.sm ?? 5,
    },
    tagSelected: {
      backgroundColor: designTokens.colors.accent ?? '#FFD500',
      borderColor: designTokens.colors.accent ?? '#FFD500',
    },
    tagText: {
      color: designTokens.colors.textSecondary ?? '#888',
      fontSize: designTokens.typography.fontSize.sm,
    },
    tagsContainer: {
      paddingHorizontal: designTokens.spacing.lg ?? 20,
    },
    title: {
      color: designTokens.colors.textSecondary ?? '#888',
      fontSize: designTokens.typography.fontSize.body,
      fontWeight: designTokens.typography.fontWeight.semibold,
      marginLeft: designTokens.spacing.sm ?? 10,
    },
  });

  const displayedTags = showAllTags ? tags : tags.slice(0, 5);
  const hasMoreTags = tags.length > 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="filter-outline" size={16} color={designTokens.colors.textSecondary ?? '#888'} />
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
              onPress={() => onTagToggle(tag)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
            >
              <Text style={[
                styles.tagText,
                selectedTags.includes(tag) && { color: designTokens.colors.background }
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
          
          {hasMoreTags && (
            <TouchableOpacity
              style={styles.tag}
              onPress={() => setShowAllTags(!showAllTags)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
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