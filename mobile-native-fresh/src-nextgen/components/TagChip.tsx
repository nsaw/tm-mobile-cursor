import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

interface TagChipProps {
  tag: string;
  isSelected?: boolean;
  onPress?: (tag: string) => void;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/* eslint-disable no-unused-vars */
export const TagChip: React.FC<TagChipProps> = ({
  tag,
  isSelected = false,
  onPress,
  variant = 'outline',
  size = 'md',
}: TagChipProps) => {
/* eslint-enable no-unused-vars */
  const { tokens: designTokens } = useTheme();

  // Guard against undefined designTokens
  if (!designTokens) {
    console.warn('TagChip: theme designTokens not initialized');
    return null;
  }

  // Get size styles
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
          paddingHorizontal: designTokens.spacing.md,
          paddingVertical: designTokens.spacing.sm,
          borderRadius: 8,
        };
    }
  };

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          borderColor: designTokens.colors.accent,
          backgroundColor: isSelected ? designTokens.colors.accent : 'transparent',
        };
      case 'success':
        return {
          borderColor: designTokens.colors.success,
          backgroundColor: isSelected ? designTokens.colors.success : 'transparent',
        };
      case 'warning':
        return {
          borderColor: designTokens.colors.warning,
          backgroundColor: isSelected ? designTokens.colors.warning : 'transparent',
        };
      case 'danger':
        return {
          borderColor: designTokens.colors.error,
          backgroundColor: isSelected ? designTokens.colors.error : 'transparent',
        };
      default: // outline
        return {
          borderColor: isSelected ? designTokens.colors.accent : designTokens.colors.border,
          backgroundColor: 'transparent',
        };
    }
  };

  const chipStyle = {
    ...getSizeStyle(),
    ...getVariantStyle(),
    borderWidth: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  const textColor = isSelected 
    ? (variant === 'outline' ? designTokens.colors.accent : '#FFFFFF')
    : designTokens.colors.text;

  return (
    <TouchableOpacity
      style={[styles.container, chipStyle]}
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
          color: textColor,
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