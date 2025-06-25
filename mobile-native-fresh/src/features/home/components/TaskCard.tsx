import { Text ,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../theme/ThemeProvider';
import { ThoughtmarkWithBin } from '../../../types';

interface TaskCardProps {
  task: ThoughtmarkWithBin;
  onPress: () => void;
  onToggle: () => void;
  style?: ViewStyle;
}

const getStyles = (tokens: any, isCompleted: boolean, isOverdue: boolean) => StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
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
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: tokens.typography.fontSize.body,
    fontWeight: isCompleted ? '400' : '600',
    color: isOverdue ? '#FCA5A5' : isCompleted ? tokens.colors.textSecondary : tokens.colors.text,
    marginBottom: tokens.spacing.xs,
    textDecorationLine: isCompleted ? 'line-through' : 'none',
  },
  dueDate: {
    fontSize: tokens.typography.fontSize.sm,
    color: isOverdue ? '#FCA5A5' : tokens.colors.textSecondary,
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
    color: isCompleted ? tokens.colors.accent : tokens.colors.textSecondary,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: tokens.spacing.sm,
  },
  priorityLow: {
    backgroundColor: tokens.colors.success,
  },
  priorityMedium: {
    backgroundColor: tokens.colors.warning,
  },
  priorityHigh: {
    backgroundColor: tokens.colors.danger,
  },
});

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  style,
}) => {
  const { tokens } = useTheme();
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const styles = getStyles(tokens, !!task.isCompleted, !!isOverdue);
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
      style={[styles.container, style, isOverdue && { borderColor: tokens.colors.danger }]}
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
          <Ionicons name="checkmark" size={16} color={tokens.colors.background} />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {task.title || 'Untitled Task'}
          </Text>
          {task.dueDate && (
            <Text style={[styles.dueDate, isOverdue && { color: tokens.colors.danger }]}>
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
      
      {task.priority && (
        <View style={[styles.priorityIndicator, getPriorityColor()]} />
      )}
    </TouchableOpacity>
  );
}; 