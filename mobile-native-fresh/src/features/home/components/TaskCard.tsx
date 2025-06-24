import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { ThoughtmarkWithBin } from '../../../types';

interface TaskCardProps {
  task: ThoughtmarkWithBin;
  onPress: () => void;
  onToggle: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOverdue && styles.overdueContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            task.isCompleted && styles.checkboxCompleted,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <Ionicons
            name={task.isCompleted ? 'checkmark' : 'ellipse-outline'}
            size={16}
            color={task.isCompleted ? colors.primary : colors.subtext}
          />
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              task.isCompleted && styles.titleCompleted,
              isOverdue && styles.overdueTitle,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          
          {task.dueDate && (
            <Text
              style={[
                styles.dueDate,
                isOverdue && styles.overdueDate,
              ]}
            >
              Due {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overdueContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
  },
  overdueTitle: {
    color: '#FCA5A5', // Light red
  },
  dueDate: {
    fontSize: 12,
    color: colors.primary,
  },
  overdueDate: {
    color: '#FCA5A5', // Light red
  },
}); 