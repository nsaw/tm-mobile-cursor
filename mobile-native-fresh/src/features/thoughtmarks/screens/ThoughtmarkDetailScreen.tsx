import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TagChip } from '../../../components/ui/TagChip';
import { Text } from '../../../components/ui/Text';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp, RouteProp } from '../../../navigation/types';
import { apiService } from '../../../services/api';

export const ThoughtmarkDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<'ThoughtmarkDetail'>>();
  const { thoughtmarkId } = route.params;
  const { tokens } = useTheme();
  
  const { thoughtmarks, loading, getThoughtmark, updateThoughtmark, deleteThoughtmark } = useThoughtmarks();
  const { bins } = useBins();
  const { user } = useAuth();
  
  const [thoughtmark, setThoughtmark] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  useEffect(() => {
    loadThoughtmark();
  }, [thoughtmarkId]);

  useEffect(() => {
    console.log('ThoughtmarkDetailScreen - thoughtmarkId:', thoughtmarkId);
    console.log('ThoughtmarkDetailScreen - thoughtmark:', thoughtmark);
  }, [thoughtmarkId, thoughtmark]);

  useEffect(() => {
    if (thoughtmark && hasPremiumAccess) {
      generateAIInsights();
    }
  }, [thoughtmark, hasPremiumAccess]);

  const loadThoughtmark = async () => {
    try {
      const data = await getThoughtmark(thoughtmarkId);
      setThoughtmark(data);
    } catch (error) {
      console.error('Error loading thoughtmark:', error);
      Alert.alert('Error', 'Failed to load thoughtmark');
    }
  };

  const generateAIInsights = async () => {
    if (!thoughtmark || !hasPremiumAccess) return;

    setIsGeneratingAI(true);
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
      setIsGeneratingAI(false);
    }
  };

  const generateAISuggestions = async () => {
    if (!thoughtmark || !hasPremiumAccess) return;

    setIsGeneratingAI(true);
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
      setIsGeneratingAI(false);
    }
  };

  const handleEdit = () => {
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
        <ActivityIndicator size="large" color={tokens.colors.accent} />
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
            <Ionicons name="arrow-back" size={24} color={tokens.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>THOUGHTMARK</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePin}
            accessibilityRole="button"
            accessibilityLabel={thoughtmark.isPinned ? "Unpin thoughtmark" : "Pin thoughtmark"}
          >
            <Ionicons 
              name={thoughtmark.isPinned ? "pin" : "pin-outline"} 
              size={20} 
              color={thoughtmark.isPinned ? tokens.primary : tokens.subtext} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEdit}
            accessibilityRole="button"
            accessibilityLabel="Edit thoughtmark"
          >
            <Ionicons name="create-outline" size={20} color={tokens.subtext} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete thoughtmark"
          >
            <Ionicons name="trash-outline" size={20} color={tokens.primary} />
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
              >
                <Ionicons 
                  name={thoughtmark.isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={thoughtmark.isCompleted ? tokens.primary : tokens.subtext} 
                />
                <Text style={[styles.taskStatusText, thoughtmark.isCompleted && styles.taskCompletedText]}>
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
        {hasPremiumAccess && (
          <Card style={styles.aiCard}>
            <CardContent>
              <View style={styles.aiHeader}>
                <View style={styles.aiTitleContainer}>
                  <Ionicons name="sparkles" size={16} color={tokens.primary} />
                  <Text style={styles.aiTitle}>AI Insights</Text>
                </View>
                <TouchableOpacity
                  onPress={generateAIInsights}
                  disabled={isGeneratingAI}
                  accessibilityRole="button"
                  accessibilityLabel="Generate AI insights"
                >
                  {isGeneratingAI ? (
                    <ActivityIndicator size="small" color={tokens.primary} />
                  ) : (
                    <Ionicons name="refresh" size={16} color={tokens.primary} />
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
                  {isGeneratingAI ? 'Generating insights...' : 'Tap refresh to generate AI insights'}
                </Text>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Suggestions */}
        {hasPremiumAccess && (
          <Card style={styles.aiCard}>
            <CardContent>
              <View style={styles.aiHeader}>
                <View style={styles.aiTitleContainer}>
                  <Ionicons name="bulb-outline" size={16} color={tokens.primary} />
                  <Text style={styles.aiTitle}>AI Suggestions</Text>
                </View>
                <TouchableOpacity
                  onPress={generateAISuggestions}
                  disabled={isGeneratingAI}
                  accessibilityRole="button"
                  accessibilityLabel="Generate AI suggestions"
                >
                  {isGeneratingAI ? (
                    <ActivityIndicator size="small" color={tokens.primary} />
                  ) : (
                    <Ionicons name="refresh" size={16} color={tokens.primary} />
                  )}
                </TouchableOpacity>
              </View>
              
              {aiSuggestions ? (
                <View style={styles.suggestionsContainer}>
                  {aiSuggestions.suggestedTags && aiSuggestions.suggestedTags.length > 0 && (
                    <View style={styles.suggestionSection}>
                      <Text style={styles.suggestionLabel}>Suggested Tags:</Text>
                      <View style={styles.suggestedTags}>
                        {aiSuggestions.suggestedTags.map((tag: string, index: number) => (
                          <TagChip key={index} tag={tag} variant="outline" size="sm" />
                        ))}
                      </View>
                    </View>
                  )}
                  
                  {aiSuggestions.contentSuggestions && aiSuggestions.contentSuggestions.length > 0 && (
                    <View style={styles.suggestionSection}>
                      <Text style={styles.suggestionLabel}>Content Ideas:</Text>
                      {aiSuggestions.contentSuggestions.map((suggestion: string, index: number) => (
                        <View key={index} style={styles.contentSuggestion}>
                          <Text style={styles.contentSuggestionText}>{suggestion}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.aiEmptyText}>
                  {isGeneratingAI ? 'Generating suggestions...' : 'Tap refresh to get AI suggestions'}
                </Text>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card style={styles.metadataCard}>
          <CardContent>
            <View style={styles.metadataItem}>
              <Ionicons name="folder-outline" size={16} color={tokens.subtext} />
              <Text style={styles.metadataLabel}>Bin:</Text>
              <Text style={styles.metadataValue}>{getBinName(thoughtmark.binId)}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={16} color={tokens.subtext} />
              <Text style={styles.metadataLabel}>Created:</Text>
              <Text style={styles.metadataValue}>{formatDate(thoughtmark.createdAt)}</Text>
            </View>
            
            {thoughtmark.updatedAt !== thoughtmark.createdAt && (
              <View style={styles.metadataItem}>
                <Ionicons name="refresh-outline" size={16} color={tokens.subtext} />
                <Text style={styles.metadataLabel}>Updated:</Text>
                <Text style={styles.metadataValue}>{formatDate(thoughtmark.updatedAt)}</Text>
              </View>
            )}
            
            {thoughtmark.dueDate && (
              <View style={styles.metadataItem}>
                <Ionicons name="calendar-outline" size={16} color={tokens.subtext} />
                <Text style={styles.metadataLabel}>Due:</Text>
                <Text style={styles.metadataValue}>{formatDate(thoughtmark.dueDate)}</Text>
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
          <Button
            onPress={handleEdit}
            variant="outline"
            style={{ padding: 8 }}
          >
            Edit
          </Button>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    color: tokens.subtext,
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
    color: tokens.text,
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
  },
  title: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: tokens.text,
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
    color: tokens.subtext,
  },
  taskCompletedText: {
    color: tokens.primary,
    textDecorationLine: 'line-through',
  },
  contentCard: {
    marginBottom: spacing.md,
  },
  contentText: {
    fontSize: typography.body.fontSize,
    color: tokens.text,
    lineHeight: 24,
  },
  aiCard: {
    marginBottom: spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: tokens.text,
    marginLeft: spacing.sm,
  },
  aiEmptyText: {
    fontSize: typography.body.fontSize,
    color: tokens.subtext,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  insightsContainer: {
    gap: spacing.md,
  },
  insightItem: {
    padding: spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: spacing.sm,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightType: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  insightTypeText: {
    fontSize: 10,
    color: tokens.background,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionableBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
  },
  actionableText: {
    fontSize: 10,
    color: tokens.background,
    fontWeight: '600',
  },
  insightTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: tokens.text,
    marginBottom: spacing.xs,
  },
  insightDescription: {
    fontSize: typography.body.fontSize,
    color: tokens.subtext,
  },
  suggestionsContainer: {
    gap: spacing.md,
  },
  suggestionSection: {
    gap: spacing.sm,
  },
  suggestionLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: tokens.text,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  contentSuggestion: {
    padding: spacing.sm,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: spacing.sm,
  },
  contentSuggestionText: {
    fontSize: typography.body.fontSize,
    color: tokens.text,
  },
  metadataCard: {
    marginBottom: spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metadataLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: tokens.text,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    minWidth: 80,
  },
  metadataValue: {
    fontSize: typography.body.fontSize,
    color: tokens.subtext,
    flex: 1,
  },
  tagsCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: tokens.text,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
}); 