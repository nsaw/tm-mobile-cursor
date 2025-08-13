import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme/ThemeProvider';

interface ThoughtmarkTask {
  id: string | number;
  title: string;
  content?: string;
  isCompleted?: boolean;
  dueDate?: string | number | Date | null;
}

interface TaskCardProps {
  task: ThoughtmarkTask;
  onPress: () => void;
  onToggle: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggle,
  style,
}) => {
  const { tokens: _tokens } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      accessibilityRole='button'
      accessible={true}
      accessibilityLabel='Task card'
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.checkbox, task.isCompleted && styles.checkboxCompleted]}
          onPress={onToggle}
          accessibilityRole='checkbox'
          accessible={true}
          accessibilityLabel="Button"
        >
          {task.isCompleted && (
            <Ionicons name='checkmark' size={16} color='#FFFFFF' />
          )}
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={[styles.title, task.isCompleted && styles.titleCompleted]} numberOfLines={2}>
            {task.title || 'Untitled Task'}
          </Text>
          {task.content && (
            <Text style={[styles.description, task.isCompleted && styles.descriptionCompleted]} numberOfLines={2}>
              {task.content}
            </Text>
          )}
        </View>
      </View>
      {task.dueDate && (
        <View style={styles.dueDateContainer}>
          <Ionicons name='calendar-outline' size={14} color='#666666' />
          <Text style={styles.dueDateText}>
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666666',
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#666666',
  },
  description: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  descriptionCompleted: {
    color: '#666666',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dueDateText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
});
