import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AISuggestionsProps {
  content: string;
  onSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  content,
  onSuggestion,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, [content]);

  const generateSuggestions = async () => {
    setLoading(true);
    // Simulate AI suggestions based on content
    setTimeout(() => {
      const mockSuggestions = [
        'Consider adding more context to this thought.',
        'This could be related to your recent tasks.',
        'You might want to set a reminder for this.',
        'This idea could benefit from further exploration.',
      ];
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
     accessible={false} accessibilityLabel="Modal">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Suggestions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name='close' size={24} color='#666' />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size='large' color='#007AFF' />
              <Text style={styles.loadingText}>Generating suggestions...</Text>
            </View>
          ) : (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => onSuggestion(suggestion)}
                >
                  <Ionicons name='sparkles' size={16} color='#007AFF' />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
