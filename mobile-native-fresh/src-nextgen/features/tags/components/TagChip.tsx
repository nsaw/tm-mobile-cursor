import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tag } from '../types/tagTypes';

interface TagChipProps {
  tag: Tag;
  onPress?: (tag: Tag) => void;
  onRemove?: (tag: Tag) => void;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  onPress,
  onRemove,
  showCount = false,
  size = 'medium',
}) => {
  const handlePress = () => {
    if (onPress) onPress(tag);
  };

  const handleRemove = () => {
    if (onRemove) onRemove(tag);
  };

  return (
    <TouchableOpacity
      style={[styles.container, styles[size], { backgroundColor: tag.color }]}
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
     accessibilityRole="button" accessible={true} accessibilityLabel="Button">
      <Text style={[styles.text, styles[`${size}Text`]]} numberOfLines={1}>
        {tag.name}
      </Text>
      {showCount && tag.usageCount > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{tag.usageCount}</Text>
        </View>
      )}
      {onRemove && !tag.isSystem && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
         accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    color: '#fff',
    fontWeight: '500',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  countBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});
