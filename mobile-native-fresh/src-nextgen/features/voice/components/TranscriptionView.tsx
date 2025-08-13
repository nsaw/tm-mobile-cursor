import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { TranscriptionResult } from '../types/voice';

export const TranscriptionView: React.FC = () => {
  const [transcriptions, setTranscriptions] = React.useState<TranscriptionResult[]>([]);

  const renderTranscription = ({ item }: { item: TranscriptionResult }) => {
    return (
      <View style={styles.transcriptionItem}>
        <Text style={styles.transcriptionText}>{item.text}</Text>
        <View style={styles.transcriptionMeta}>
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(item.confidence * 100)}%
          </Text>
          <Text style={styles.languageText}>Language: {item.language}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {transcriptions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No transcriptions yet</Text>
          <Text style={styles.emptySubtext}>Transcribe your recordings to see them here</Text>
        </View>
      ) : (
        <FlatList
          data={transcriptions}
          renderItem={renderTranscription}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  transcriptionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  transcriptionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
  languageText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
