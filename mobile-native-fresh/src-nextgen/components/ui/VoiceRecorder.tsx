import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceRecorder } from '../../features/voice/hooks/useVoiceRecorder';

interface VoiceRecorderProps {
  onRecordingComplete?: (recording: any) => void;
  onTranscriptionComplete?: (transcription: any) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onTranscriptionComplete,
}) => {
  const {
    isRecording,
    recording,
    transcription,
    error,
    duration,
    startRecording,
    stopRecording,
    transcribeRecording,
    deleteRecording,
    formatDuration,
  } = useVoiceRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      if (recording && onRecordingComplete) {
        onRecordingComplete(recording);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handleTranscribe = async () => {
    if (!recording) {
      Alert.alert('Error', 'No recording available');
      return;
    }

    try {
      const result = await transcribeRecording(recording.id);
      if (result.success && onTranscriptionComplete) {
        onTranscriptionComplete(result.data);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to transcribe recording');
    }
  };

  const handleDelete = async () => {
    if (!recording) return;

    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecording(recording.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete recording');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='mic' size={32} color='#fff' />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopRecording}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='stop' size={32} color='#fff' />
          </TouchableOpacity>
        )}
      </View>

      {isRecording && (
        <View style={styles.recordingInfo}>
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording</Text>
          </View>
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      )}

      {recording && !isRecording && (
        <View style={styles.recordingActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTranscribe}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='text' size={20} color='#007AFF' />
            <Text style={styles.actionButtonText}>Transcribe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons name='trash' size={20} color='#ff3b30' />
            <Text style={[styles.actionButtonText, { color: '#ff3b30' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {transcription && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionTitle}>Transcription</Text>
          <Text style={styles.transcriptionText}>{transcription.text}</Text>
          <Text style={styles.confidenceText}>
            Confidence: {Math.round(transcription.confidence * 100)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  controls: {
    marginBottom: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  stopButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recordingInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  errorText: {
    fontSize: 14,
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 8,
  },
  transcriptionContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  transcriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  transcriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
  },
});
