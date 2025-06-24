import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  onTagPress?: (tag: string) => void;
  totalCount: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  onTagPress,
  totalCount,
}) => {
  const getTagColor = (tag: string) => {
    const colors = [
      '#C6D600', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84',
      '#EE5A6F', '#C44569', '#F8B500', '#6C5CE7', '#A55EEA', '#26DE81',
      '#FC427B', '#FD79A8', '#FDCB6E', '#74B9FF', '#00B894', '#E84393',
      '#00CEC9', '#E17055', '#81ECEC', '#FAB1A0'
    ];
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

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
          <Ionicons name="filter-outline" size={16} color={colors.subtext} />
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
              {tag} ({getTagCount(tag)})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    color: colors.subtext,
    marginLeft: spacing.sm,
    textTransform: 'lowercase',
  },
  moreButton: {
    paddingHorizontal: spacing.sm,
  },
  moreText: {
    fontSize: 12,
    color: colors.subtext,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  tagChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    minHeight: 32,
    justifyContent: 'center',
  },
  tagChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 10,
    color: colors.subtext,
    textTransform: 'lowercase',
    fontWeight: '400',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 