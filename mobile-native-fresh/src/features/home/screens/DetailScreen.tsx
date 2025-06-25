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
import { useTheme } from '../../../theme/ThemeProvider';
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
  const { tokens } = useTheme();
  const styles = getStyles(tokens);
  
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
          <Ionicons name="arrow-back" size={24} color={tokens?.colors?.text ?? '#000'} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {thoughtmark.isPinned && (
            <Ionicons name="pin" size={20} color={tokens?.colors?.accent ?? '#000'} />
          )}
          
          <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color={tokens?.colors?.text ?? '#000'} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={tokens?.colors?.text ?? '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{thoughtmark.title || 'Untitled'}</Text>
        
        {bin && (
          <View style={styles.binInfo}>
            <Ionicons name="folder-outline" size={16} color={tokens?.colors?.textSecondary ?? '#000'} />
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
              color={thoughtmark.isCompleted ? tokens?.colors?.accent ?? '#000' : tokens?.colors?.textSecondary ?? '#000'} 
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
          <Ionicons name="trash-outline" size={20} color={tokens?.colors?.danger ?? '#EF4444'} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (tokens: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens?.colors?.background ?? '#0D0D0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens?.colors?.border ?? '#000',
  },
  headerButton: {
    padding: tokens.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: tokens.spacing.lg,
  },
  title: {
    ...tokens.typography.heading,
    color: tokens?.colors?.text ?? '#000',
    marginBottom: tokens.spacing.md,
  },
  binInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
  },
  binName: {
    ...tokens.typography.body,
    color: tokens?.colors?.textSecondary ?? '#000',
    marginLeft: tokens.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: tokens.spacing.md,
  },
  tag: {
    backgroundColor: tokens?.colors?.card ?? '#000',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.spacing.sm,
    marginRight: tokens.spacing.xs,
    marginBottom: tokens.spacing.xs,
  },
  tagText: {
    ...tokens.typography.body,
    fontSize: 12,
    color: tokens?.colors?.textSecondary ?? '#000',
  },
  contentText: {
    ...tokens.typography.body,
    color: tokens?.colors?.text ?? '#000',
    lineHeight: 24,
    marginBottom: tokens.spacing.lg,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens?.colors?.card ?? '#000',
    padding: tokens.spacing.md,
    borderRadius: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
  },
  taskText: {
    ...tokens.typography.body,
    color: tokens?.colors?.text ?? '#000',
    marginLeft: tokens.spacing.sm,
    flex: 1,
  },
  dueDate: {
    ...tokens.typography.body,
    fontSize: 12,
    color: tokens?.colors?.textSecondary ?? '#000',
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens?.colors?.border ?? '#000',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  deleteButtonText: {
    ...tokens.typography.body,
    color: tokens?.colors?.danger ?? '#EF4444',
    marginLeft: tokens.spacing.xs,
  },
  errorText: {
    ...tokens.typography.body,
    color: tokens?.colors?.danger ?? '#EF4444',
    textAlign: 'center',
    marginTop: tokens.spacing.xl,
  },
});