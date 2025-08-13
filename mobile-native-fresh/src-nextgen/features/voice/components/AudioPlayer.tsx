import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VoiceRecording } from '../types/voice';

export const AudioPlayer: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);

  const playRecording = (recording: VoiceRecording) => {
    setPlayingId(recording.id);
    // Audio playback logic would go here
    console.log('Playing recording:', recording.url);
  };

  const stopRecording = () => {
    setPlayingId(null);
    // Stop audio logic would go here
  };

  const renderRecording = ({ item }: { item: VoiceRecording }) => {
    const isPlaying = playingId === item.id;
    const duration = Math.floor(item.duration / 60) + ':' + (item.duration % 60).toString().padStart(2, '0');

    return (
      <View style={styles.recordingItem}>
        <View style={styles.recordingInfo}>
          <Text style={styles.recordingName}>Recording {item.id.slice(0, 8)}</Text>
          <Text style={styles.recordingDuration}>{duration}</Text>
          <Text style={styles.recordingDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => isPlaying ? stopRecording() : playRecording(item)}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color='#fff'
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {recordings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name='mic-off' size={48} color='#ccc' />
          <Text style={styles.emptyText}>No recordings yet</Text>
          <Text style={styles.emptySubtext}>Record your first voice note above</Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={(item) => item.id}
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
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  recordingDate: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
