import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
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
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  
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
      style={[
        styles.container,
        isOverdue && styles.overdueContainer,
        style,
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
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                task.isCompleted && styles.titleCompleted,
                isOverdue && styles.overdueTitle,
              ]}
              numberOfLines={1}
            >
              {task.title || 'Untitled Task'}
            </Text>
            
            {task.dueDate && (
              <Text
                style={[
                  styles.dueDate,
                  isOverdue && styles.overdueDate,
                ]}
              >
                {formatDueDate(task.dueDate)}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: spacing.sm,
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
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
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
    fontSize: 13,
    fontWeight: '400',
    marginBottom: spacing.xs,
    color: colors.text,
    fontFamily: 'Ubuntu_400Regular',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
    fontFamily: 'Ubuntu_500Medium',
  },
  overdueTitle: {
    color: '#FCA5A5', // Light red
    fontFamily: 'Ubuntu_500Medium',
  },
  dueDate: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: 'Ubuntu_400Regular',
    marginLeft: 8,
    textAlign: 'right',
    minWidth: 48,
  },
  overdueDate: {
    color: '#FCA5A5', // Light red
    fontFamily: 'Ubuntu_400Regular',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}); 