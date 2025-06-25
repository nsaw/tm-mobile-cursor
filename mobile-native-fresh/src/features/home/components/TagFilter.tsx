import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { RFValue } from "react-native-responsive-fontsize";

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
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  const colorArray = [
    tokens?.colors?.accent ?? '#FFD500',
    tokens?.colors?.success ?? '#4CAF50',
    tokens?.colors?.brand ?? '#0057FF',
    tokens?.colors?.danger ?? '#FF3B30',
    tokens?.colors?.warning ?? '#FF9500',
    tokens?.colors?.textSecondary ?? '#888',
  ];

  const getTagColor = (tag: string) => {
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colorArray.length;
    return colorArray[index];
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
          <Ionicons name="filter-outline" size={16} color={tokens?.colors?.textSecondary ?? '#888'} />
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

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    marginBottom: tokens?.spacing?.lg ?? 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens?.spacing?.sm ?? 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 8,
    color: tokens?.colors?.textSecondary ?? '#888',
    marginLeft: tokens?.spacing?.sm ?? 10,
    textTransform: 'lowercase',
  },
  moreButton: {
    paddingHorizontal: tokens?.spacing?.sm ?? 10,
  },
  moreText: {
    fontSize: 8,
    color: tokens?.colors?.textSecondary ?? '#888',
  },
  scrollContent: {
    paddingHorizontal: tokens?.spacing?.lg ?? 20,
  },
  tagChip: {
    paddingHorizontal: tokens?.spacing?.md ?? 10,
    paddingVertical: tokens?.spacing?.sm ?? 5,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens?.colors?.border ?? '#888',
    marginRight: tokens?.spacing?.sm ?? 10,
    minHeight: 32,
    justifyContent: 'center',
  },
  tagChipSelected: {
    backgroundColor: tokens?.colors?.accent ?? '#FFD500',
    borderColor: tokens?.colors?.accent ?? '#FFD500',
  },
  tagText: {
    fontSize: 10,
    color: tokens?.colors?.textSecondary ?? '#888',
    textTransform: 'lowercase',
    fontWeight: '400',
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 