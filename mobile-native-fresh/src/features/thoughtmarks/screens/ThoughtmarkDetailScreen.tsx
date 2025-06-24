import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { useNavigation, useRoute } from '@react-navigation/native';

export const ThoughtmarkDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { thoughtmarkId } = route.params as { thoughtmarkId: number };
  
  const { thoughtmarks, loading, getThoughtmark, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  
  const [thoughtmark, setThoughtmark] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadThoughtmark();
  }, [thoughtmarkId]);

  const loadThoughtmark = async () => {
    try {
      const data = await getThoughtmark(thoughtmarkId);
      setThoughtmark(data);
    } catch (error) {
      console.error('Error loading thoughtmark:', error);
      Alert.alert('Error', 'Failed to load thoughtmark');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!thoughtmark) return;
    
    setIsLoading(true);
    try {
      await updateThoughtmark(thoughtmark.id, thoughtmark);
      setIsEditing(false);
      Alert.alert('Success', 'Thoughtmark updated successfully');
    } catch (error) {
      console.error('Error updating thoughtmark:', error);
      Alert.alert('Error', 'Failed to update thoughtmark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!thoughtmark) return;
    
    Alert.alert(
      'Delete Thoughtmark',
      'Are you sure you want to delete this thoughtmark? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              await deleteThoughtmark(thoughtmark.id);
              Alert.alert('Success', 'Thoughtmark deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting thoughtmark:', error);
              Alert.alert('Error', 'Failed to delete thoughtmark');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handlePin = async () => {
    if (!thoughtmark) return;
    
    try {
      const updatedThoughtmark = { ...thoughtmark, isPinned: !thoughtmark.isPinned };
      await updateThoughtmark(thoughtmark.id, updatedThoughtmark);
      setThoughtmark(updatedThoughtmark);
    } catch (error) {
      console.error('Error pinning thoughtmark:', error);
      Alert.alert('Error', 'Failed to update thoughtmark');
    }
  };

  const handleComplete = async () => {
    if (!thoughtmark) return;
    
    try {
      const updatedThoughtmark = { ...thoughtmark, isCompleted: !thoughtmark.isCompleted };
      await updateThoughtmark(thoughtmark.id, updatedThoughtmark);
      setThoughtmark(updatedThoughtmark);
    } catch (error) {
      console.error('Error completing thoughtmark:', error);
      Alert.alert('Error', 'Failed to update thoughtmark');
    }
  };

  const getBinName = (binId: number) => {
    const bin = bins.find((b: any) => b.id === binId);
    return bin ? bin.name : 'Unknown Bin';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || !thoughtmark) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading thoughtmark...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePin}
          >
            <Ionicons 
              name={thoughtmark.isPinned ? "pin" : "pin-outline"} 
              size={20} 
              color={thoughtmark.isPinned ? colors.primary : colors.subtext} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={20} color={colors.subtext} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <Card style={styles.titleCard}>
          <Text style={styles.title}>{thoughtmark.title}</Text>
          {thoughtmark.isTask && (
            <TouchableOpacity
              style={[styles.taskStatus, thoughtmark.isCompleted && styles.taskCompleted]}
              onPress={handleComplete}
            >
              <Ionicons 
                name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={thoughtmark.isCompleted ? colors.success : colors.subtext} 
              />
              <Text style={[styles.taskStatusText, thoughtmark.isCompleted && styles.taskCompletedText]}>
                {thoughtmark.isCompleted ? 'Completed' : 'Mark as Complete'}
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Content */}
        <Card style={styles.contentCard}>
          <Text style={styles.contentText}>{thoughtmark.content}</Text>
        </Card>

        {/* Metadata */}
        <Card style={styles.metadataCard}>
          <View style={styles.metadataItem}>
            <Ionicons name="folder-outline" size={16} color={colors.subtext} />
            <Text style={styles.metadataLabel}>Bin:</Text>
            <Text style={styles.metadataValue}>{getBinName(thoughtmark.binId)}</Text>
          </View>
          
          <View style={styles.metadataItem}>
            <Ionicons name="time-outline" size={16} color={colors.subtext} />
            <Text style={styles.metadataLabel}>Created:</Text>
            <Text style={styles.metadataValue}>{formatDate(thoughtmark.createdAt)}</Text>
          </View>
          
          {thoughtmark.updatedAt !== thoughtmark.createdAt && (
            <View style={styles.metadataItem}>
              <Ionicons name="refresh-outline" size={16} color={colors.subtext} />
              <Text style={styles.metadataLabel}>Updated:</Text>
              <Text style={styles.metadataValue}>{formatDate(thoughtmark.updatedAt)}</Text>
            </View>
          )}
          
          {thoughtmark.dueDate && (
            <View style={styles.metadataItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.subtext} />
              <Text style={styles.metadataLabel}>Due:</Text>
              <Text style={styles.metadataValue}>{formatDate(thoughtmark.dueDate)}</Text>
            </View>
          )}
        </Card>

        {/* Tags */}
        {thoughtmark.tags && thoughtmark.tags.length > 0 && (
          <Card style={styles.tagsCard}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {thoughtmark.tags.map((tag: string, index: number) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit"
            onPress={handleEdit}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Share"
            onPress={() => {
              // TODO: Implement share functionality
              Alert.alert('Share', 'Share functionality coming soon');
            }}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  titleCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  taskCompleted: {
    opacity: 0.7,
  },
  taskStatusText: {
    marginLeft: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  taskCompletedText: {
    color: colors.success,
    textDecorationLine: 'line-through',
  },
  contentCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  contentText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
  },
  metadataCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadataLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  metadataValue: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    flex: 1,
  },
  tagsCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  tagText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
}); 