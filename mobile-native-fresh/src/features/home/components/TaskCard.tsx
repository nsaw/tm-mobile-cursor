import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../../components/ui/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkWithBin } from '../../../types';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    content?: string;
    isCompleted?: boolean;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  };
  onPress: () => void;
  onToggle: () => void;
  style?: ViewStyle;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  style
}) => {;
  const { tokens } = useTheme();
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = !!task.isCompleted;
;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      borderColor: tokens.colors.border,
      marginBottom: tokens.spacing.sm
    },
    content: {
      flex: 1
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isCompleted ? tokens.colors.accent : tokens.colors.border,
      backgroundColor: isCompleted ? tokens.colors.accent : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: tokens.spacing.md,
      marginTop: 2
    },
    textContainer: {
      flex: 1
    },
    title: {
      color: isOverdue ? '#FCA5A5' : isCompleted ? tokens.colors.textSecondary : tokens.colors.text,
      marginBottom: tokens.spacing.sm,
      textDecorationLine: isCompleted ? 'line-through' : 'none',
      fontSize: tokens.typography.fontSize.body,
      fontWeight: isCompleted ? 'normal' : '600'
    },
    contentText: {
      color: isCompleted ? tokens.colors.textSecondary : tokens.colors.textSecondary,
      marginBottom: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.sm
    },
    dueDate: {
      color: isOverdue ? '#FCA5A5' : tokens.colors.textSecondary,
      fontFamily: 'Ubuntu_400Regular',
      marginLeft: 11,
      textAlign: 'right',
      minWidth: 86,
      fontSize: tokens.typography.fontSize.sm
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    icon: {
      color: isCompleted ? tokens.colors.accent : tokens.colors.textSecondary
    },
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: tokens.spacing.sm
    },
    priorityLow: {
      backgroundColor: tokens.colors.success
    },
    priorityMedium: {
      backgroundColor: tokens.colors.warning
    },
    priorityHigh: {
      backgroundColor: tokens.colors.danger
    }
  });
;
  const formatDueDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'No due date';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
;
  const getPriorityColor = () => {
    if (task.priority) {
      switch (task.priority) {
        case 'high':
          return styles.priorityHigh;
        case 'medium':
          return styles.priorityMedium;
        case 'low':
          return styles.priorityLow;
        default:
          return styles.priorityLow;
      }
    }
    return styles.priorityLow;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style, isOverdue && { borderColor: tokens.colors.danger }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={e => {
          e.stopPropagation();
          onToggle();
        }}
        accessibilityRole="button"
      >
        {task.isCompleted && (
          <Ionicons name="checkmark" size={16} color={tokens?.colors?.background ?? "#000000"} />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title || 'Untitled Task'}
          </Text>
          {task.dueDate && (
            <Text style={isOverdue ? { ...styles.dueDate, color: tokens.colors.danger } : styles.dueDate}>
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
        {task.content && (
          <Text style={styles.contentText} numberOfLines={2}>
            {task.content}
          </Text>
        )}
      </View>
      
      {task.priority && (
        <View style={[styles.priorityIndicator, getPriorityColor()]} />
      )}
    </TouchableOpacity>
  );
}; 