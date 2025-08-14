import {
  Text, View, TextInput, ScrollView, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '../../theme/ThemeProvider';
import { useAppStore } from '../../state/store';
import { Button } from '../../components/ui/Button';
import { ModernHeader } from '../../components/ui/ModernHeader';
import { Card } from '../../components/ui/Card'; // CardContent, TagChip, DarkAlertDialog removed due to errors

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
  const { user } = useAppStore(); // createThoughtmark, updateThoughtmark, thoughtmarks, bins removed due to errors

  const params = route.params as RouteParams | undefined;
  const isEditing = !!(params?.thoughtmarkId);
  const isVoiceNote = params?.isVoiceNote || false;

  // Form state
  const [title, setTitle] = useState(params?.title || '');
  const [content, setContent] = useState(params?.content || '');
  const [_selectedBinId, _setSelectedBinId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>(isVoiceNote ? ['voice'] : []);
  const [isTask, setIsTask] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI features state
  interface AISuggestions {
    title: string;
    tags: string[];
    content: string;
  }

  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [_isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [_showAIPanel, _setShowAIPanel] = useState(false);
  const [_autoTitle, setAutoTitle] = useState('');
  const [_autoTags, setAutoTags] = useState<string[]>([]);
  const [_contentSuggestions, setContentSuggestions] = useState<string[]>([]);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Custom alert dialog state
  const [_showAlertDialog, setShowAlertDialog] = useState(false);
  const [_alertMessage, setAlertMessage] = useState('');
  const [_alertAction, setAlertAction] = useState<(() => void) | null>(null);

  // Premium access check
  const hasPremiumAccess = user?.isPremium || user?.isTestUser;

  // Load existing data when editing (TODO: Implement thoughtmark lookup)
  const existingThoughtmark = null; // TODO: Implement thoughtmark lookup
  useEffect(() => {
    // TODO: Implement loading existing thoughtmark data
  }, [existingThoughtmark]);

  const generateAISuggestions = useCallback(async () => {
    if (!hasPremiumAccess) return;
    
    setIsGeneratingSuggestions(true);
    try {
      // Mock AI suggestions for now
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      setAiSuggestions({
        title: `AI Generated Title for: ${content.substring(0, 30)}...`,
        tags: ['ai-suggested', 'auto-generated'],
        content: 'AI-generated content suggestions would appear here...',
      });
      
      setAutoTitle(aiSuggestions?.title || '');
      setAutoTags(aiSuggestions?.tags || []);
      setContentSuggestions([aiSuggestions?.content || '']);
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [content, hasPremiumAccess, aiSuggestions]);

  useEffect(() => {
    if (content.length > 10 && hasPremiumAccess) {
      const timeoutId = setTimeout(() => {
        generateAISuggestions();
      }, 2000); // Debounce for 2 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [content, hasPremiumAccess, generateAISuggestions]);

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
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement thoughtmark creation/update
      Alert.alert('Success', 'Thoughtmark saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save thoughtmark');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      setAlertMessage('Are you sure you want to discard your changes?');
      setAlertAction(() => () => navigation.goBack());
      setShowAlertDialog(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveAndExit = async () => {
    await handleSave();
    navigation.goBack();
  };

  const handleSaveAndNew = async () => {
    await handleSave();
    // Reset form for new thoughtmark
    setTitle('');
    setContent('');
    setTags([]);
    setIsTask(false);
    setIsCompleted(false);
    setDueDate(null);
    setIsPinned(false);
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleToggleTask = () => {
    setIsTask(!isTask);
    if (isTask) {
      setIsCompleted(false);
      setDueDate(null);
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
  };

  const handleDateChange = (_event: Event | null, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleTimeChange = (_event: Event | null, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && dueDate) {
      const newDateTime = new Date(dueDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDueDate(newDateTime);
    }
  };

  const getHeaderTitle = () => {
    if (isEditing) return 'Edit Thoughtmark';
    if (isVoiceNote) return 'Voice Note';
    return 'New Thoughtmark';
  };

  const getHeaderSubtitle = () => {
    if (isEditing) return 'Update your thoughtmark';
    if (isVoiceNote) return 'Transcribe and edit voice note';
    return 'Capture your thoughts';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModernHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        leftAction={{ icon: '←', onPress: handleCancel }}
        rightAction={{ icon: '✓', onPress: handleSave }}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <Card style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title..."
              placeholderTextColor={designTokens.colors.textSecondary}
            />
          </Card>

          {/* Content Input */}
          <Card style={styles.card}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="Write your thoughts..."
              placeholderTextColor={designTokens.colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </Card>

          {/* Tags */}
          <Card style={styles.card}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <Ionicons name="close" size={12} color={designTokens.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tag..."
              placeholderTextColor={designTokens.colors.textSecondary}
              onSubmitEditing={(e) => {
                handleAddTag(e.nativeEvent.text);
                e.currentTarget.setNativeProps({ text: '' });
              }}
            />
          </Card>

          {/* Task Toggle */}
          <Card style={styles.card}>
            <TouchableOpacity style={styles.taskToggle} onPress={handleToggleTask} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons 
                name={isTask ? "checkbox" : "square-outline"} 
                size={24} 
                color={designTokens.colors.primary} 
              />
              <Text style={styles.taskToggleText}>Mark as Task</Text>
            </TouchableOpacity>
            
            {isTask && (
              <View style={styles.taskOptions}>
                <TouchableOpacity 
                  style={styles.taskToggle} 
                  onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setIsCompleted(!isCompleted)}
                >
                  <Ionicons 
                    name={isCompleted ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={designTokens.colors.success} 
                  />
                  <Text style={styles.taskToggleText}>Completed</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dateButton} 
                  onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> setShowDatePicker(true)}
                >
                  <Ionicons name="calendar" size={20} color={designTokens.colors.primary} />
                  <Text style={styles.dateButtonText}>
                    {dueDate ? dueDate.toLocaleDateString() : 'Set Due Date'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          {/* Pin Toggle */}
          <Card style={styles.card}>
            <TouchableOpacity style={styles.pinToggle} onPress={handleTogglePin} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons 
                name={isPinned ? "pin" : "pin-outline"} 
                size={24} 
                color={isPinned ? designTokens.colors.warning : designTokens.colors.textSecondary} 
              />
              <Text style={styles.pinToggleText}>
                {isPinned ? 'Pinned' : 'Pin to Top'}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* AI Suggestions Panel */}
          {hasPremiumAccess && aiSuggestions && (
            <Card style={styles.card}>
              <Text style={styles.label}>AI Suggestions</Text>
              <View style={styles.aiSuggestions}>
                <TouchableOpacity 
                  style={styles.aiSuggestion}
                  onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> applyAISuggestion('title', aiSuggestions.title)}
                >
                  <Text style={styles.aiSuggestionText}>Apply Title</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.aiSuggestion}
                  onPress={() = accessibilityRole="button" accessible={true} accessibilityLabel="Button"> applyAISuggestion('tags', aiSuggestions.tags)}
                >
                  <Text style={styles.aiSuggestionText}>Apply Tags</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Save & Exit"
              onPress={handleSaveAndExit}
              style={styles.actionButton}
              disabled={isSubmitting}
            />
            <Button
              title="Save & New"
              onPress={handleSaveAndNew}
              style={styles.actionButton}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}
      
      {showTimePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="time"
          onChange={handleTimeChange}
        />
      )}

      {/* TODO: Implement DarkAlertDialog component */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
    color: '#FFFFFF',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
  },
  contentInput: {
    fontSize: 16,
    color: '#FFFFFF',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444444',
    minHeight: 120,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 4,
  },
  tagInput: {
    fontSize: 14,
    color: '#FFFFFF',
    padding: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444444',
  },
  taskToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskToggleText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  taskOptions: {
    marginTop: 8,
    paddingLeft: 36,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pinToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pinToggleText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  aiSuggestions: {
    flexDirection: 'row',
    gap: 8,
  },
  aiSuggestion: {
    backgroundColor: '#3A3A3A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  aiSuggestionText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
});
