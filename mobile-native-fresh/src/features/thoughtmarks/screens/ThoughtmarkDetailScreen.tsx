import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import type { NavigationProp } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { Text } from '../../../components/ui/Text';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TagChip } from '../../../components/ui/TagChip';
import { useAuth } from '../../auth/hooks/useAuth';
import { apiService } from '../../../services/api';

export const ThoughtmarkDetailScreen: React.FC = () => {
  const { tokens } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ params: { thoughtmarkId: string } }>>();
  const { thoughtmarkId } = route.params;
  const { user } = useAuth();
  const { thoughtmarks, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  const thoughtmark = thoughtmarks.find(t => t.id === parseInt(thoughtmarkId));

  // Add state for AI insights and suggestions
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: tokens.colors.background,
    },
    loadingText: {
      marginTop: tokens.spacing.md,
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: tokens.spacing.md,
    },
    headerTitle: {
      fontSize: tokens.typography.fontSize.heading,
      fontWeight: '700',
      color: tokens.colors.text,
      fontFamily: tokens.typography.fontFamily.heading,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: tokens.spacing.sm,
      marginLeft: tokens.spacing.sm,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: tokens.spacing.lg,
    },
    titleCard: {
      marginBottom: tokens.spacing.md,
    },
    title: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.md,
    },
    taskStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.spacing.sm,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    taskCompleted: {
      backgroundColor: tokens.colors.accent,
      borderColor: tokens.colors.accent,
    },
    taskStatusText: {
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
    },
    taskCompletedText: {
      color: tokens.colors.background,
    },
    contentCard: {
      marginBottom: tokens.spacing.md,
    },
    contentText: {
      fontSize: tokens.typography.fontSize.body,
      lineHeight: 24,
      color: tokens.colors.text,
    },
    aiCard: {
      marginBottom: tokens.spacing.md,
    },
    aiHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.spacing.md,
    },
    aiTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    aiTitle: {
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text,
    },
    insightsContainer: {
      gap: tokens.spacing.md,
    },
    insightItem: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm,
    },
    insightType: {
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.spacing.xs,
    },
    insightTypeText: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: '600',
      color: tokens.colors.background,
    },
    actionableBadge: {
      marginLeft: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xs,
      borderRadius: tokens.spacing.xs,
      backgroundColor: tokens.colors.success,
    },
    actionableText: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: '600',
      color: tokens.colors.background,
    },
    insightTitle: {
      fontSize: tokens.typography.fontSize.body,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.xs,
    },
    insightDescription: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      lineHeight: 20,
    },
    aiEmptyText: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    suggestionsContainer: {
      gap: tokens.spacing.md,
    },
    suggestionItem: {
      padding: tokens.spacing.md,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.spacing.sm,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    suggestionText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
    },
    metadataCard: {
      marginBottom: tokens.spacing.md,
    },
    metadataItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: tokens.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    metadataText: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textSecondary,
    },
    tagsCard: {
      marginBottom: tokens.spacing.md,
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.md,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.sm,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: tokens.spacing.md,
      gap: tokens.spacing.md,
    },
  });

  useEffect(() => {
    console.log('ThoughtmarkDetailScreen - thoughtmarkId:', thoughtmarkId);
    console.log('ThoughtmarkDetailScreen - thoughtmark:', thoughtmark);
  }, [thoughtmarkId, thoughtmark]);

  useEffect(() => {
    if (thoughtmark && user?.isPremium) {
      generateAIInsights();
    }
  }, [thoughtmark, user?.isPremium]);

  const generateAIInsights = async () => {
    if (!thoughtmark || !user?.isPremium) return;

    setGeneratingAI(true);
    try {
      const result = await apiService.generateInsights([thoughtmark.id.toString()]);
      if (result.success && result.data && typeof result.data === 'object' && 'insights' in result.data) {
        const insights = (result.data as any).insights;
        if (Array.isArray(insights)) {
          setAiInsights(insights);
        }
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setGeneratingAI(false);
    }
  };

  const generateAISuggestions = async () => {
    if (!thoughtmark || !user?.isPremium) return;

    setGeneratingSuggestions(true);
    try {
      const result = await apiService.generateThoughtmarkSuggestions({
        content: thoughtmark.content,
        title: thoughtmark.title,
        tags: thoughtmark.tags,
      });

      if (result.success && result.data && typeof result.data === 'object') {
        setAiSuggestions(result.data as any);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleEdit = () => {
    if (!thoughtmark) return;
    navigation.navigate('CreateThoughtmark', { 
      thoughtmarkId: thoughtmark.id 
    });
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
            setLoading(true);
            try {
              await deleteThoughtmark(thoughtmark.id);
              Alert.alert('Success', 'Thoughtmark deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting thoughtmark:', error);
              Alert.alert('Error', 'Failed to delete thoughtmark');
            } finally {
              setLoading(false);
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
      // Note: The thoughtmark will be updated in the global state
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
      // Note: The thoughtmark will be updated in the global state
    } catch (error) {
      console.error('Error completing thoughtmark:', error);
      Alert.alert('Error', 'Failed to update thoughtmark');
    }
  };

  const getBinName = (binId: number | undefined) => {
    if (!binId) return 'No Bin';
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
        <ActivityIndicator size="large" color={tokens.colors.accent ?? '#FFD500'} />
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
            onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> navigation.goBack()}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
          >
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text ?? '#F5F5F7'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePin}
            accessibilityRole="button"
            accessibilityLabel={thoughtmark.isPinned ? "Unpin thoughtmark" : "Pin thoughtmark"}
           accessible={true}>
            <Ionicons 
              name={thoughtmark.isPinned ? "pin" : "pin-outline"} 
              size={20} 
              color={thoughtmark.isPinned ? tokens.colors.accent ?? '#FFD500' : tokens.colors.textSecondary ?? '#6B7280'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit thoughtmark"
           accessible={true}>
            <Ionicons name="create-outline" size={20} color={tokens.colors.textSecondary ?? '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete thoughtmark"
           accessible={true}>
            <Ionicons name="trash-outline" size={20} color={tokens.colors.accent ?? '#FFD500'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <Card style={styles.titleCard}>
          <CardContent>
            <Text style={styles.title}>{thoughtmark.title}</Text>
            {thoughtmark.isTask && (
              <TouchableOpacity
                style={[styles.taskStatus, thoughtmark.isCompleted && styles.taskCompleted]}
                onPress={handleComplete}
                accessibilityRole="button"
                accessibilityLabel={thoughtmark.isCompleted ? "Mark task as incomplete" : "Mark task as complete"}
               accessible={true}>
                <Ionicons 
                  name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={thoughtmark.isCompleted ? tokens.colors.accent ?? '#FFD500' : tokens.colors.textSecondary ?? '#6B7280'} 
                />
                <Text style={StyleSheet.flatten([styles.taskStatusText, thoughtmark.isCompleted && styles.taskCompletedText])}>
                  {thoughtmark.isCompleted ? 'Completed' : 'Mark as Complete'}
                </Text>
              </TouchableOpacity>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <Card style={styles.contentCard}>
          <CardContent>
            <Text style={styles.contentText}>{thoughtmark.content}</Text>
          </CardContent>
        </Card>

        {/* AI Insights */}
        {user?.isPremium && (
          <Card style={styles.aiCard}>
            <CardContent>
              <View style={styles.aiHeader}>
                <View style={styles.aiTitleContainer}>
                  <Ionicons name="sparkles" size={16} color={tokens.colors.accent ?? '#FFD500'} />
                  <Text style={styles.aiTitle}>AI Insights</Text>
                </View>
                <TouchableOpacity
                  onPress={generateAIInsights}
                  disabled={generatingAI}
                  accessibilityRole="button"
                  accessibilityLabel="Generate AI insights"
                 accessible={true}>
                  {generatingAI ? (
                    <ActivityIndicator size="small" color={tokens.colors.accent ?? '#FFD500'} />
                  ) : (
                    <Ionicons name="refresh" size={16} color={tokens.colors.accent ?? '#FFD500'} />
                  )}
                </TouchableOpacity>
              </View>
              
              {aiInsights.length > 0 ? (
                <View style={styles.insightsContainer}>
                  {aiInsights.map((insight, index) => (
                    <View key={index} style={styles.insightItem}>
                      <View style={styles.insightHeader}>
                        <View style={[styles.insightType, { backgroundColor: getInsightTypeColor(insight.type) }]}>
                          <Text style={styles.insightTypeText}>{insight.type}</Text>
                        </View>
                        {insight.actionable && (
                          <View style={styles.actionableBadge}>
                            <Text style={styles.actionableText}>Actionable</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightDescription}>{insight.description}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.aiEmptyText}>
                  {generatingAI ? 'Generating insights...' : 'Tap refresh to generate AI insights'}
                </Text>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {user?.isPremium && (
          <Card style={styles.aiCard}>
            <CardContent>
              <View style={styles.aiHeader}>
                <View style={styles.aiTitleContainer}>
                  <Ionicons name="bulb-outline" size={16} color={tokens.colors.accent ?? '#FFD500'} />
                  <Text style={styles.aiTitle}>AI Suggestions</Text>
                </View>
                <TouchableOpacity
                  onPress={generateAISuggestions}
                  disabled={generatingSuggestions}
                  accessibilityRole="button"
                  accessibilityLabel="Generate AI suggestions"
                 accessible={true}>
                  {generatingSuggestions ? (
                    <ActivityIndicator size="small" color={tokens.colors.accent ?? '#FFD500'} />
                  ) : (
                    <Ionicons name="refresh" size={16} color={tokens.colors.accent ?? '#FFD500'} />
                  )}
                </TouchableOpacity>
              </View>
              
              {aiSuggestions ? (
                <View style={styles.suggestionsContainer}>
                  {aiSuggestions.suggestedTags && aiSuggestions.suggestedTags.length > 0 && (
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>Suggested Tags:</Text>
                      <View style={styles.tagsContainer}>
                        {aiSuggestions.suggestedTags.map((tag: string, index: number) => (
                          <TagChip key={index} tag={tag} variant="outline" size="sm" />
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {aiSuggestions.contentSuggestions && aiSuggestions.contentSuggestions.length > 0 && (
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>Content Ideas:</Text>
                      {aiSuggestions.contentSuggestions.map((suggestion: string, index: number) => (
                        <View key={index} style={styles.suggestionItem}>
                          <Text style={styles.suggestionText}>{suggestion}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.aiEmptyText}>
                  {generatingSuggestions ? 'Generating suggestions...' : 'Tap refresh to get AI suggestions'}
                </Text>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card style={styles.metadataCard}>
          <CardContent>
            <View style={styles.metadataItem}>
              <Ionicons name="folder-outline" size={16} color={tokens.colors.textSecondary ?? '#6B7280'} />
              <Text style={styles.metadataText}>Bin:</Text>
              <Text style={styles.metadataText}>{getBinName(thoughtmark.binId)}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={16} color={tokens.colors.textSecondary ?? '#6B7280'} />
              <Text style={styles.metadataText}>Created:</Text>
              <Text style={styles.metadataText}>{formatDate(thoughtmark.createdAt)}</Text>
            </View>
            
            {thoughtmark.updatedAt !== thoughtmark.createdAt && (
              <View style={styles.metadataItem}>
                <Ionicons name="refresh-outline" size={16} color={tokens.colors.textSecondary ?? '#6B7280'} />
                <Text style={styles.metadataText}>Updated:</Text>
                <Text style={styles.metadataText}>{formatDate(thoughtmark.updatedAt)}</Text>
              </View>
            )}
            
            {thoughtmark.dueDate && (
              <View style={styles.metadataItem}>
                <Ionicons name="calendar-outline" size={16} color={tokens.colors.textSecondary ?? '#6B7280'} />
                <Text style={styles.metadataText}>Due:</Text>
                <Text style={styles.metadataText}>{formatDate(thoughtmark.dueDate)}</Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        {thoughtmark.tags && thoughtmark.tags.length > 0 && (
          <Card style={styles.tagsCard}>
            <CardContent>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {thoughtmark.tags.map((tag: string, index: number) => (
                  <TagChip key={index} tag={tag} variant="primary" size="sm" />
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button><Text>Edit</Text></Button>
          <Button
            onPress={() => {
              // TODO: Implement share functionality
              Alert.alert('Share', 'Share functionality coming soon');
            }}
            variant="outline"
            style={{ padding: 8 }}
          >
            Share
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const getInsightTypeColor = (type: string) => {
  switch (type) {
    case 'pattern': return '#3B82F6';
    case 'recommendation': return '#10B981';
    case 'trend': return '#F59E0B';
    case 'connection': return '#8B5CF6';
    default: return '#6B7280';
  }
}; 