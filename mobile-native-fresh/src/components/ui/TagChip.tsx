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
  
  // Compact outlined style overrides
  const compactStyle = {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: isSelected ? tokens.colors.accent : tokens.colors.border,
    backgroundColor: isSelected ? 'transparent' : 'transparent',
  };

  // Apply selected state or outline variant
  const finalChipStyle = {
    ...chipStyle,
    backgroundColor: 'transparent', // Always transparent
    borderColor: isSelected ? tokens.colors.accent : tokens.colors.border,
  };

  const textStyle = {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: 'Ubuntu_500Medium',
    color: isSelected ? tokens.colors.accent : tokens.colors.text,
  };

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle, compactStyle]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle, { paddingHorizontal: 0 }]}>#
        {tag}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 