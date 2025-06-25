import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { badgeVariants, mergeVariantStyles } from '../../theme/variants';

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

  // Get variant styles
  const baseStyle = badgeVariants.base;
  const variantStyles: { [key: string]: any } = badgeVariants.variants.variant;
  const sizeStyles: { [key: string]: any } = badgeVariants.variants.size;
  const variantStyle = variantStyles[variant] || variantStyles.outline;
  const sizeStyle = sizeStyles[size];

  // Merge all styles first
  const chipStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
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

  // Apply selected state or outline variant
  const finalChipStyle = {
    ...chipStyle,
    backgroundColor: 'transparent', // Always transparent
    borderColor: isSelected ? tokens.colors.accent : tokens.colors.border,
  };

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle, compactStyle]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
    >
      <Text 
        style={{
          fontSize: 12,
          fontWeight: '500' as const,
          fontFamily: 'Ubuntu_500Medium',
          color: isSelected ? tokens.colors.accent : tokens.colors.text,
          textAlign: 'center' as const,
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
  text: {
    fontSize: 10, // Increased from 8 to 10
    fontWeight: '500',
    textAlign: 'center',
  },
}); 