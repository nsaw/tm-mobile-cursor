import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
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
        { backgroundColor: tokens?.colors?.surface ?? '#fff' },
        { borderRadius: 11, padding: tokens?.spacing?.sm * 1.34, borderWidth: 1, borderColor: tokens?.colors?.border ?? '#000' },
        isOverdue && { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            { width: 43, height: 43, borderRadius: 21, borderWidth: 3, borderColor: tokens?.colors?.border ?? '#000', justifyContent: 'center', alignItems: 'center', marginRight: tokens?.spacing?.md * 1.34 },
            { backgroundColor: task.isCompleted ? tokens?.colors?.accent : tokens?.colors?.textSecondary },
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <Ionicons
            name={task.isCompleted ? 'checkmark' : 'ellipse-outline'}
            size={21}
            color={task.isCompleted ? tokens?.colors?.accent : tokens?.colors?.textSecondary}
          />
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                { fontSize: 16, fontWeight: '600', color: tokens?.colors?.text, marginBottom: 5, fontFamily: 'Ubuntu_600SemiBold', textTransform: 'capitalize' },
                task.isCompleted && { textDecorationLine: 'line-through', color: tokens?.colors?.textSecondary, fontFamily: 'Ubuntu_500Medium' },
                isOverdue && { color: '#FCA5A5', fontFamily: 'Ubuntu_500Medium' },
              ]}
              numberOfLines={1}
            >
              {task.title || 'Untitled Task'}
            </Text>
            
            {task.dueDate && (
              <Text
                style={[
                  { fontSize: 11, color: tokens?.colors?.accent, fontFamily: 'Ubuntu_400Regular', marginLeft: 11, textAlign: 'right', minWidth: 86 },
                  isOverdue && { color: '#FCA5A5', fontFamily: 'Ubuntu_400Regular' },
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

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    backgroundColor: tokens?.colors?.surface ?? '#fff',
    borderRadius: 11,
    padding: tokens?.spacing?.sm * 1.34,
    borderWidth: 1,
    borderColor: tokens?.colors?.border ?? '#000',
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
    borderColor: tokens?.colors?.border ?? '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens?.spacing?.md * 1.34,
  },
  checkboxCompleted: {
    backgroundColor: tokens?.colors?.accent,
    borderColor: tokens?.colors?.accent,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens?.colors?.text,
    marginBottom: 5,
    fontFamily: 'Ubuntu_600SemiBold',
    textTransform: 'capitalize',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: tokens?.colors?.textSecondary,
    fontFamily: 'Ubuntu_500Medium',
  },
  overdueTitle: {
    color: '#FCA5A5', // Light red
    fontFamily: 'Ubuntu_500Medium',
  },
  dueDate: {
    fontSize: 11,
    color: tokens?.colors?.accent,
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