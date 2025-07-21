import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { getBadgeVariants, mergeVariantStyles } from '../theme/variants';

import { Text } from './Text';

interface TagChipProps {
  tag: string;
  isSelected?: boolean;
  onPress?: (tag: string) => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  interactiveRole?: 'chip-select' | 'chip-filter' | 'chip-tag';
}

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  isSelected = false,
  onPress,
  variant = 'outline',
  size = 'md',
  interactiveRole = 'chip-select',
}: TagChipProps) => {
  const { designTokens } = useTheme();

  // Guard against undefined designTokens
  if (!designTokens) {
    console.warn('TagChip: theme designTokens not initialized');
    return null;
  }

  // Get variant styles
  const badgeVariants = getBadgeVariants();
  const baseStyle = badgeVariants.primary; // Use primary as base
  const variantStyle = badgeVariants[variant] || badgeVariants.outline;

  // Merge all styles first
  const chipStyle = mergeVariantStyles(baseStyle, variantStyle);
  
  // Compact outlined style overrides - scaled by 1.34
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: designTokens.spacing.sm,
          paddingVertical: designTokens.spacing.xs,
          borderRadius: 6,
        };
      case 'lg':
        return {
          paddingHorizontal: designTokens.spacing.lg,
          paddingVertical: designTokens.spacing.md,
          borderRadius: 10,
        };
      default: // md
        return {
          paddingHorizontal: designTokens.spacing.md * 1.34,
          paddingVertical: designTokens.spacing.sm,
          borderRadius: 8,
        };
    }
  };

  const compactStyle = {
    ...getSizeStyle(),
    borderWidth: 1,
    borderColor: isSelected ? designTokens.colors.accent : designTokens.colors.border,
    backgroundColor: isSelected ? 'transparent' : 'transparent',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  // Determine role based on selection state and interactiveRole prop
  const getRole = (): string => {
    if (isSelected) {
      return 'chip-select-selected';
    }
    return interactiveRole;
  };

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle, compactStyle]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel={`${getRole()}: ${tag.toLowerCase()}`}
    >
      <Text 
        variant="caption"
        weight="medium"
        contentRole="text-label"
        style={{
          color: isSelected ? designTokens.colors.accent : designTokens.colors.text.primary,
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