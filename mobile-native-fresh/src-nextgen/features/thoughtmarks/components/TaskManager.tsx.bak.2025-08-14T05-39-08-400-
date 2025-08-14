import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Thoughtmark } from '../types/thoughtmark';

interface TaskManagerProps {
  tasks: Thoughtmark[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Thoughtmark) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
}) => {
  const renderTask = ({ item }: { item: Thoughtmark }) => {
    const isOverdue = item.dueDate && new Date(item.dueDate) < new Date();
    const isCompleted = item.status === 'completed';

    return (
      <View style={[styles.taskItem, isCompleted && styles.taskCompleted]}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onTaskComplete(item.id)}
        >
          <Ionicons
            name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isCompleted ? '#34c759' : '#666'}
          />
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text style={[
            styles.taskTitle,
            isCompleted && styles.taskTitleCompleted,
          ]}>
            {item.content}
          </Text>
          {item.dueDate && (
            <Text style={[
              styles.dueDate,
              isOverdue && !isCompleted && styles.dueDateOverdue,
            ]}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          )}
          {item.priority !== 'medium' && (
            <View style={[
              styles.priorityBadge,
              item.priority === 'high' && styles.priorityHigh,
              item.priority === 'low' && styles.priorityLow,
            ]}>
              <Text style={styles.priorityText}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> onTaskEdit(item)}
        >
          <Ionicons name='pencil' size={16} color='#666' />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.count}>{tasks.length} tasks</Text>
      </View>
      <FlatList
        data={tasks.filter(task => task.type === 'task')}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: 14,
    color: '#666',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
  dueDateOverdue: {
    color: '#ff3b30',
    fontWeight: '500',
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  priorityHigh: {
    backgroundColor: '#ffebee',
  },
  priorityLow: {
    backgroundColor: '#e8f5e8',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
});
