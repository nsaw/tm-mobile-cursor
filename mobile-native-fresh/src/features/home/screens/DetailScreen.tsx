import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { Thoughtmark } from '../../../types';

export const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { thoughtmarkId } = route.params as { thoughtmarkId: number };
  const { thoughtmarks, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  
  const thoughtmark = thoughtmarks.find(t => t.id === thoughtmarkId);
  const bin = thoughtmark ? bins.find(b => b.id === thoughtmark.binId) : null;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    if (thoughtmark?.id) {
      (navigation as any).navigate('CreateThoughtmark', { 
        thoughtmarkId: thoughtmark.id 
      });
    }
  };

  const handleShare = async () => {
    if (!thoughtmark) return;
    
    try {
      await Share.share({
        message: `${thoughtmark.title}\n\n${thoughtmark.content}`,
        title: thoughtmark.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share thoughtmark');
    }
  };

  const handleDelete = () => {
    if (!thoughtmark) return;
    
    Alert.alert(
      'Delete Thoughtmark',
      'Are you sure you want to delete this thoughtmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThoughtmark(thoughtmark.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete thoughtmark');
            }
          },
        },
      ]
    );
  };

  if (!thoughtmark) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Thoughtmark not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {thoughtmark.isPinned && (
            <Ionicons name="pin" size={20} color={colors.primary} />
          )}
          
          <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{thoughtmark.title || 'Untitled'}</Text>
        
        {bin && (
          <View style={styles.binInfo}>
            <Ionicons name="folder-outline" size={16} color={colors.subtext} />
            <Text style={styles.binName}>{bin.name}</Text>
          </View>
        )}
        
        {thoughtmark.tags && thoughtmark.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {thoughtmark.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
        
        <Text style={styles.contentText}>{thoughtmark.content || 'No content'}</Text>
        
        {thoughtmark.isTask && (
          <View style={styles.taskInfo}>
            <Ionicons 
              name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
              size={20} 
              color={thoughtmark.isCompleted ? colors.primary : colors.subtext} 
            />
            <Text style={styles.taskText}>
              {thoughtmark.isCompleted ? 'Completed' : 'Pending'}
            </Text>
            {thoughtmark.dueDate && (
              <Text style={styles.dueDate}>
                Due: {(() => {
                  try {
                    return new Date(thoughtmark.dueDate).toLocaleDateString();
                  } catch (error) {
                    return 'Invalid date';
                  }
                })()}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },
  binInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  binName: {
    ...typography.body,
    color: colors.subtext,
    marginLeft: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    ...typography.body,
    fontSize: 12,
    color: colors.subtext,
  },
  contentText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
  },
  taskText: {
    ...typography.body,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
  },
  dueDate: {
    ...typography.body,
    fontSize: 12,
    color: colors.subtext,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  deleteButtonText: {
    ...typography.body,
    color: "#EF4444",
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.body,
    color: "#EF4444",
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});