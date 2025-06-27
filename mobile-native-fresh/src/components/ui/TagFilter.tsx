import React from 'react';
import { ScrollView } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import AutoRoleView from '../wrappers/AutoRoleView';

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
  

  if (tags.length === 0) {
    return null;
  }

  return (
    <AutoRoleView style={{ marginVertical: tokens.spacing.sm }} forceRole="section">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: tokens.spacing.md }}
      >
        {tags.map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            isSelected={selectedTags.includes(tag)}
            onPress={onTagPress}
            variant={selectedTags.includes(tag) ? 'primary' : 'default'}
          />
        ))}
        {selectedTags.length > 0 && onClearAll && (
          <TagChip
            tag="Clear All"
            onPress={onClearAll}
            variant="outline"
          />
        )}
      </ScrollView>
    </AutoRoleView>
  );
}; 