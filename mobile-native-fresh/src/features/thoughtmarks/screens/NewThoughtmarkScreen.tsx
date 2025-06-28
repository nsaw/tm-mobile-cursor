import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
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
import { suggestSmartTitleFromBody } from '../../../utils/suggestTitleFromBody';

interface RouteParams {
  content?: string;
  title?: string;
  isVoiceNote?: boolean;
  body?: string; // Deep link parameter for voice capture
  voiceCapture?: boolean; // Flag to indicate voice capture mode
}

export const NewThoughtmarkScreen: React.FC = () => {
  const { tokens, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { createThoughtmark, thoughtmarks, loading } = useThoughtmarks();
  const { bins, createBin } = useBins();

  const params = route.params as RouteParams | undefined;
  const isVoiceNote = params?.isVoiceNote || false;
  const isVoiceCapture = params?.voiceCapture || false;
  const voiceBody = params?.body || '';

  // Form state
  const [title, setTitle] = useState(params?.title || '');
  const [content, setContent] = useState(params?.content || voiceBody || '');
  const [selectedBinId, setSelectedBinId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [isTask, setIsTask] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortLaterBinId, setSortLaterBinId] = useState<number | undefined>();

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

  // Initialize voice capture setup
  useEffect(() => {
    const initializeVoiceCapture = async () => {
      if (isVoiceCapture || voiceBody) {
        // Set default tags for voice capture
        setTags(['voice-to-tm', 'sort later']);

        // Find or create "Sort Later" bin
        let sortLaterBin = bins.find(bin => bin.name.toLowerCase() === 'sort later');
        
        if (!sortLaterBin) {
          try {
            // Create "Sort Later" bin if it doesn't exist
            const newBin = await createBin({
              name: 'Sort Later',
              description: 'Thoughtmarks that need to be organized later',
              color: '#6B7280', // Gray color
            });
            sortLaterBin = newBin;
          } catch (error) {
            console.error('Failed to create Sort Later bin:', error);
          }
        }

        if (sortLaterBin) {
          setSelectedBinId(sortLaterBin.id);
          setSortLaterBinId(sortLaterBin.id);
        }

        // Suggest title from body content
        if (voiceBody && !title) {
          const suggestedTitle = suggestSmartTitleFromBody(voiceBody);
          setTitle(suggestedTitle);
        }
      } else if (isVoiceNote) {
        // Legacy voice note handling
        setTags(['voice']);
      }
    };

    initializeVoiceCapture();
  }, [isVoiceCapture, voiceBody, isVoiceNote, bins, createBin, title]);

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

      const newThoughtmark = await createThoughtmark(thoughtmarkData);
      
      if (isVoiceCapture) {
        Alert.alert('Success', 'Voice thoughtmark saved!');
      } else {
        Alert.alert('Success', 'Thoughtmark created successfully!');
      }
      
      // Navigate to detail view for new thoughtmarks
      if (newThoughtmark && newThoughtmark.id) {
        (navigation as any).navigate('ThoughtmarkDetail', { 
          thoughtmarkId: newThoughtmark.id 
        });
        return;
      }

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

      await createThoughtmark(thoughtmarkData);
      
      if (isVoiceCapture) {
        Alert.alert('Success', 'Voice thoughtmark saved!');
      } else {
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

      await createThoughtmark(thoughtmarkData);
      
      if (isVoiceCapture) {
        Alert.alert('Success', 'Voice thoughtmark saved!');
      } else {
        Alert.alert('Success', 'Thoughtmark created successfully!');
      }

      // Reset form for new thoughtmark
      setTitle('');
      setContent('');
      setSelectedBinId(sortLaterBinId); // Keep the Sort Later bin selected
      setTags(['voice-to-tm', 'sort later']); // Keep default voice tags
      setIsTask(false);
      setIsCompleted(false);
      setDueDate(null);
      setIsPinned(false);

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
    if (isVoiceCapture) return 'Voice Capture';
    if (isVoiceNote) return 'Voice Note';
    return 'New Thoughtmark';
  };

  const getHeaderSubtitle = () => {
    if (isVoiceCapture) return 'Review and edit your voice thoughtmark';
    if (isVoiceNote) return 'Review and edit your voice note';
    return 'Capture your thoughts';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.pagePaddingHorizontal,
    },
    contentContainer: {
      paddingVertical: spacing.pagePaddingVertical,
    },
    voiceCaptureBanner: {
      backgroundColor: tokens.colors.accent,
      paddingHorizontal: spacing.cardPaddingHorizontal,
      paddingVertical: spacing.cardPaddingVertical,
      borderRadius: tokens.radius.md,
      marginBottom: spacing.formFieldMarginBottom,
      flexDirection: 'row',
      alignItems: 'center',
    },
    voiceCaptureText: {
      color: tokens.colors.background,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: spacing.textMarginBottom,
    },
    inputGroup: {
      marginBottom: spacing.formFieldMarginBottom,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: spacing.textMarginBottom,
    },
    titleInput: {
      borderWidth: 1,
      borderRadius: tokens.radius.md,
      paddingHorizontal: spacing.cardPaddingHorizontal,
      paddingVertical: spacing.cardPaddingVertical,
      fontSize: 18,
      fontWeight: '500',
    },
    contentInput: {
      borderWidth: 1,
      borderRadius: tokens.radius.md,
      paddingHorizontal: spacing.cardPaddingHorizontal,
      paddingVertical: spacing.cardPaddingVertical,
      fontSize: 16,
      minHeight: 120,
    },
    charCount: {
      fontSize: 12,
      textAlign: 'right',
      marginTop: spacing.textMarginBottom,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.textMarginBottom,
      marginTop: spacing.textMarginBottom,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.textMarginBottom,
    },
    tagInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: tokens.radius.md,
      paddingHorizontal: spacing.cardPaddingHorizontal,
      paddingVertical: spacing.cardPaddingVertical,
      fontSize: 16,
      marginRight: spacing.textMarginBottom,
    },
    addTagButton: {
      paddingHorizontal: spacing.buttonPadding,
      paddingVertical: spacing.buttonPadding,
      backgroundColor: tokens.colors.accent,
      borderRadius: tokens.radius.md,
    },
    optionsContainer: {
      marginTop: spacing.formSectionMarginBottom,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.listItemPadding,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '500',
    },
    optionValue: {
      fontSize: 14,
      color: tokens.colors.textSecondary,
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: 14,
      color: tokens.colors.textSecondary,
    },
    clearDateButton: {
      paddingHorizontal: spacing.buttonPadding,
      paddingVertical: spacing.buttonPadding,
      backgroundColor: tokens.colors.danger,
      borderRadius: tokens.radius.md,
    },
    clearDateText: {
      color: tokens.colors.background,
      fontSize: 12,
      fontWeight: '600',
    },
    actionsContainer: {
      marginTop: spacing.formSectionMarginBottom,
      gap: spacing.buttonMarginTop,
    },
    primaryButton: {
      backgroundColor: tokens.colors.accent,
      paddingVertical: spacing.buttonPadding,
      borderRadius: tokens.radius.md,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: tokens.colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: tokens.colors.border,
      paddingVertical: spacing.buttonPadding,
      borderRadius: tokens.radius.md,
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: tokens.colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tokens.colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ModernHeader
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onBack={handleCancel}
        rightAction={
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Save thoughtmark"
            accessible={true}
          >
            <Ionicons 
              name="checkmark" 
              size={24} 
              color={isSubmitting ? tokens.colors.textSecondary : tokens.colors.accent} 
            />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Voice Capture Banner */}
          {isVoiceCapture && (
            <View style={styles.voiceCaptureBanner}>
              <Ionicons name="mic" size={20} color={tokens.colors.background} />
              <Text style={styles.voiceCaptureText}>Voice thoughtmark captured</Text>
            </View>
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
              autoFocus={!isVoiceCapture} // Don't auto-focus if voice capture to avoid keyboard
              accessibilityLabel="Thoughtmark title input"
              accessibilityRole="text"
              keyboardType="default"
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
              accessibilityLabel="Thoughtmark content input"
              accessibilityRole="text"
              keyboardType="default"
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
              {tags.map((tag) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onRemove={() => toggleTag(tag)}
                  accessibilityLabel={`Remove tag ${tag}`}
                />
              ))}
            </View>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={[styles.tagInput, { 
                  backgroundColor: tokens.colors.surface,
                  color: tokens.colors.text,
                  borderColor: tokens.colors.border 
                }]}
                placeholder="Add a tag..."
                placeholderTextColor={tokens.colors.textSecondary}
                onSubmitEditing={(e) => {
                  const newTag = e.nativeEvent.text.trim();
                  if (newTag && !tags.includes(newTag)) {
                    setTags([...tags, newTag]);
                    e.currentTarget.clear();
                  }
                }}
                accessibilityLabel="Add tag input"
                accessibilityRole="text"
                keyboardType="default"
              />
            </View>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            <View style={[styles.optionRow, { borderBottomColor: tokens.colors.border }]}>
              <Text style={[styles.optionLabel, { color: tokens.colors.text }]}>
                Make this a task
              </Text>
              <TouchableOpacity
                onPress={toggleTask}
                accessibilityRole="switch"
                accessibilityLabel={isTask ? "Task enabled" : "Task disabled"}
                accessible={true}
              >
                <Ionicons 
                  name={isTask ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={isTask ? tokens.colors.accent : tokens.colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            {isTask && (
              <>
                <View style={[styles.optionRow, { borderBottomColor: tokens.colors.border }]}>
                  <Text style={[styles.optionLabel, { color: tokens.colors.text }]}>
                    Due Date
                  </Text>
                  <View style={styles.dateContainer}>
                    <Text style={[styles.dateText, { color: tokens.colors.textSecondary }]}>
                      {dueDate ? formatDueDate(dueDate) : 'Not set'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      accessibilityRole="button"
                      accessibilityLabel="Set due date"
                      accessible={true}
                    >
                      <Ionicons name="calendar" size={20} color={tokens.colors.accent} />
                    </TouchableOpacity>
                  </View>
                </View>
                {dueDate && (
                  <TouchableOpacity
                    style={styles.clearDateButton}
                    onPress={clearDueDate}
                    accessibilityRole="button"
                    accessibilityLabel="Clear due date"
                    accessible={true}
                  >
                    <Text style={styles.clearDateText}>Clear Date</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            <View style={[styles.optionRow, { borderBottomColor: tokens.colors.border }]}>
              <Text style={[styles.optionLabel, { color: tokens.colors.text }]}>
                Pin to top
              </Text>
              <TouchableOpacity
                onPress={togglePin}
                accessibilityRole="switch"
                accessibilityLabel={isPinned ? "Pinned" : "Not pinned"}
                accessible={true}
              >
                <Ionicons 
                  name={isPinned ? "pin" : "pin-outline"} 
                  size={24} 
                  color={isPinned ? tokens.colors.accent : tokens.colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSave}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Save thoughtmark"
              accessible={true}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={tokens.colors.background} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isVoiceCapture ? 'Save Voice Thoughtmark' : 'Save Thoughtmark'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSaveAndNew}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Save and create new thoughtmark"
              accessible={true}
            >
              <Text style={styles.secondaryButtonText}>Save & New</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
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

      {/* Alert Dialog */}
      <DarkAlertDialog
        visible={showAlertDialog}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onConfirm={() => {
          setShowAlertDialog(false);
          alertConfig.buttons[1]?.onPress();
        }}
        onCancel={() => {
          setShowAlertDialog(false);
          alertConfig.buttons[0]?.onPress();
        }}
      />
    </SafeAreaView>
  );
}; 