import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../../theme/tokens';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  onTagPress?: (tag: string) => void;
  totalCount: number;
}

const getStyles = () => StyleSheet.create({
  container: {
    marginBottom: designTokens.spacing.lg ?? 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: designTokens.spacing.sm ?? 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 8,
    color: designTokens.colors.textSecondary ?? '#888',
    marginLeft: designTokens.spacing.sm ?? 10,
    textTransform: 'lowercase',
  },
  moreButton: {
    paddingHorizontal: designTokens.spacing.sm ?? 10,
  },
  moreText: {
    fontSize: 8,
    color: designTokens.colors.textSecondary ?? '#888',
  },
  scrollContent: {
    paddingHorizontal: designTokens.spacing.lg ?? 20,
  },
  tagChip: {
    paddingHorizontal: designTokens.spacing.md ?? 10,
    paddingVertical: designTokens.spacing.sm ?? 5,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: designTokens.colors.border ?? '#888',
    marginRight: designTokens.spacing.sm ?? 10,
    minHeight: 32,
    justifyContent: 'center',
  },
  tagChipSelected: {
    backgroundColor: designTokens.colors.accent ?? '#FFD500',
    borderColor: designTokens.colors.accent ?? '#FFD500',
  },
  tagText: {
    fontSize: 10,
    color: designTokens.colors.textSecondary ?? '#888',
    textTransform: 'lowercase',
    fontWeight: '400',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  onTagPress,
  totalCount,
}) => {
  const styles = getStyles();

  const getTagCount = (tag: string) => {
    // This would need to be passed from parent or calculated
    // For now, return a placeholder
    return Math.floor(Math.random() * 10) + 1;
  };

  const handleTagPress = (tag: string) => {
    if (onTagPress) {
      onTagPress(tag);
    } else {
      onTagSelect(tag);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="filter-outline" size={16} color={designTokens.colors.textSecondary ?? '#888'} />
          <Text style={styles.headerText}>tags</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>...</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All tag */}
        <TouchableOpacity
          style={[
            styles.tagChip,
            selectedTag === 'all' && styles.tagChipSelected,
          ]}
          onPress={() => onTagSelect('all')}
        >
          <Text
            style={[
              styles.tagText,
              selectedTag === 'all' && styles.tagTextSelected,
            ]}
          >
            all ({totalCount})
          </Text>
        </TouchableOpacity>

        {/* Individual tags */}
        {tags.sort().map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagChip,
              selectedTag === tag && styles.tagChipSelected,
            ]}
            onPress={() => handleTagPress(tag)}
          >
            <Text
              style={[
                styles.tagText,
                selectedTag === tag && styles.tagTextSelected,
              ]}
            >
              {tag.toLowerCase()} ({getTagCount(tag)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}; 