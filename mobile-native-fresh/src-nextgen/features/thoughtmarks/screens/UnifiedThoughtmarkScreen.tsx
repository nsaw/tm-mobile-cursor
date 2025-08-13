import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import { AISuggestions } from '../components/AISuggestions';
import { TaskManager } from '../components/TaskManager';
import { Thoughtmark, CreateThoughtmarkRequest } from '../types/thoughtmark';

export const UnifiedThoughtmarkScreen: React.FC = () => {
  const {
    thoughtmarks,
    loading,
    error,
    createThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    generateAIInsights,
  } = useThoughtmarks();

  const [content, setContent] = useState('');
  const [type, setType] = useState<Thoughtmark['type']>('thought');
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<Thoughtmark['priority']>('medium');
  const [dueDate, setDueDate] = useState<string>('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleSave = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    const request: CreateThoughtmarkRequest = {
      content: content.trim(),
      type,
      tags: tags.filter(tag => tag.trim()),
      priority,
      dueDate: dueDate || undefined,
    };

    const result = await createThoughtmark(request);
    if (result.success) {
      setContent('');
      setTags([]);
      setDueDate('');
      Alert.alert('Success', 'Thoughtmark created successfully');
    } else {
      Alert.alert('Error', 'Failed to create thoughtmark');
    }
  }, [content, type, tags, priority, dueDate, createThoughtmark]);

  const generateAISuggestions = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content first');
      return;
    }
    setShowAISuggestions(true);
  }, [content]);

  const handleAISuggestion = useCallback((suggestion: string) => {
    setContent(prev => prev + ' ' + suggestion);
    setShowAISuggestions(false);
  }, []);

  const handleTagAdd = useCallback((tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags(prev => [...prev, tag.trim()]);
    }
  }, [tags]);

  const handleTagRemove = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Thoughtmark</Text>
        <TouchableOpacity onPress={generateAISuggestions} style={styles.aiButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Ionicons name='sparkles' size={20} color='#007AFF' />
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical='top'
          />
        </View>

        <View style={styles.typeSelector}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typeButtons}>
            {(['thought', 'task', 'note', 'idea'] as const).map((typeOption) => (
              <TouchableOpacity
                key={typeOption}
                style={[
                  styles.typeButton,
                  type === typeOption && styles.typeButtonActive
                ]}
                onPress={() => setType(typeOption)}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === typeOption && styles.typeButtonTextActive
                ]}>
                  {typeOption.charAt(0).toUpperCase() + typeOption.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.prioritySelector}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityButtons}>
            {(['low', 'medium', 'high'] as const).map((priorityOption) => (
              <TouchableOpacity
                key={priorityOption}
                style={[
                  styles.priorityButton,
                  priority === priorityOption && styles.priorityButtonActive,
                  priorityOption === 'high' && styles.priorityHigh,
                  priorityOption === 'low' && styles.priorityLow,
                ]}
                onPress={() => setPriority(priorityOption)}
              >
                <Text style={[
                  styles.priorityButtonText,
                  priority === priorityOption && styles.priorityButtonTextActive,
                ]}>
                  {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.tagsContainer}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsList}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagBadge}
                onPress={() => handleTagRemove(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Ionicons name='close' size={12} color='#666' />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.tagInput}
            placeholder='Add a tag...'
            onSubmitEditing={(e) => {
              handleTagAdd(e.nativeEvent.text);
              e.currentTarget.clear();
            }}
          />
        </View>

        {type === 'task' && (
          <View style={styles.dueDateContainer}>
            <Text style={styles.sectionTitle}>Due Date</Text>
            <TextInput
              style={styles.dateInput}
              placeholder='YYYY-MM-DD (optional)'
              value={dueDate}
              onChangeText={setDueDate}
            />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
          <Text style={styles.saveButtonText}>Save Thoughtmark</Text>
        </TouchableOpacity>
      </ScrollView>

      {showAISuggestions && (
        <AISuggestions
          content={content}
          onSuggestion={handleAISuggestion}
          onClose={() => setShowAISuggestions(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
  },
  aiButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    minHeight: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  prioritySelector: {
    marginBottom: 16,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
  },
  priorityHigh: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  priorityLow: {
    borderColor: '#34c759',
    borderWidth: 1,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  priorityButtonTextActive: {
    color: '#fff',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
  },
  tagInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    fontSize: 14,
  },
  dueDateContainer: {
    marginBottom: 16,
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
