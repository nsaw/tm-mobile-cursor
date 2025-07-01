import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { AutoRoleView } from './AutoRoleView';
import { TagChip } from './TagChip';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagPress: (tag: string) => void;
  onClearAll?: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagPress,
  onClearAll,
}) => {
  const { tokens: designTokens } = useTheme();

  if (tags.length === 0) {
    return null;
  }

  return (
    <ScrollView style={{ marginVertical: designTokens.spacing.sm }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: designTokens.spacing.md }}
      >
        {tags.map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            isSelected={selectedTags.includes(tag)}
            onPress={onTagPress}
            variant={selectedTags.includes(tag) ? 'primary' : 'default'}
            size="sm"
          />
        ))}
        {selectedTags.length > 0 && onClearAll && (
          <TagChip
            tag="Clear All"
            onPress={onClearAll}
            variant="outline"
            size="sm"
          />
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
}); 