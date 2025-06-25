import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useThoughtmarks } from '../../features/home/hooks/useThoughtmarks';
import { useBins } from '../../features/home/hooks/useBins';

interface VoiceRecorderProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete?: (thoughtmarkId?: number, transcript?: string, aiTitle?: string) => void;
}

type RecordingStage = 'ready' | 'listening' | 'processing' | 'complete';

// Fallback voice recognition for Expo Go
let Voice: any = null;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (error) {
  console.log('Voice module not available in Expo Go, using fallback');
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isVisible,
  onClose,
  onComplete,
}) => {
  const { tokens } = useTheme();
  const { user } = useAuth();
  const { createThoughtmark } = useThoughtmarks();
  const { bins } = useBins();

  const [recordingStage, setRecordingStage] = useState<RecordingStage>('ready');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [hasAutoSaved, setHasAutoSaved] = useState(false);
  const [autoSaveId, setAutoSaveId] = useState<number | null>(null);

  const transcriptRef = useRef<string>('');

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
  }, [isVisible, recordingStage]);

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

    Voice.onSpeechError = (error: any) => {
      console.error('Speech recognition error:', error);
      if (error.error?.code === '7') {
        // No speech detected
        setTranscript('No speech detected. Please try again.');
      }
    };

    Voice.onSpeechResults = (event: any) => {
      if (event.value && event.value.length > 0) {
        const recognizedText = event.value[0];
        transcriptRef.current = recognizedText;
        setTranscript(recognizedText);
        console.log('Speech recognition result:', recognizedText);
      }
    };

    Voice.onSpeechPartialResults = (event: any) => {
      if (event.value && event.value.length > 0) {
        const partialText = event.value[0];
        setTranscript(partialText);
        console.log('Speech recognition partial result:', partialText);
      }
    };

    Voice.onSpeechVolumeChanged = (event: any) => {
      console.log('Speech volume changed:', event.value);
    };
  };

  const startRecording = async () => {
    try {
      setTranscript('');
      transcriptRef.current = '';
      setRecordingStage('listening');

      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      // Start voice recognition if available
      if (Voice) {
        await Voice.start('en-US');
      } else {
        // Fallback for Expo Go - simulate transcription
        setTimeout(() => {
          setTranscript('Voice recording in progress... (Transcription not available in Expo Go)');
        }, 1000);
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
      setRecordingStage('ready');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setRecordingStage('processing');
      setIsProcessing(true);

      await recording.stopAndUnloadAsync();
      setRecording(null);

      // Stop voice recognition if available
      if (Voice) {
        await Voice.stop();
      }

      // Get the final transcript
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
      // Validate transcription
      if (!transcriptionText || transcriptionText.trim().length < 2) {
        Alert.alert('Recording too short', 'Please speak for at least a few words.');
        setRecordingStage('ready');
        setIsProcessing(false);
        return;
      }

      // Find "Sort Later" bin
      const sortLaterBin = bins.find((bin: any) => bin.name === 'Sort Later');
      
      // Generate AI-suggested title (simplified for now)
      let aiTitle = 'Voice Note';
      const words = transcriptionText.trim().split(' ');
      if (words.length > 6) {
        aiTitle = words.slice(0, 6).join(' ') + '...';
      } else {
        aiTitle = transcriptionText.trim();
      }

      // Auto-save if app is in background or user is not premium
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

        const newThoughtmark = await createThoughtmark(thoughtmarkData);
        setAutoSaveId(newThoughtmark.id);
        setHasAutoSaved(true);
      }

      setRecordingStage('complete');
      setIsProcessing(false);

      // Show success message
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

  const getStageContent = () => {
    switch (recordingStage) {
      case 'ready':
        return {
          title: 'Voice Recorder',
          message: Voice ? 'Preparing to listen...' : 'Voice recording (Expo Go mode)',
          icon: <Ionicons name="mic" size={64} color={designTokens.colors.accent} />,
          showCancel: true,
        };
      case 'listening':
        return {
          title: 'Now listening...',
          message: transcript || (Voice ? 'Tell me about your idea, task, or thought. I\'ll capture and organize it for you.' : 'Recording in progress...'),
          icon: (
            <View style={styles.recordingIcon}>
              <Ionicons name="mic" size={32} color="#FFFFFF" />
            </View>
          ),
          showCancel: true,
        };
      case 'processing':
        return {
          title: 'Processing...',
          message: 'Creating your thoughtmark...',
          icon: <ActivityIndicator size={64} color={designTokens.colors.accent} />,
          showCancel: false,
        };
      case 'complete':
        return {
          title: 'Saved!',
          message: 'Your voice note has been saved successfully',
          icon: (
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={32} color="#FFFFFF" />
            </View>
          ),
          showCancel: false,
        };
    }
  };

  const stageContent = getStageContent();

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={cancelRecording}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: designTokens.colors.backgroundSecondary }]}>
          {/* Cancel Button */}
          {stageContent.showCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelRecording}
            >
              <Ionicons name="close" size={24} color={designTokens.colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              {stageContent.icon}
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: designTokens.colors.text }]}>
              {stageContent.title}
            </Text>

            {/* Message/Transcript */}
            <View style={styles.messageContainer}>
              {recordingStage === 'listening' && transcript ? (
                <View style={[styles.transcriptContainer, { backgroundColor: designTokens.colors.surface }]}>
                  <Text style={[styles.transcriptText, { color: designTokens.colors.text }]}>
                    {transcript}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.messageText, { color: designTokens.colors.textSecondary }]}>
                  {stageContent.message}
                </Text>
              )}
            </View>

            {/* Action Buttons */}
            {recordingStage === 'listening' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={stopRecording}
                >
                  <Ionicons name="square" size={24} color="#FFFFFF" />
                  <Text style={styles.stopButtonText}>Stop & Save</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Test Button for Development */}
            {recordingStage === 'ready' && __DEV__ && (
              <View style={styles.testContainer}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => processTranscription("This is a test voice note to verify the thoughtmark creation functionality is working properly.")}
                >
                  <Ionicons name="flask" size={16} color={designTokens.colors.accent} />
                  <Text style={[styles.testButtonText, { color: designTokens.colors.accent }]}>
                    Test Save Function
                  </Text>
                </TouchableOpacity>
                <View style={styles.testTips}>
                  <Text style={[styles.testTipText, { color: designTokens.colors.textMuted }]}>
                    Try saying:
                  </Text>
                  <Text style={[styles.testTipText, { color: designTokens.colors.textMuted }]}>
                    "Remind me to call John tomorrow"
                  </Text>
                  <Text style={[styles.testTipText, { color: designTokens.colors.textMuted }]}>
                    "I had an idea about improving our workflow"
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  cancelButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(128, 128, 128, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageContainer: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  transcriptContainer: {
    padding: 16,
    borderRadius: 16,
    maxHeight: 120,
    width: '100%',
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  stopButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  testContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  testTips: {
    marginTop: 16,
    alignItems: 'center',
  },
  testTipText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
}); 