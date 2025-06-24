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

  const params = route.params as RouteParams;
  const isEditing = !!params.thoughtmarkId;
  const isVoiceNote = params.isVoiceNote || false;

  // Form state
  const [title, setTitle] = useState(params.title || '');
  const [content, setContent] = useState(params.content || '');
  const [selectedBinId, setSelectedBinId] = useState<number | undefined>();
  const [tags, setTags] = useState<string[]>(isVoiceNote ? ['voice'] : []);
  const [isTask, setIsTask] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find existing thoughtmark if editing
  const existingThoughtmark = isEditing 
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
        (navigation as any).navigate('ThoughtmarkDetail', { 
          thoughtmarkId: newThoughtmark.id 
        });
        return;
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

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Title (optional)
            </Text>
            <TextInput
              style={[styles.titleInput, { 
                backgroundColor: tokens.colors.surface,
                borderColor: tokens.colors.border,
                color: tokens.colors.text,
              }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title..."
              placeholderTextColor={tokens.colors.textMuted}
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
                borderColor: tokens.colors.border,
                color: tokens.colors.text,
              }]}
              value={content}
              onChangeText={setContent}
              placeholder="What's on your mind?"
              placeholderTextColor={tokens.colors.textMuted}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={[styles.charCount, { color: tokens.colors.textMuted }]}>
              {content.length}/5000
            </Text>
          </View>

          {/* Bin Selection */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Bin (optional)
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.binContainer}
            >
              <TouchableOpacity
                style={[
                  styles.binOption,
                  { 
                    backgroundColor: selectedBinId === undefined 
                      ? tokens.colors.accent 
                      : tokens.colors.surface,
                    borderColor: tokens.colors.border,
                  }
                ]}
                onPress={() => setSelectedBinId(undefined)}
              >
                <Text style={[
                  styles.binOptionText,
                  { color: selectedBinId === undefined ? '#FFFFFF' : tokens.colors.text }
                ]}>
                  No Bin
                </Text>
              </TouchableOpacity>
              
              {bins.map((bin: any) => (
                <TouchableOpacity
                  key={bin.id}
                  style={[
                    styles.binOption,
                    { 
                      backgroundColor: selectedBinId === bin.id 
                        ? bin.color 
                        : tokens.colors.surface,
                      borderColor: tokens.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedBinId(bin.id)}
                >
                  <Text style={[
                    styles.binOptionText,
                    { color: selectedBinId === bin.id ? '#FFFFFF' : tokens.colors.text }
                  ]}>
                    {bin.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { 
                  backgroundColor: isTask ? tokens.colors.accent : tokens.colors.surface,
                  borderColor: tokens.colors.border,
                }
              ]}
              onPress={toggleTask}
            >
              <Ionicons 
                name={isTask ? "checkmark-circle" : "ellipse-outline"} 
                size={20} 
                color={isTask ? '#FFFFFF' : tokens.colors.text} 
              />
              <Text style={[
                styles.actionButtonText,
                { color: isTask ? '#FFFFFF' : tokens.colors.text }
              ]}>
                Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { 
                  backgroundColor: isPinned ? tokens.colors.accent : tokens.colors.surface,
                  borderColor: tokens.colors.border,
                }
              ]}
              onPress={togglePin}
            >
              <Ionicons 
                name="pin" 
                size={20} 
                color={isPinned ? '#FFFFFF' : tokens.colors.text} 
              />
              <Text style={[
                styles.actionButtonText,
                { color: isPinned ? '#FFFFFF' : tokens.colors.text }
              ]}>
                Pin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: tokens.colors.textSecondary }]}>
              Tags
            </Text>
            <View style={styles.tagsContainer}>
              {['voice', 'idea', 'task', 'important', 'personal', 'work'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    { 
                      backgroundColor: tags.includes(tag) 
                        ? tokens.colors.accent 
                        : tokens.colors.surface,
                      borderColor: tokens.colors.border,
                    }
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagButtonText,
                    { color: tags.includes(tag) ? '#FFFFFF' : tokens.colors.text }
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveContainer}>
            <Button
              variant="primary"
              size="lg"
              onPress={handleSave}
              disabled={isSubmitting || !content.trim()}
              style={styles.saveButton}
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Update Thoughtmark' : 'Save Thoughtmark')}
            </Button>
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
    borderRadius: 12,
    marginBottom: 16,
  },
  voiceIndicatorText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    minHeight: 56,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  binContainer: {
    paddingRight: 16,
  },
  binOption: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  binOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  saveContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  saveButton: {
    width: '100%',
  },
}); 