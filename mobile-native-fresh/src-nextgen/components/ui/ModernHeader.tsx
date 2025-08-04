import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

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
  style?: any;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  style,
}) => {
  const { theme } = useTheme();

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
      fontSize: theme.typography.fontSize.heading,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.caption,
      fontWeight: theme.typography.fontWeight.normal as any,
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
      fontSize: theme.typography.fontSize.body,
      fontWeight: theme.typography.fontWeight.bold as any,
      color: theme.colors.onAccent,
    },
    placeholder: {
      width: 40,
    },
  });

  return (
    <View style={[styles.header, style]}>
      {leftAction ? (
        <TouchableOpacity style={styles.actionButton} onPress={leftAction.onPress}>
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
        <TouchableOpacity style={styles.actionButton} onPress={rightAction.onPress}>
          <Text style={styles.actionText}>{rightAction.icon || '→'}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}; 