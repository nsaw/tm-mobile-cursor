import { Text, View, TouchableOpacity, Modal, StyleSheet, Alert, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

import useAppStore from '../../state/stores/appStore';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';

interface VoiceRecorderProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete?: (thoughtmarkId?: string, transcript?: string, aiTitle?: string) => void;
}

type RecordingStage = 'ready' | 'listening' | 'processing' | 'complete';

// Fallback voice recognition for Expo Go
interface VoiceModule {
  onSpeechStart: (e?: unknown) => void;
  onSpeechRecognized: (e?: unknown) => void;
  onSpeechEnd: (e?: unknown) => void;
  onSpeechError: (error: { error?: { code: string } }) => void;
  onSpeechResults: (event: { value?: string[] }) => void;
  onSpeechPartialResults: (event: { value?: string[] }) => void;
  onSpeechVolumeChanged: (event: { value: number }) => void;
  start: (locale?: string) => Promise<void>;
  stop: () => Promise<void>;
  cancel: () => Promise<void>;
  destroy: () => Promise<void>;
  removeAllListeners: () => void;
  isAvailable: () => Promise<boolean>;
}

let Voice: VoiceModule | null = null;

// Try to import Voice module, but don't fail if it's not available
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Voice = require('@react-native-voice/voice').default;
} catch {
  console.log('Voice module not available in Expo Go, using fallback');
  // Create a mock Voice object to prevent errors
  Voice = {
    onSpeechStart: () => console.log('Mock: Speech start'),
    onSpeechRecognized: () => console.log('Mock: Speech recognized'),
    onSpeechEnd: () => console.log('Mock: Speech end'),
    onSpeechError: () => console.log('Mock: Speech error'),
    onSpeechResults: () => console.log('Mock: Speech results'),
    onSpeechPartialResults: () => console.log('Mock: Speech partial results'),
    onSpeechVolumeChanged: () => console.log('Mock: Speech volume changed'),
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
    cancel: () => Promise.resolve(),
    destroy: () => Promise.resolve(),
    removeAllListeners: () => console.log('Mock: Removed listeners'),
    isAvailable: () => Promise.resolve(false)
  };
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isVisible,
  onClose,
  onComplete,
}) => {
  const { tokens } = useTheme();
  const { createThoughtmark, bins } = useAppStore();
  const { user } = useAuth();

  const [recordingStage, setRecordingStage] = useState<RecordingStage>('ready');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [_hasAutoSaved, setHasAutoSaved] = useState(false);
  const [autoSaveId, setAutoSaveId] = useState<string | null>(null);
  const [_audioUri, setAudioUri] = useState<string | null>(null);

  const transcriptRef = useRef<string>('');

  // Define startRecording early using useCallback
  const startRecording = useCallback(async () => {
    if (!Voice) {
      console.log('Voice module not available');
      return;
    }

    try {
      setIsRecording(true);
      setRecordingStage('listening');
      await Voice.start('en-US');
      console.log('Voice recording started');
    } catch (error) {
      console.error('Error starting voice recording:', error);
      setIsRecording(false);
      setRecordingStage('ready');
    }
  }, []);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
    if (Voice) {
      setupVoiceRecognition();
    }
    
    return () => {
      if (Voice) {
        Voice.destroy().then(Voice.removeAllListeners);
      }
    };
  }, []);

  // Auto-start recording when modal opens
  useEffect(() => {
    if (isVisible && recordingStage === 'ready') {
      const timer = setTimeout(() => {
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, recordingStage, startRecording]);

  const requestPermissions = async () => {
    try {
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      if (audioStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to record voice notes.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const setupVoiceRecognition = () => {
    if (!Voice) return;

    Voice.onSpeechStart = () => {
      console.log('Speech recognition started');
    };

    Voice.onSpeechRecognized = () => {
      console.log('Speech recognized');
    };

    Voice.onSpeechEnd = () => {
      console.log('Speech recognition ended');
    };

    Voice.onSpeechError = (error: { error?: { code: string } }) => {
      console.error('Speech recognition error:', error);
      if (error.error?.code === '7') {
        setTranscript('No speech detected. Please try again.');
      }
    };

    Voice.onSpeechResults = (event: { value?: string[] }) => {
      if (event.value && event.value.length > 0) {
        const recognizedText = event.value[0];
        transcriptRef.current = recognizedText;
        setTranscript(recognizedText);
        console.log('Speech recognition result:', recognizedText);
      }
    };

    Voice.onSpeechPartialResults = (event: { value?: string[] }) => {
      if (event.value && event.value.length > 0) {
        const partialText = event.value[0];
        setTranscript(partialText);
        console.log('Speech recognition partial result:', partialText);
      }
    };

    Voice.onSpeechVolumeChanged = (event: { value: number }) => {
      console.log('Speech volume changed:', event.value);
    };
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setRecordingStage('processing');
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setAudioUri(uri);

      if (Voice) {
        await Voice.stop();
      }

      const finalTranscript = transcriptRef.current || transcript || 'Voice note recorded';
      await processTranscription(finalTranscript);

    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
      setRecordingStage('ready');
      setIsProcessing(false);
    }
  };

  const processTranscription = async (transcriptionText: string) => {
    try {
      if (!transcriptionText || transcriptionText.trim().length < 2) {
        Alert.alert('Recording too short', 'Please speak for at least a few words.');
        setRecordingStage('ready');
        setIsProcessing(false);
        return;
      }

      const sortLaterBin = bins.find((bin: { name: string; id: string }) => bin.name === 'Sort Later');
      
      let aiTitle = 'Voice Note';
      const words = transcriptionText.trim().split(' ');
      if (words.length > 6) {
        aiTitle = words.slice(0, 6).join(' ') + '...';
      } else {
        aiTitle = transcriptionText.trim();
      }

      if (!user?.isPremium && !user?.isTestUser) {
        const thoughtmarkData = {
          title: aiTitle,
          content: transcriptionText.trim(),
          tags: ['voice'],
          binId: sortLaterBin?.id || undefined,
          isTask: false,
          isCompleted: false,
          dueDate: null,
          isPinned: false,
        };

        const thoughtmarkId = Date.now().toString();
        createThoughtmark(thoughtmarkData);
        setAutoSaveId(thoughtmarkId);
        setHasAutoSaved(true);
      }

      setRecordingStage('complete');
      setIsProcessing(false);

      Alert.alert(
        'Voice Note Saved',
        user?.isPremium || user?.isTestUser 
          ? 'Your voice note has been processed. You can now edit it.'
          : 'Your voice note has been auto-saved to Sort Later.',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              if (onComplete) {
                onComplete(autoSaveId || undefined, transcriptionText.trim(), aiTitle);
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error processing voice note:', error);
      Alert.alert('Save Error', 'Could not save the voice note. Please try again.');
      setRecordingStage('ready');
      setIsProcessing(false);
    }
  };

  const cancelRecording = () => {
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
    if (Voice) {
      Voice.stop();
    }
    setIsRecording(false);
    setRecordingStage('ready');
    onClose();
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.xl,
      margin: tokens.spacing.lg,
      width: Dimensions.get('window').width - tokens.spacing.lg * 2,
      maxWidth: 400,
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: tokens.spacing.lg,
    },
    closeButton: {
      padding: tokens.spacing.sm,
    },
    title: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text,
      textAlign: 'center',
    },
    recordButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: tokens.colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: tokens.spacing.lg,
    },
    recordButtonRecording: {
      backgroundColor: tokens.colors.danger,
    },
    recordButtonDisabled: {
      backgroundColor: tokens.colors.textMuted,
    },
    recordIcon: {
      color: tokens.colors.background,
    },
    statusText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      marginBottom: tokens.spacing.md,
    },
    transcriptContainer: {
      width: '100%',
      minHeight: 100,
      backgroundColor: tokens.colors.backgroundSecondary,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.md,
      marginTop: tokens.spacing.md,
    },
    transcriptText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
      lineHeight: 20,
    },
    messageText: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: tokens.spacing.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radius.md,
      backgroundColor: tokens.colors.surface,
      borderWidth: 1,
      borderColor: tokens.colors.border,
    },
    actionButtonText: {
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.text,
    },
    testButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      borderRadius: tokens.radius.md,
      backgroundColor: tokens.colors.accent,
      marginTop: tokens.spacing.md,
    },
    testButtonText: {
      marginLeft: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.background,
      fontWeight: '600',
    },
    testTipText: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.textMuted,
      textAlign: 'center',
      marginTop: tokens.spacing.sm,
      fontStyle: 'italic',
    },
    recordingIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
    successIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#10B981',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
      onRequestClose={cancelRecording}
      accessible={false}
      accessibilityLabel='Modal'
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={{ width: 40 }} />
            <Text style={styles.title}>Voice Recorder</Text>
            <TouchableOpacity style={styles.closeButton} onPress={cancelRecording} accessibilityRole='button' accessible={true} accessibilityLabel='Button'>
              <Ionicons name='close' size={24} color={tokens.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Record Your Thought</Text>
          
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonRecording,
              isProcessing && styles.recordButtonDisabled,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Button'
          >
            <Ionicons
              name={isRecording ? 'stop' : 'mic'}
              size={32}
              style={styles.recordIcon}
            />
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {isRecording
              ? 'Recording... Tap to stop'
              : isProcessing
              ? 'Processing audio...'
              : 'Tap to start recording'}
          </Text>

          {transcript ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          ) : (
            <Text style={styles.messageText}>
              {isProcessing
                ? 'Converting speech to text...'
                : 'Your transcript will appear here'}
            </Text>
          )}

          <TouchableOpacity 
            style={styles.testButton} 
            onPress={() => Speech.speak('This is a test of the voice recorder functionality.')}
            accessibilityRole='button'
            accessible={true}
            accessibilityLabel='Button'
          >
            <Ionicons name='flask' size={16} color={tokens.colors.accent} />
            <Text style={styles.testButtonText}>Test Audio</Text>
          </TouchableOpacity>
          <Text style={styles.testTipText}>
            Tap to hear a test message
          </Text>
          <Text style={styles.testTipText}>
            (Requires device audio)
          </Text>

          {transcript && (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => {
                  onComplete?.(autoSaveId || undefined, transcript, 'Voice Note');
                  onClose();
                }}
                accessibilityRole='button'
                accessible={true}
                accessibilityLabel='Button'
              >
                <Ionicons name='checkmark' size={16} color={tokens.colors.success} />
                <Text style={styles.actionButtonText}>Use</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={cancelRecording} 
                accessibilityRole='button' 
                accessible={true} 
                accessibilityLabel='Button'
              >
                <Ionicons name='refresh' size={16} color={tokens.colors.textSecondary} />
                <Text style={styles.actionButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
