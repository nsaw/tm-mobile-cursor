import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { designTokens } from '../../../theme/tokens';
import { ThoughtmarkWithBin } from '../../../types';

interface TaskCardProps {
  task: ThoughtmarkWithBin;
  onPress: () => void;
  onToggle: () => void;
  style?: ViewStyle;
}

const getStyles = (isCompleted: boolean, isOverdue: boolean) => StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.surface ?? '#fff',
    borderRadius: 11,
    padding: designTokens?.spacing?.sm * 1.34,
    borderWidth: 1,
    borderColor: designTokens.colors.border ?? '#000',
    ...(isOverdue && { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 43,
    height: 43,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: designTokens.colors.border ?? '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: designTokens?.spacing?.md * 1.34,
    backgroundColor: isCompleted ? designTokens.colors.accent : designTokens.colors.textSecondary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: isOverdue ? '#FCA5A5' : isCompleted ? designTokens.colors.textSecondary : designTokens.colors.text,
    marginBottom: 5,
    fontFamily: isOverdue ? 'Ubuntu_500Medium' : isCompleted ? 'Ubuntu_500Medium' : 'Ubuntu_600SemiBold',
    textTransform: 'capitalize',
    textDecorationLine: isCompleted ? 'line-through' : 'none',
  },
  dueDate: {
    fontSize: 11,
    color: isOverdue ? '#FCA5A5' : designTokens.colors.accent,
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
});

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  style,
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const styles = getStyles(!!task.isCompleted, !!isOverdue);
  const formatDueDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'No due date';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <Ionicons
            name={task.isCompleted ? 'checkmark' : 'ellipse-outline'}
            size={21}
            style={styles.icon}
          />
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
              <Text style={styles.dueDate}>
                {formatDueDate(task.dueDate)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}; 