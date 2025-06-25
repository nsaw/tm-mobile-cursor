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
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../hooks/useBins';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { Thoughtmark } from '../../../types';
import { designTokens } from '../../../theme/tokens';

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: designTokens.colors.background ?? '#0D0D0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: designTokens.colors.border ?? '#000',
  },
  headerButton: {
    padding: designTokens.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: designTokens.spacing.lg,
  },
  title: {
    fontSize: designTokens.typography.fontSize.heading,
    fontFamily: designTokens.typography.fontFamily.heading,
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.text ?? '#000',
    marginBottom: designTokens.spacing.md,
  },
  binInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: designTokens.spacing.md,
  },
  binName: {
    fontSize: designTokens.typography.fontSize.body,
    fontFamily: designTokens.typography.fontFamily.body,
    color: designTokens.colors.textSecondary ?? '#000',
    marginLeft: designTokens.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: designTokens.spacing.md,
  },
  tag: {
    backgroundColor: designTokens.colors.surface ?? '#000',
    paddingHorizontal: designTokens.spacing.sm,
    paddingVertical: designTokens.spacing.xs,
    borderRadius: designTokens.spacing.sm,
    marginRight: designTokens.spacing.xs,
    marginBottom: designTokens.spacing.xs,
  },
  tagText: {
    fontFamily: designTokens.typography.fontFamily.body,
    fontSize: 12,
    color: designTokens.colors.textSecondary ?? '#000',
  },
  contentText: {
    fontSize: designTokens.typography.fontSize.body,
    fontFamily: designTokens.typography.fontFamily.body,
    color: designTokens.colors.text ?? '#000',
    lineHeight: 24,
    marginBottom: designTokens.spacing.lg,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: designTokens.colors.surface ?? '#000',
    padding: designTokens.spacing.md,
    borderRadius: designTokens.spacing.md,
    marginBottom: designTokens.spacing.lg,
  },
  taskText: {
    fontSize: designTokens.typography.fontSize.body,
    fontFamily: designTokens.typography.fontFamily.body,
    color: designTokens.colors.text ?? '#000',
    marginLeft: designTokens.spacing.sm,
    flex: 1,
  },
  dueDate: {
    fontFamily: designTokens.typography.fontFamily.body,
    fontSize: 12,
    color: designTokens.colors.textSecondary ?? '#000',
  },
  footer: {
    paddingHorizontal: designTokens.spacing.lg,
    paddingVertical: designTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: designTokens.colors.border ?? '#000',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: designTokens.spacing.sm,
  },
  deleteButtonText: {
    fontSize: designTokens.typography.fontSize.body,
    fontFamily: designTokens.typography.fontFamily.body,
    color: designTokens.colors.danger ?? '#EF4444',
    marginLeft: designTokens.spacing.xs,
  },
  errorText: {
    fontSize: designTokens.typography.fontSize.body,
    fontFamily: designTokens.typography.fontFamily.body,
    color: designTokens.colors.danger ?? '#EF4444',
    textAlign: 'center',
    marginTop: designTokens.spacing.xl,
  },
});

export const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { thoughtmarkId } = route.params as { thoughtmarkId: number };
  const { thoughtmarks, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const styles = getStyles();
  
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
          <Ionicons name="arrow-back" size={24} color={designTokens.colors.text ?? '#000'} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {thoughtmark.isPinned && (
            <Ionicons name="pin" size={20} color={designTokens.colors.accent ?? '#000'} />
          )}
          
          <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={designTokens.colors.text ?? '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{thoughtmark.title || 'Untitled'}</Text>
        
        {bin && (
          <View style={styles.binInfo}>
            <Ionicons name="folder-outline" size={16} color={designTokens.colors.textSecondary ?? '#000'} />
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
              color={thoughtmark.isCompleted ? designTokens.colors.accent ?? '#000' : designTokens.colors.textSecondary ?? '#000'} 
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
          <Ionicons name="trash-outline" size={20} color={designTokens.colors.danger ?? '#EF4444'} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};