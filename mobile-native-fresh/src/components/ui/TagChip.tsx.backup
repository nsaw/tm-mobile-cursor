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
  size?: 'sm' | 'md' | 'lg';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  isSelected = false,
  onPress,
  variant = 'outline',
  size = 'md',
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
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
          borderRadius: 6,
        };
      case 'lg':
        return {
          paddingHorizontal: tokens.spacing.lg,
          paddingVertical: tokens.spacing.md,
          borderRadius: 10,
        };
      default: // md
        return {
          paddingHorizontal: tokens.spacing.md * 1.34,
          paddingVertical: tokens.spacing.sm,
          borderRadius: 8,
        };
    }
  };

  const compactStyle = {
    ...getSizeStyle(),
    borderWidth: 1,
    borderColor: isSelected ? tokens.colors.accent : tokens.colors.border,
    backgroundColor: isSelected ? 'transparent' : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle, compactStyle]}
      onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button">  onPress?.(tag)}
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