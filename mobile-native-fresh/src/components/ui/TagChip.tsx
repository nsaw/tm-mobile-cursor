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
    paddingHorizontal: tokens.spacing.xs,
    paddingVertical: tokens.spacing.xs,
    borderRadius: 8,
    minHeight: 24,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: variant === 'outline' ? 'transparent' : chipStyle.backgroundColor,
  };

  // Apply selected state or outline variant
  const finalChipStyle = {
    ...chipStyle,
    backgroundColor: variant === 'outline' ? 'transparent' : 
                   isSelected ? tokens.colors.accent : chipStyle.backgroundColor,
    borderColor: variant === 'outline' ? tokens.colors.border :
                isSelected ? tokens.colors.accent : chipStyle.borderColor,
  };

  const textColor = variant === 'outline' ? tokens.colors.textSecondary :
                   isSelected ? tokens.colors.text : tokens.colors.textSecondary;

  const textStyle = {
    color: textColor,
    fontSize: 10,
    fontWeight: '300' as '300',
    fontFamily: 'Ubuntu',
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