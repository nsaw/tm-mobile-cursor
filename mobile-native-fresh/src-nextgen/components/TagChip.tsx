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

export const TagChip: React.FC<TagChipProps> = ({
  tag,
  isSelected = false,
  onPress,
  variant = 'outline',
  size = 'md',
}: TagChipProps) => {
  const theme = useTheme();

  // Guard against undefined theme
  if (!theme) {
    console.warn('TagChip: theme not initialized');
    return null;
  }

  // Get size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: 6,
        };
      case 'lg':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: 10,
        };
      default: // md
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: 8,
        };
    }
  };

  // Get variant styles
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          borderColor: theme.colors.accent,
          backgroundColor: isSelected ? theme.colors.accent : 'transparent',
        };
      case 'success':
        return {
          borderColor: theme.colors.success,
          backgroundColor: isSelected ? theme.colors.success : 'transparent',
        };
      case 'warning':
        return {
          borderColor: theme.colors.warning,
          backgroundColor: isSelected ? theme.colors.warning : 'transparent',
        };
      case 'danger':
        return {
          borderColor: theme.colors.error,
          backgroundColor: isSelected ? theme.colors.error : 'transparent',
        };
      default: // outline
        return {
          borderColor: isSelected ? theme.colors.accent : theme.colors.border,
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
    ? (variant === 'outline' ? theme.colors.accent : '#FFFFFF')
    : theme.colors.text;

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
        style={{
          color: textColor,
          textAlign: 'center',
          paddingHorizontal: 0,
          fontWeight: '500'
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