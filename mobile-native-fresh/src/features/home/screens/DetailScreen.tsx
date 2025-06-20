import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { useThoughtmarks } from '../hooks/useThoughtmarks';
import type { Thoughtmark } from '../../../types';

interface DetailScreenProps {
  route: {
    params: {
      thoughtmarkId: number;
    };
  };
  navigation: any;
}

export const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { thoughtmarkId } = route.params;
  const [thoughtmark, setThoughtmark] = useState<Thoughtmark | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    getThoughtmark,
    updateThoughtmark,
    deleteThoughtmark,
    togglePin,
    toggleArchive,
  } = useThoughtmarks();

  useEffect(() => {
    loadThoughtmark();
  }, [thoughtmarkId]);

  const loadThoughtmark = async () => {
    try {
      setLoading(true);
      const data = await getThoughtmark(thoughtmarkId);
      setThoughtmark(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load thoughtmark');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (thoughtmark) {
      navigation.navigate('EditThoughtmark', { thoughtmark });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Thoughtmark',
      'Are you sure you want to delete this thoughtmark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteThoughtmark(thoughtmarkId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete thoughtmark');
            }
          },
        },
      ]
    );
  };

  const handlePin = async () => {
    if (!thoughtmark) return;
    
    try {
      const updated = await togglePin(thoughtmarkId);
      setThoughtmark(updated);
    } catch (error) {
      Alert.alert('Error', 'Failed to update pin status');
    }
  };

  const handleArchive = async () => {
    if (!thoughtmark) return;
    
    try {
      const updated = await toggleArchive(thoughtmarkId);
      setThoughtmark(updated);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to archive thoughtmark');
    }
  };

  const handleShare = async () => {
    if (!thoughtmark) return;

    try {
      await Share.share({
        title: thoughtmark.title,
        message: `${thoughtmark.title}\n\n${thoughtmark.content}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share thoughtmark');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!thoughtmark) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Thoughtmark not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handlePin}>
            <Text style={styles.headerButtonText}>
              {thoughtmark.isPinned ? '📌' : '📌'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleEdit}>
            <Text style={styles.headerButtonText}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{thoughtmark.title}</Text>
        
        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            Created: {formatDate(thoughtmark.createdAt)}
          </Text>
          {thoughtmark.updatedAt !== thoughtmark.createdAt && (
            <Text style={styles.metadataText}>
              Updated: {formatDate(thoughtmark.updatedAt)}
            </Text>
          )}
        </View>

        {thoughtmark.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {thoughtmark.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.content}>{thoughtmark.content}</Text>

        {thoughtmark.aiSummary && (
          <View style={styles.aiSection}>
            <Text style={styles.aiSectionTitle}>AI Summary</Text>
            <Text style={styles.aiSummary}>{thoughtmark.aiSummary}</Text>
          </View>
        )}

        {thoughtmark.aiCategorySuggestions.length > 0 && (
          <View style={styles.aiSection}>
            <Text style={styles.aiSectionTitle}>Suggested Categories</Text>
            <View style={styles.suggestionsContainer}>
              {thoughtmark.aiCategorySuggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestion}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {thoughtmark.voiceTranscription && (
          <View style={styles.voiceSection}>
            <Text style={styles.voiceSectionTitle}>Voice Transcription</Text>
            <Text style={styles.voiceTranscription}>{thoughtmark.voiceTranscription}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.archiveButton]}
          onPress={handleArchive}
        >
          <Text style={styles.actionButtonText}>
            {thoughtmark.isArchived ? 'Unarchive' : 'Archive'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  metadata: {
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666666',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
    marginBottom: 24,
  },
  aiSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  aiSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  aiSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestion: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#1976d2',
  },
  voiceSection: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  voiceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  voiceTranscription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    fontStyle: 'italic',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  archiveButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  deleteButtonText: {
    color: '#d32f2f',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});