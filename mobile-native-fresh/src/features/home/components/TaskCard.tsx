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
            size={21}
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
    borderRadius: 11,
    padding: spacing.sm * 1.34,
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
    width: 43,
    height: 43,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md * 1.34,
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
    fontFamily: 'Ubuntu_600SemiBold',
    textTransform: 'capitalize',
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
    fontSize: 11,
    color: colors.primary,
    fontFamily: 'Ubuntu_400Regular',
    marginLeft: 11,
    textAlign: 'right',
    minWidth: 86,
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