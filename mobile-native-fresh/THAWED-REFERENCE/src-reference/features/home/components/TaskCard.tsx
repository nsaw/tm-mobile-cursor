import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../../components/ui/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkWithBin } from '../../../types';

interface TaskCardProps {
  task: ThoughtmarkWithBin;
  onPress: () => void;
  onToggle: () => void;
  style?: ViewStyle;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  style,
}) => {
  const { tokens: designTokens } = useTheme();
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = !!task.isCompleted;
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.md,
      padding: designTokens.spacing.lg,
      paddingVertical: designTokens.spacing.md,
      marginBottom: designTokens.spacing.md,
      borderWidth: 1,
      borderColor: designTokens.colors.border,
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
    },
    content: {
      flex: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isCompleted ? designTokens.colors.accent : designTokens.colors.border,
      backgroundColor: isCompleted ? designTokens.colors.accent : 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: designTokens.spacing.sm,
      marginTop: 2,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: isOverdue ? '#FCA5A5' : isCompleted ? designTokens.colors.textSecondary : designTokens.colors.text,
      marginBottom: designTokens.spacing.xs,
      textDecorationLine: isCompleted ? 'line-through' : 'none',
    },
    contentText: {
      color: isCompleted ? designTokens.colors.textSecondary : designTokens.colors.textSecondary,
      marginBottom: designTokens.spacing.xs,
    },
    dueDate: {
      color: isOverdue ? '#FCA5A5' : designTokens.colors.textSecondary,
      fontFamily: 'Ubuntu_400Regular',
      marginLeft: 11,
      textAlign: 'right',
      minWidth: 86,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    icon: {
      color: isCompleted ? designTokens.colors.accent : designTokens.colors.textSecondary,
    },
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: designTokens.spacing.sm,
    },
    priorityLow: {
      backgroundColor: designTokens.colors.success,
    },
    priorityMedium: {
      backgroundColor: designTokens.colors.warning,
    },
    priorityHigh: {
      backgroundColor: designTokens.colors.danger,
    },
  });
  const formatDueDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'No due date';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

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
      style={[styles.container, style, isOverdue && { borderColor: designTokens.colors.danger }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessible={true}
      accessibilityLabel="Task card"
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        accessibilityRole="button"
        accessible={true}
        accessibilityLabel="Toggle task completion"
      >
        {task.isCompleted && (
          <Ionicons name="checkmark" size={16} color={designTokens.colors.background} />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            variant={isCompleted ? "muted" : "body"}
            weight={isCompleted ? "normal" : "semibold"}
            style={styles.title}
            numberOfLines={1}
          >
            {task.title || 'Untitled Task'}
          </Text>
          {task.dueDate && (
            <Text 
              variant="caption"
              style={isOverdue ? { ...styles.dueDate, color: designTokens.colors.danger } : styles.dueDate}
            >
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
        {task.content && (
          <Text
            variant="muted"
            style={styles.contentText}
            numberOfLines={2}
          >
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