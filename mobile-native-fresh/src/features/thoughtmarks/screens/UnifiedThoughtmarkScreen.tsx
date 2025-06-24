import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Switch } from '../../../components/ui/Switch';
import { TagChip } from '../../../components/ui/TagChip';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { useBins } from '../../bins/hooks/useBins';
import { useAuth } from '../../auth/hooks/useAuth';
import { colors, spacing, typography } from '../../../theme/theme';
import type { Thoughtmark, Bin } from '../../../types';

type Mode = 'create' | 'edit' | 'view';

interface UnifiedThoughtmarkScreenProps {
  mode?: Mode;
}

interface RouteParams {
  thoughtmarkId?: number;
  mode?: Mode;
  voice?: boolean;
  content?: string;
  title?: string;
  tags?: string;
  binId?: string;
}

export const UnifiedThoughtmarkScreen: React.FC<UnifiedThoughtmarkScreenProps> = ({ 
  mode: initialMode = 'view' 
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tokens } = useTheme();
  const { user } = useAuth();
  
  const [mode, setMode] = useState<Mode>(initialMode);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [isTask, setIsTask] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const params = route.params as RouteParams;
  const thoughtmarkId = params?.thoughtmarkId;
  
  const {
    thoughtmarks,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    loading: thoughtmarksLoading,
  } = useThoughtmarks();

  const {
    bins,
    loading: binsLoading,
  } = useBins();

  const currentThoughtmark = thoughtmarkId 
    ? thoughtmarks.find(t => t.id === thoughtmarkId)
    : null;

  // Handle voice content from route params
  useEffect(() => {
    if (mode === 'create' && params?.voice) {
      if (params.content) {
        setContent(decodeURIComponent(params.content));
      }
      if (params.title) {
        setTitle(decodeURIComponent(params.title));
      }
      if (params.tags) {
        setTags(params.tags.split(','));
      }
      if (params.binId) {
        setSelectedBinId(parseInt(params.binId));
      }
    }
  }, [mode, params]);

  // Load thoughtmark data for edit/view modes
  useEffect(() => {
    if (currentThoughtmark && (mode === 'edit' || mode === 'view')) {
      setTitle(currentThoughtmark.title);
      setContent(currentThoughtmark.content);
      setTags(currentThoughtmark.tags || []);
      setSelectedBinId(currentThoughtmark.binId);
      setIsTask(currentThoughtmark.isTask || false);
      setIsCompleted(currentThoughtmark.isCompleted || false);
      setIsPinned(currentThoughtmark.isPinned || false);
      if (currentThoughtmark.dueDate) {
        setDueDate(new Date(currentThoughtmark.dueDate).toISOString().split('T')[0]);
      }
    }
  }, [currentThoughtmark, mode]);

  // Auto-select default bin for new thoughtmarks
  useEffect(() => {
    if (mode === 'create' && bins.length > 0 && !selectedBinId) {
      const sortLaterBin = bins.find(bin => bin.name === 'Sort Later');
      if (sortLaterBin) {
        setSelectedBinId(sortLaterBin.id);
      }
    }
  }, [mode, bins, selectedBinId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please provide both title and content.');
      return;
    }

    setIsSaving(true);
    try {
      const thoughtmarkData = {
        title: title.trim(),
        content: content.trim(),
        tags,
        binId: selectedBinId,
        isTask,
        isCompleted,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        isPinned,
      };

      if (mode === 'create') {
        await createThoughtmark(thoughtmarkData);
        Alert.alert('Success', 'Thoughtmark created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else if (mode === 'edit' && currentThoughtmark) {
        await updateThoughtmark(currentThoughtmark.id, thoughtmarkData);
        setLastSaved(new Date());
        Alert.alert('Success', 'Thoughtmark updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save thoughtmark. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!currentThoughtmark) return;

    Alert.alert(
      'Delete Thoughtmark',
      'Are you sure you want to delete this thoughtmark? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThoughtmark(currentThoughtmark.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete thoughtmark.');
            }
          }
        }
      ]
    );
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const generateAISuggestions = async () => {
    if (!user?.isPremium && !user?.isTestUser) {
      Alert.alert(
        'Premium Feature',
        'AI suggestions are available for premium users. Upgrade to unlock this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Subscribe' as never) }
        ]
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Content', 'Please provide title and content to generate AI suggestions.');
      return;
    }

    setIsGeneratingAI(true);
    try {
      // TODO: Implement AI suggestions API call
      // For now, show a placeholder
      setTimeout(() => {
        setAiSuggestions({
          suggestedTags: ['ai-suggested', 'smart-tag'],
          suggestedTitle: 'AI Enhanced Title',
          insights: 'This thoughtmark appears to be about productivity and organization.',
        });
        setIsGeneratingAI(false);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI suggestions.');
      setIsGeneratingAI(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>
        {mode === 'create' ? 'New Thoughtmark' : 
         mode === 'edit' ? 'Edit Thoughtmark' : 'View Thoughtmark'}
      </Text>
      
      <View style={styles.headerActions}>
        {mode === 'view' && currentThoughtmark && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsPinned(!isPinned)}
            >
              <Ionicons 
                name={isPinned ? "pin" : "pin-outline"} 
                size={20} 
                color={isPinned ? tokens.colors.accent : tokens.colors.textSecondary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setMode('edit')}
            >
              <Ionicons name="create-outline" size={20} color={tokens.colors.textSecondary} />
            </TouchableOpacity>
          </>
        )}
        
        {mode === 'edit' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setMode('view')}
          >
            <Ionicons name="close" size={20} color={tokens.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderAIFeatures = () => {
    if (!user?.isPremium && !user?.isTestUser) {
      return (
        <Card variant="elevated" style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <Ionicons name="sparkles" size={20} color={tokens.colors.accent} />
            <Text style={styles.aiCardTitle}>AI Features</Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('Subscribe' as never)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.aiCardDescription}>
            Unlock AI-powered insights, smart suggestions, and intelligent organization with Premium.
          </Text>
        </Card>
      );
    }

    return (
      <Card variant="elevated" style={styles.aiCard}>
        <View style={styles.aiCardHeader}>
          <Ionicons name="sparkles" size={20} color={tokens.colors.accent} />
          <Text style={styles.aiCardTitle}>AI Suggestions</Text>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={generateAISuggestions}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? (
              <ActivityIndicator size="small" color={tokens.colors.accent} />
            ) : (
              <Ionicons name="wand" size={16} color={tokens.colors.accent} />
            )}
          </TouchableOpacity>
        </View>
        
        {aiSuggestions && (
          <View style={styles.aiSuggestions}>
            <Text style={styles.aiSuggestionTitle}>Suggested Tags:</Text>
            <View style={styles.suggestedTags}>
              {aiSuggestions.suggestedTags.map((tag: string) => (
                <TagChip
                  key={tag}
                  tag={tag}
                  onPress={() => addTag()}
                  variant="suggestion"
                />
              ))}
            </View>
            <Text style={styles.aiInsight}>{aiSuggestions.insights}</Text>
          </View>
        )}
      </Card>
    );
  };

  if (thoughtmarksLoading || binsLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.accent} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tokens.colors.background }]}>
      {renderHeader()}
      
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Title</Text>
              {mode === 'view' ? (
                <Text style={styles.viewTitle}>{title}</Text>
              ) : (
                <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter title..."
                  placeholderTextColor={tokens.colors.textMuted}
                />
              )}
            </View>

            {/* Content Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Content</Text>
              {mode === 'view' ? (
                <Text style={styles.viewContent}>{content}</Text>
              ) : (
                <TextInput
                  style={styles.contentInput}
                  value={content}
                  onChangeText={setContent}
                  placeholder="What's on your mind?"
                  placeholderTextColor={tokens.colors.textMuted}
                  multiline
                  textAlignVertical="top"
                />
              )}
            </View>

            {/* Tags Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {tags.map(tag => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    onPress={() => mode !== 'view' && removeTag(tag)}
                    variant={mode === 'view' ? 'default' : 'removable'}
                  />
                ))}
              </View>
              
              {mode !== 'view' && (
                <View style={styles.addTagContainer}>
                  <TextInput
                    style={styles.tagInput}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Add tag..."
                    placeholderTextColor={tokens.colors.textMuted}
                    onSubmitEditing={addTag}
                  />
                  <TouchableOpacity
                    style={styles.addTagButton}
                    onPress={addTag}
                  >
                    <Ionicons name="add" size={20} color={tokens.colors.accent} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Bin Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Bin</Text>
              {mode === 'view' ? (
                <Text style={styles.viewBin}>
                  {bins.find(b => b.id === selectedBinId)?.name || 'No bin selected'}
                </Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.binsContainer}>
                    {bins.map(bin => (
                      <TouchableOpacity
                        key={bin.id}
                        style={[
                          styles.binOption,
                          selectedBinId === bin.id && styles.selectedBin
                        ]}
                        onPress={() => setSelectedBinId(bin.id)}
                      >
                        <Text style={[
                          styles.binText,
                          selectedBinId === bin.id && styles.selectedBinText
                        ]}>
                          {bin.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Task Settings */}
            {mode !== 'view' && (
              <View style={styles.section}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Mark as task</Text>
                  <Switch
                    value={isTask}
                    onValueChange={setIsTask}
                  />
                </View>
                
                {isTask && (
                  <View style={styles.taskSettings}>
                    <View style={styles.switchRow}>
                      <Text style={styles.switchLabel}>Completed</Text>
                      <Switch
                        value={isCompleted}
                        onValueChange={setIsCompleted}
                      />
                    </View>
                    
                    <TextInput
                      style={styles.dateInput}
                      value={dueDate}
                      onChangeText={setDueDate}
                      placeholder="Due date (YYYY-MM-DD)"
                      placeholderTextColor={tokens.colors.textMuted}
                    />
                  </View>
                )}
              </View>
            )}

            {/* AI Features */}
            {renderAIFeatures()}

            {/* Action Buttons */}
            {mode !== 'view' && (
              <View style={styles.actions}>
                <Button
                  variant="primary"
                  onPress={handleSave}
                  disabled={isSaving}
                  style={styles.saveButton}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={tokens.colors.text} />
                  ) : (
                    <Ionicons name="save-outline" size={20} color={tokens.colors.text} />
                  )}
                  <Text style={styles.saveButtonText}>
                    {mode === 'create' ? 'Create' : 'Save Changes'}
                  </Text>
                </Button>
                
                {mode === 'edit' && currentThoughtmark && (
                  <Button
                    variant="destructive"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={20} color={tokens.colors.danger} />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Button>
                )}
              </View>
            )}

            {/* Last Saved Indicator */}
            {lastSaved && (
              <Text style={styles.lastSaved}>
                Last saved: {lastSaved.toLocaleTimeString()}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#A0A0A0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2E2E2E',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E0E0E0',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  viewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E0E0E0',
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
  },
  contentInput: {
    fontSize: 16,
    color: '#E0E0E0',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    minHeight: 120,
  },
  viewContent: {
    fontSize: 16,
    color: '#E0E0E0',
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    color: '#E0E0E0',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    marginRight: 8,
  },
  addTagButton: {
    padding: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  binsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  binOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  selectedBin: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  binText: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  selectedBinText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewBin: {
    fontSize: 16,
    color: '#E0E0E0',
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  taskSettings: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
  },
  dateInput: {
    fontSize: 16,
    color: '#E0E0E0',
    backgroundColor: '#2E2E2E',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  aiCard: {
    marginBottom: 24,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    marginLeft: 8,
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: '#5C6A24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiButton: {
    padding: 8,
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
  },
  aiCardDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
  },
  aiSuggestions: {
    marginTop: 12,
  },
  aiSuggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0E0',
    marginBottom: 8,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  aiInsight: {
    fontSize: 14,
    color: '#A0A0A0',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A2C3B',
  },
  lastSaved: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'center',
    marginTop: 16,
  },
}); 