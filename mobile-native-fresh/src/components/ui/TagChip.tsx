import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/theme';

interface TagChipProps {
  tag: string;
  onPress?: () => void;
  selected?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({ 
  tag, 
  onPress, 
  selected = false 
}) => {
  return (
    <View style={[
      styles.container,
      selected && styles.selected
    ]}>
      <Text style={[
        styles.text,
        selected && styles.selectedText
      ]}>
        #{tag}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.body,
    fontSize: 10,
    color: colors.subtext,
  },
  selectedText: {
    color: '#FFFFFF',
  },
}); 