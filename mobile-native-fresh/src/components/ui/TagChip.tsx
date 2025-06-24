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
  variant = 'default',
  size = 'md',
}) => {
  const { tokens } = useTheme();

  // Get variant styles
  const baseStyle = badgeVariants.base;
  const variantStyle = badgeVariants.variants.variant[variant] || badgeVariants.variants.variant.default;
  const sizeStyle = badgeVariants.variants.size[size];

  // Merge all styles
  const chipStyle = mergeVariantStyles(baseStyle, {
    variant: variantStyle,
    size: sizeStyle,
  });

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

  return (
    <TouchableOpacity
      style={[styles.container, finalChipStyle]}
      onPress={() => onPress?.(tag)}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: textColor }]}>
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