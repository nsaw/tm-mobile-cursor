import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { getBadgeVariants, mergeVariantStyles } from '../../theme/variants';
import { Text } from './Text';

interface TagChipProps {
  tag: string;
  isSelected?: boolean;
  onPress?: (tag: string) => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  isSelected = false,
  onPress,
  variant = 'outline',
}: TagChipProps) => {
  const { tokens } = useTheme();

  // Guard against undefined tokens
  if (!tokens) {
    console.warn('TagChip: theme tokens not initialized');
    return null;
  }

  // Get variant styles using the function with tokens
  const badgeVariants = getBadgeVariants(tokens);
  const baseStyle = badgeVariants.base;
  const variantStyles: Record<string, unknown> = badgeVariants.variants.variant;
  const variantStyle = variantStyles[variant] || variantStyles.outline;

  // Merge all styles first
  const chipStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
  });
  
  // Compact outlined style overrides - scaled by 1.34
  const compactStyle = {
    paddingHorizontal: tokens.spacing.md * 1.34,
    paddingVertical: tokens.spacing.sm, // Equal top and bottom padding for proper centering
    borderRadius: 8, // 6 * 1.34
    borderWidth: 1,
    borderColor: isSelected ? tokens.colors.accent : tokens.colors.border,
    backgroundColor: isSelected ? 'transparent' : 'transparent',
    alignItems: 'center', // Ensure horizontal centering
    justifyContent: 'center', // Ensure vertical centering
  };

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle, compactStyle]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={`tag: ${tag.toLowerCase()}`}
    >
      <Text 
        variant="caption"
        weight="medium"
        style={{
          color: isSelected ? tokens.colors.accent : tokens.colors.text,
          textAlign: 'center',
          paddingHorizontal: 0
        }} 
        numberOfLines={1}
      >
        #{tag.toLowerCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 8, // Reduced from 11 to work better in horizontal scrolling
    marginBottom: 0, // Removed bottom margin for horizontal layout
  },
}); 