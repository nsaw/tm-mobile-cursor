import { Text ,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '../../../theme/ThemeProvider';
import { useAuth } from '../../auth/hooks/useAuth';
import { useThoughtmarks } from '../../home/hooks/useThoughtmarks';
import { useBins } from '../../home/hooks/useBins';
import { Button } from '../../../components/ui/Button';
import { ModernHeader } from '../../../components/ui/ModernHeader';
import { Card, CardContent } from '../../../components/ui/Card';
import { TagChip } from '../../../components/ui/TagChip';
import { DarkAlertDialog } from '../../../components/ui/DarkAlertDialog';
import { apiService } from '../../../services/api';
import { AutoRoleView } from '../../../components/ui/AutoRoleView';

interface RouteParams {
  thoughtmarkId?: number;
  content?: string;
  title?: string;
  isVoiceNote?: boolean;
}

export const UnifiedThoughtmarkScreen: React.FC = () => {
  const { tokens: designTokens } = useTheme();
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

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Custom alert dialog state
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    buttons: [] as any[],
  });

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
    if (content.length > 20 && hasPremiumAccess) {
      const timeoutId = setTimeout(() => {
        generateAISuggestions();
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [content, hasPremiumAccess]);

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
      setAlertConfig({
        title: 'Save Changes?',
        message: 'You have unsaved changes. What would you like to do?',
        buttons: [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Save & Exit',
            style: 'default',
            onPress: handleSaveAndExit,
          },
          {
            text: 'Save & New',
            style: 'default',
            onPress: handleSaveAndNew,
          },
        ],
      });
      setShowAlertDialog(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveAndExit = async () => {
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
        await createThoughtmark(thoughtmarkData);
        Alert.alert('Success', 'Thoughtmark created successfully!');
      }

      navigation.goBack();

    } catch (error) {
      console.error('Error saving thoughtmark:', error);
      Alert.alert('Error', 'Failed to save thoughtmark. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndNew = async () => {
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
        await createThoughtmark(thoughtmarkData);
        Alert.alert('Success', 'Thoughtmark created successfully!');
      }

      // Reset form for new thoughtmark
      setTitle('');
      setContent('');
      setSelectedBinId(undefined);
      setTags([]);
      setIsTask(false);
      setIsCompleted(false);
      setDueDate(null);
      setIsPinned(false);
      setAiSuggestions(null);
      setAutoTitle('');
      setAutoTags([]);
      setContentSuggestions([]);

    } catch (error) {
      console.error('Error saving thoughtmark:', error);
      Alert.alert('Error', 'Failed to save thoughtmark. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      // Show time picker after date is selected
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && dueDate) {
      // Combine the selected date with the selected time
      const combinedDateTime = new Date(dueDate);
      combinedDateTime.setHours(selectedTime.getHours());
      combinedDateTime.setMinutes(selectedTime.getMinutes());
      setDueDate(combinedDateTime);
    }
  };

  const clearDueDate = () => {
    setDueDate(null);
  };

  const formatDueDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    <ScrollView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
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
          contentContainerStyle={{ padding: designTokens.spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Voice Note Indicator */}
          {isVoiceNote && (
            <ScrollView style={[styles.voiceIndicator, { backgroundColor: designTokens.colors.surface }]}>
              <Ionicons name="mic" size={20} color={designTokens.colors.accent} />
              <Text style={[styles.voiceIndicatorText, { color: designTokens.colors.textSecondary }]}>
                Voice note captured
              </Text>
            </ScrollView>
          )}

          {/* AI Assistant Panel */}
          {hasPremiumAccess && (
            <Card style={styles.aiPanel}>
              <CardContent>
                <ScrollView style={styles.aiPanelHeader}>
                  <ScrollView style={styles.aiPanelTitle}>
                    <Ionicons name="sparkles" size={16} color={designTokens.colors.accent} />
                    <Text style={[styles.aiPanelTitleText, { color: designTokens.colors.text }]}>
                      AI Assistant
                    </Text>
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setShowAIPanel(!showAIPanel)}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Button"
                    style={styles.aiToggleButton}
                  >
                    <Ionicons 
                      name={showAIPanel ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={designTokens.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </ScrollView>

                {showAIPanel && (
                  <ScrollView style={styles.aiPanelContent}>
                    {isGeneratingSuggestions ? (
                      <ScrollView style={styles.aiLoading}>
                        <ActivityIndicator size="small" color={designTokens.colors.accent} />
                        <Text style={[styles.aiLoadingText, { color: designTokens.colors.textSecondary }]}>
                          Analyzing your content...
                        </Text>
                      </ScrollView>
                    ) : aiSuggestions ? (
                      <ScrollView style={styles.aiSuggestions}>
                        {/* Auto Title Suggestion */}
                        {autoTitle && (
                          <ScrollView style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: designTokens.colors.textSecondary }]}>
                              Suggested Title:
                            </Text>
                            <ScrollView style={styles.suggestionAction}>
                              <Text style={[styles.suggestionText, { color: designTokens.colors.text }]}>
                                {autoTitle}
                              </Text>
                              <Button
                                variant="ghost"
                                size="sm"
                                onPress={() => applyAISuggestion('title', autoTitle)}
                              >
                                <Ionicons name="checkmark" size={14} color={designTokens.colors.accent} />
                              </Button>
                            </ScrollView>
                          </ScrollView>
                        )}

                        {/* Auto Tags Suggestion */}
                        {autoTags.length > 0 && (
                          <ScrollView style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: designTokens.colors.textSecondary }]}>
                              Suggested Tags:
                            </Text>
                            <ScrollView style={styles.suggestionTags}>
                              {autoTags.map((tag, index) => (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => toggleTag(tag)}
                                  accessibilityRole="button"
                                  accessible={true}
                                  accessibilityLabel="Button"
                                >
                                  <TagChip
                                    tag={tag}
                                    variant={tags.includes(tag) ? "primary" : "outline"}
                                    size="sm"
                                  />
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </ScrollView>
                        )}

                        {/* Content Suggestions */}
                        {contentSuggestions.length > 0 && (
                          <ScrollView style={styles.suggestionItem}>
                            <Text style={[styles.suggestionLabel, { color: designTokens.colors.textSecondary }]}>
                              Content Ideas:
                            </Text>
                            {contentSuggestions.map((suggestion, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.contentSuggestion}
                                onPress={() => applyAISuggestion('content', suggestion)}
                                accessibilityRole="button"
                                accessible={true}
                                accessibilityLabel="Button"
                              >
                                <Text style={[styles.contentSuggestionText, { color: designTokens.colors.text }]}>
                                  {suggestion}
                                </Text>
                                <Ionicons name="add" size={14} color={designTokens.colors.accent} />
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        )}
                      </ScrollView>
                    ) : (
                      <Text style={[styles.aiEmptyText, { color: designTokens.colors.textSecondary }]}>
                        Start typing to get AI suggestions
                      </Text>
                    )}
                  </ScrollView>
                )}
              </CardContent>
            </Card>
          )}

          {/* Title Input */}
          <ScrollView style={styles.inputGroup}>
            <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
              Title (optional)
            </Text>
            <TextInput
              style={[styles.titleInput, { 
                backgroundColor: designTokens.colors.surface,
                color: designTokens.colors.text,
                borderColor: designTokens.colors.border 
              }]}
              placeholder="Enter a title for your thoughtmark..."
              placeholderTextColor={designTokens.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </ScrollView>

          {/* Content Input */}
          <ScrollView style={styles.inputGroup}>
            <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
              Content *
            </Text>
            <TextInput
              style={[styles.contentInput, { 
                backgroundColor: designTokens.colors.surface,
                color: designTokens.colors.text,
                borderColor: designTokens.colors.border 
              }]}
              placeholder="What's on your mind?"
              placeholderTextColor={designTokens.colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={[styles.charCount, { color: designTokens.colors.textSecondary }]}>
              {content.length}/5000
            </Text>
          </ScrollView>

          {/* Tags */}
          <ScrollView style={styles.inputGroup}>
            <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
              Tags
            </Text>
            <ScrollView style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TagChip
                  key={index}
                  tag={tag}
                  variant="outline"
                  onPress={() => toggleTag(tag)}
                />
              ))}
              {tags.length < 5 && (
                <TouchableOpacity
                  style={[styles.addTagButton, { borderColor: designTokens.colors.border }]}
                  onPress={() => {
                    Alert.prompt(
                      'Add Tag',
                      'Enter a new tag:',
                      [
                        { text: 'Cancel', style: 'cancel'},
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
                  <Ionicons name="add" size={16} color={designTokens.colors.textSecondary} />
                  <Text style={[styles.addTagText, { color: designTokens.colors.textSecondary }]}>
                    Add Tag
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </ScrollView>

          {/* Quick Actions */}
          <ScrollView style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.actionButton, isTask && styles.actionButtonActive]}
              onPress={toggleTask}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Button"
            >
              <Ionicons 
                name={isTask ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={20} 
                color={isTask ? designTokens.colors.accent : designTokens.colors.textSecondary} 
              />
              <Text style={[styles.actionText, { 
                color: isTask ? designTokens.colors.accent : designTokens.colors.textSecondary 
              }]}>
                Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, isPinned && styles.actionButtonActive]}
              onPress={togglePin}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Button"
            >
              <Ionicons 
                name={isPinned ? "pin" : "pin-outline"} 
                size={20} 
                color={isPinned ? designTokens.colors.accent : designTokens.colors.textSecondary} 
              />
              <Text style={[styles.actionText, { 
                color: isPinned ? designTokens.colors.accent : designTokens.colors.textSecondary 
              }]}>
                Pin
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Due Date Section - Only show when task is selected */}
          {isTask && (
            <ScrollView style={styles.inputGroup}>
              <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
                Due Date (optional - no due date by default)
              </Text>
              <ScrollView style={styles.dueDateContainer}>
                {dueDate ? (
                  <ScrollView style={styles.dueDateDisplay}>
                    <Ionicons name="calendar" size={16} color={designTokens.colors.accent} />
                    <Text style={[styles.dueDateText, { color: designTokens.colors.text }]}>
                      {formatDueDate(dueDate)}
                    </Text>
                    <TouchableOpacity onPress={clearDueDate} style={styles.clearDueDateButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
                      <Ionicons name="close-circle" size={16} color={designTokens.colors.textSecondary} />
                    </TouchableOpacity>
                  </ScrollView>
                ) : (
                  <TouchableOpacity
                    style={[styles.setDueDateButton, { borderColor: designTokens.colors.border }]}
                    onPress={() => setShowDatePicker(true)}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Button"
                  >
                    <Ionicons name="calendar-outline" size={16} color={designTokens.colors.textSecondary} />
                    <Text style={[styles.setDueDateText, { color: designTokens.colors.textSecondary }]}>
                      Set Due Date
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </ScrollView>
          )}

          {/* Date and Time Pickers */}
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Bin Selection */}
          <ScrollView style={styles.inputGroup}>
            <Text style={[styles.label, { color: designTokens.colors.textSecondary }]}>
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
                  { borderColor: designTokens.colors.border }
                ]}
                onPress={() => setSelectedBinId(undefined)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
              >
                <Text style={[styles.binOptionText, { 
                  color: !selectedBinId ? designTokens.colors.accent : designTokens.colors.textSecondary 
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
                    { borderColor: designTokens.colors.border }
                  ]}
                  onPress={() => setSelectedBinId(bin.id)}
                  accessibilityRole="button"
                  accessible={true}
                  accessibilityLabel="Button"
                >
                  <Text style={[styles.binOptionText, { 
                    color: selectedBinId === bin.id ? designTokens.colors.accent : designTokens.colors.textSecondary 
                  }]}>
                    {bin.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ScrollView>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Custom Dark Alert Dialog */}
      <DarkAlertDialog
        visible={showAlertDialog}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={() => {
          setShowAlertDialog(false);
          if (alertConfig.buttons && alertConfig.buttons.length > 0) {
            const confirmButton = alertConfig.buttons.find(btn => btn.style !== 'destructive');
            if (confirmButton && confirmButton.onPress) {
              confirmButton.onPress();
            }
          }
        }}
        onCancel={() => {
          setShowAlertDialog(false);
          if (alertConfig.buttons && alertConfig.buttons.length > 0) {
            const cancelButton = alertConfig.buttons.find(btn => btn.style === 'destructive');
            if (cancelButton && cancelButton.onPress) {
              cancelButton.onPress();
            }
          }
        }}
        confirmText="Save"
        cancelText="Discard"
      />
    </ScrollView>
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
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Ubuntu',
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Ubuntu',
    lineHeight: 15,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    fontSize: 12,
    fontFamily: 'Ubuntu',
    lineHeight: 15,
    minHeight: 60,
  },
  charCount: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 2,
    fontFamily: 'Ubuntu',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  addTagText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Ubuntu',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Ubuntu',
  },
  binsContainer: {
    flexDirection: 'row',
  },
  binOption: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  binOptionActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3B82F6',
  },
  binOptionText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Ubuntu',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    padding: 8,
  },
  dueDateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    fontFamily: 'Ubuntu',
  },
  clearDueDateButton: {
    padding: 2,
  },
  setDueDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 6,
    gap: 4,
    flex: 1,
  },
  setDueDateText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Ubuntu',
  },
}); 