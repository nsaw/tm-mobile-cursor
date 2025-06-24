import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { Button } from '../../../components/ui/Button';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { TagChip } from '../../../components/ui/TagChip';
import { apiService } from '../../../services/api';

interface RouteParams {
  thoughtmarkId?: number;
  content?: string;
  title?: string;
  isVoiceNote?: boolean;
}

export const UnifiedThoughtmarkScreen: React.FC = () => {
  const { tokens } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { createThoughtmark, updateThoughtmark, thoughtmarks, loading } = useThoughtmarks();
  const { bins } = useBins();

  const params = route.params as RouteParams | undefined;
  const isEditing = !!(params?.thoughtmarkId);
  const isVoiceNote = params?.isVoiceNote || false;

  // Form state
  const [title, setTitle] = useState(params?.title || '');
  const [content, setContent] = useState(params?.content || '');
  const [selectedBinId, setSelectedBinId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>(isVoiceNote ? ['voice'] : []);
  const [isTask, setIsTask] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI features state
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [autoTitle, setAutoTitle] = useState('');
  const [autoTags, setAutoTags] = useState<string[]>([]);
  const [contentSuggestions, setContentSuggestions] = useState<string[]>([]);

  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  // Find existing thoughtmark if editing
  const existingThoughtmark = isEditing && params?.thoughtmarkId
    ? thoughtmarks.find(t => t.id === params.thoughtmarkId)
    : null;

  // Load existing data when editing
  useEffect(() => {
    if (existingThoughtmark) {
      setTitle(existingThoughtmark.title || '');
      setContent(existingThoughtmark.content || '');
      setSelectedBinId(existingThoughtmark.binId || undefined);
      setTags(existingThoughtmark.tags || []);
      setIsTask(existingThoughtmark.isTask || false);
      setIsCompleted(existingThoughtmark.isCompleted || false);
      setDueDate(existingThoughtmark.dueDate ? new Date(existingThoughtmark.dueDate) : null);
      setIsPinned(existingThoughtmark.isPinned || false);
    }
  }, [existingThoughtmark]);

  // Generate AI suggestions when content changes
  useEffect(() => {
    if (content.length > 20 && hasPremiumAccess && !isEditing) {
      const timeoutId = setTimeout(() => {
        generateAISuggestions();
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [content, hasPremiumAccess, isEditing]);

  const generateAISuggestions = async () => {
    if (!hasPremiumAccess || !content.trim()) return;

    setIsGeneratingSuggestions(true);
    try {
      const result = await apiService.generateThoughtmarkSuggestions({
        content: content.trim(),
        title: title.trim(),
        tags: tags,
      });

      if (result.success && result.data && typeof result.data === 'object') {
        const data = result.data as any;
        setAiSuggestions(data);
        setAutoTitle(data.suggestedTitle || '');
        setAutoTags(data.suggestedTags || []);
        setContentSuggestions(data.contentSuggestions || []);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const applyAISuggestion = (type: 'title' | 'tags' | 'content', value: string | string[]) => {
    switch (type) {
      case 'title':
        setTitle(value as string);
        break;
      case 'tags':
        setTags(value as string[]);
        break;
      case 'content':
        setContent(value as string);
        break;
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Content Required', 'Please enter some content for your thoughtmark.');
      return;
    }

    setIsSubmitting(true);

    try {
      const thoughtmarkData = {
        title: title.trim() || 'Untitled Thoughtmark',
        content: content.trim(),
        tags,
        binId: selectedBinId,
        isTask,
        isCompleted,
        dueDate: dueDate?.toISOString() || null,
        isPinned,
      };

      if (isEditing && existingThoughtmark) {
        await updateThoughtmark(existingThoughtmark.id, thoughtmarkData);
        Alert.alert('Success', 'Thoughtmark updated successfully!');
      } else {
        const newThoughtmark = await createThoughtmark(thoughtmarkData);
        Alert.alert('Success', 'Thoughtmark created successfully!');
        
        // Navigate to detail view for new thoughtmarks
        if (newThoughtmark && newThoughtmark.id) {
          (navigation as any).navigate('ThoughtmarkDetail', { 
            thoughtmarkId: newThoughtmark.id 
          });
          return;
        }
      }

      // Go back for edits
      navigation.goBack();

    } catch (error) {
      console.error('Error saving thoughtmark:', error);
      Alert.alert('Error', 'Failed to save thoughtmark. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleTask = () => {
    setIsTask(!isTask);
    if (isTask) {
      setIsCompleted(false);
      setDueDate(null);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const getHeaderTitle = () => {
    if (isVoiceNote) return 'Voice Note';
    return isEditing ? 'Edit Thoughtmark' : 'New Thoughtmark';
  };

  const getHeaderSubtitle = () => {
    if (isVoiceNote) return 'Review and edit your voice note';
    return isEditing ? 'Update your thoughtmark' : 'Capture your thoughts';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <ModernHeader
          title={getHeaderTitle()}
          subtitle={getHeaderSubtitle()}
          onBack={handleCancel}
          rightAction={{
            icon: "checkmark",
            onPress: handleSave
          }}
          showBackButton={true}
        />

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: tokens.spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Voice Note Indicator */}
          {isVoiceNote && (
            <View style={[styles.voiceIndicator, { backgroundColor: tokens.colors.surface }]}>
              <Ionicons name="mic" size={20} color={tokens.colors.accent} />
              <Text style={[styles.voiceIndicatorText, { color: tokens.colors.textSecondary }]}>
                Voice note captured
              </Text>
            </View>
          )}

          {/* AI Assistant Panel */}
          {hasPremiumAccess && !isEditing && (
            <Card style={styles.aiPanel}>
              <CardContent>
                <View style={styles.aiPanelHeader}>
                  <View style={styles.aiPanelTitle}>
                    <Ionicons name="sparkles" size={16} color={tokens.colors.accent} />
                    <Text style={[styles.aiPanelTitleText, { color: tokens.colors.text }]}>
                      AI Assistant
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setShowAIPanel(!showAIPanel)}
                    style={styles.aiToggleButton}
                  >
                    <Ionicons 
                      name={showAIPanel ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={tokens.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>

                {showAIPanel && (
                  <View style={styles.aiPanelContent}>
                    {isGeneratingSuggestions ? (
                      <View style={styles.aiLoading}>
                        <ActivityIndicator size="small" color={tokens.colors.accent} />
                        <Text style={[styles.aiLoadingText, { color: tokens.colors.textSecondary }]}>
                          Analyzing your content...
                        </Text>
                      </View>
                    ) : aiSuggestions ? (
                      <View style={styles.aiSuggestions}>
                        {/* Auto Title Suggestion */}
                        {autoTitle && (
                          <View style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: tokens.colors.textSecondary }]}>
                              Suggested Title:
                            </Text>
                            <View style={styles.suggestionAction}>
                              <Text style={[styles.suggestionText, { color: tokens.colors.text }]}>
                                {autoTitle}
                              </Text>
                              <Button
                                variant="ghost"
                                size="sm"
                                onPress={() => applyAISuggestion('title', autoTitle)}
                              >
                                <Ionicons name="checkmark" size={14} color={tokens.colors.accent} />
                              </Button>
                            </View>
                          </View>
                        )}

                        {/* Auto Tags Suggestion */}
                        {autoTags.length > 0 && (
                          <View style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: tokens.colors.textSecondary }]}>
                              Suggested Tags:
                            </Text>
                            <View style={styles.suggestionTags}>
                              {autoTags.map((tag, index) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => toggleTag(tag)}
                                >
                                  <TagChip
                                    tag={tag}
                                    variant={tags.includes(tag) ? "primary" : "outline"}
                                    size="sm"
                                  />
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Content Suggestions */}
                        {contentSuggestions.length > 0 && (
                          <View style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: tokens.colors.textSecondary }]}>
                              Content Ideas:
                            </Text>
                            {contentSuggestions.map((suggestion, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.contentSuggestion}
                                onPress={() => applyAISuggestion('content', suggestion)}
                              >
                                <Text style={[styles.contentSuggestionText, { color: tokens.colors.text }]}>
                                  {suggestion}
                                </Text>
                                <Ionicons name="add" size={14} color={tokens.colors.accent} />
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    ) : (
                      <Text style={[styles.aiEmptyText, { color: tokens.colors.textSecondary }]}>
                        Start typing to get AI suggestions
                      </Text>
                    )}
                  </View>
                )}
              </CardContent>
            </Card>
          )}

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Title (optional)
            </Text>
            <TextInput
              style={[styles.titleInput, { 
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.text,
                borderColor: tokens.colors.border 
              }]}
              placeholder="Enter a title for your thoughtmark..."
              placeholderTextColor={tokens.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Content *
            </Text>
            <TextInput
              style={[styles.contentInput, { 
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.text,
                borderColor: tokens.colors.border 
              }]}
              placeholder="What's on your mind?"
              placeholderTextColor={tokens.colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={[styles.charCount, { color: tokens.colors.textSecondary }]}>
              {content.length}/5000
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Tags
            </Text>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TagChip
                  key={index}
                  tag={tag}
                  variant="primary"
                  onPress={() => toggleTag(tag)}
                />
              ))}
              {tags.length < 5 && (
                <TouchableOpacity
                  style={[styles.addTagButton, { borderColor: tokens.colors.border }]}
                  onPress={() => {
                    Alert.prompt(
                      'Add Tag',
                      'Enter a new tag:',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Add', 
                          onPress: (newTag) => {
                            if (newTag && newTag.trim() && !tags.includes(newTag.trim())) {
                              setTags([...tags, newTag.trim()]);
                            }
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="add" size={16} color={tokens.colors.textSecondary} />
                  <Text style={[styles.addTagText, { color: tokens.colors.textSecondary }]}>
                    Add Tag
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, isTask && styles.actionButtonActive]}
              onPress={toggleTask}
            >
              <Ionicons 
                name={isTask ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={20} 
                color={isTask ? tokens.colors.accent : tokens.colors.textSecondary} 
              />
              <Text style={[styles.actionText, { 
                color: isTask ? tokens.colors.accent : tokens.colors.textSecondary 
              }]}>
                Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, isPinned && styles.actionButtonActive]}
              onPress={togglePin}
            >
              <Ionicons 
                name={isPinned ? "pin" : "pin-outline"} 
                size={20} 
                color={isPinned ? tokens.colors.accent : tokens.colors.textSecondary} 
              />
              <Text style={[styles.actionText, { 
                color: isPinned ? tokens.colors.accent : tokens.colors.textSecondary 
              }]}>
                Pin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bin Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Collection (optional)
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.binsContainer}
            >
              <TouchableOpacity
                style={[
                  styles.binOption,
                  !selectedBinId && styles.binOptionActive,
                  { borderColor: tokens.colors.border }
                ]}
                onPress={() => setSelectedBinId(undefined)}
              >
                <Text style={[styles.binOptionText, { 
                  color: !selectedBinId ? tokens.colors.accent : tokens.colors.textSecondary 
                }]}>
                  No Collection
                </Text>
              </TouchableOpacity>
              {bins.map((bin) => (
                <TouchableOpacity
                  key={bin.id}
                  style={[
                    styles.binOption,
                    selectedBinId === bin.id && styles.binOptionActive,
                    { borderColor: tokens.colors.border }
                  ]}
                  onPress={() => setSelectedBinId(bin.id)}
                >
                  <Text style={[styles.binOptionText, { 
                    color: selectedBinId === bin.id ? tokens.colors.accent : tokens.colors.textSecondary 
                  }]}>
                    {bin.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  voiceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  voiceIndicatorText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  aiPanel: {
    marginBottom: 16,
  },
  aiPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiPanelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiPanelTitleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  aiToggleButton: {
    padding: 4,
  },
  aiPanelContent: {
    marginTop: 12,
  },
  aiLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aiLoadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  aiSuggestions: {
    gap: 12,
  },
  suggestionItem: {
    gap: 8,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  suggestionAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contentSuggestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    marginTop: 4,
  },
  contentSuggestionText: {
    flex: 1,
    fontSize: 14,
  },
  aiEmptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  addTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  binsContainer: {
    flexDirection: 'row',
  },
  binOption: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  binOptionActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  binOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 