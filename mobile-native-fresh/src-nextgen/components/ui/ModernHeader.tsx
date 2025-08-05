import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface ModernHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon?: string;
    onPress: () => void;
  };
  rightAction?: {
    icon?: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.h1,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSize.caption,
      fontWeight: theme.fontWeight.normal,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.onAccent,
    },
    placeholder: {
      width: 40,
    },
  });

  return (
    <View style={[styles.header, style]}>
      {leftAction ? (
        <TouchableOpacity style={styles.actionButton} onPress={leftAction.onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.actionText}>{leftAction.icon || '←'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightAction ? (
        <TouchableOpacity style={styles.actionButton} onPress={rightAction.onPress} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.actionText}>{rightAction.icon || '→'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}; 