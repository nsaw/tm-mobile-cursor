import { Text ,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
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
  const { tokens: designTokens } = useTheme();
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
  const [audioUri, setAudioUri] = useState<string | null>(null);

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
      if (audioUri) {
        Alert.alert('Recording in progress', 'You are already recording.');
        return;
      }

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
      setAudioUri(null);

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
      const uri = recording.getURI();
      setRecording(null);
      setAudioUri(uri);

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

  const styles = StyleSheet.create({
    actionButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.surface,
      borderColor: designTokens.colors.border,
      borderRadius: designTokens.radius.md,
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    actionButtonText: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.sm,
      marginLeft: designTokens.spacing.sm,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: designTokens.spacing.lg,
      width: '100%',
    },
    closeButton: {
      padding: designTokens.spacing.sm,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: designTokens.spacing.lg,
      width: '100%',
    },
    messageText: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.sm,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    modalContent: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.surface,
      borderRadius: designTokens.radius.lg,
      margin: designTokens.spacing.lg,
      maxWidth: 400,
      padding: designTokens.spacing.xl,
      width: Dimensions.get('window').width - designTokens.spacing.lg * 2,
    },
    modalOverlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
      justifyContent: 'center',
    },
    recordButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: 40,
      height: 80,
      justifyContent: 'center',
      marginVertical: designTokens.spacing.lg,
      width: 80,
    },
    recordButtonDisabled: {
      backgroundColor: designTokens.colors.textMuted,
    },
    recordButtonRecording: {
      backgroundColor: designTokens.colors.danger,
    },
    recordIcon: {
      color: designTokens.colors.background,
    },
    recordingIcon: {
      alignItems: 'center',
      backgroundColor: '#EF4444',
      borderRadius: 32,
      elevation: 8,
      height: 64,
      justifyContent: 'center',
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      width: 64,
    },
    statusText: {
      color: designTokens.colors.textSecondary,
      fontSize: designTokens.typography.fontSize.body,
      marginBottom: designTokens.spacing.md,
      textAlign: 'center',
    },
    successIcon: {
      alignItems: 'center',
      backgroundColor: '#10B981',
      borderRadius: 32,
      height: 64,
      justifyContent: 'center',
      width: 64,
    },
    testButton: {
      alignItems: 'center',
      backgroundColor: designTokens.colors.accent,
      borderRadius: designTokens.radius.md,
      flexDirection: 'row',
      marginTop: designTokens.spacing.md,
      paddingHorizontal: designTokens.spacing.md,
      paddingVertical: designTokens.spacing.sm,
    },
    testButtonText: {
      color: designTokens.colors.background,
      fontSize: designTokens.typography.fontSize.sm,
      fontWeight: '600',
      marginLeft: designTokens.spacing.sm,
    },
    testTipText: {
      color: designTokens.colors.textMuted,
      fontSize: designTokens.typography.fontSize.xs,
      fontStyle: 'italic',
      marginTop: designTokens.spacing.sm,
      textAlign: 'center',
    },
    title: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.lg,
      fontWeight: '600',
      textAlign: 'center',
    },
    transcriptContainer: {
      backgroundColor: designTokens.colors.backgroundSecondary,
      borderRadius: designTokens.radius.md,
      marginTop: designTokens.spacing.md,
      minHeight: 100,
      padding: designTokens.spacing.md,
      width: '100%',
    },
    transcriptText: {
      color: designTokens.colors.text,
      fontSize: designTokens.typography.fontSize.body,
      lineHeight: 20,
    },
  });

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={cancelRecording}
     accessible={false} accessibilityLabel="Modal">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={{ width: 40 }} />
            <Text style={styles.title}>Voice Recorder</Text>
            <TouchableOpacity style={styles.closeButton} onPress={cancelRecording} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
              <Ionicons name="close" size={24} color={designTokens.colors.textSecondary} />
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
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={32}
              style={styles.recordIcon}
            />
          </TouchableOpacity>

          <Text style={styles.statusText}>
            {isRecording
              ? "Recording... Tap to stop"
              : isProcessing
              ? "Processing audio..."
              : "Tap to start recording"}
          </Text>

          {transcript ? (
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          ) : (
            <Text style={styles.messageText}>
              {isProcessing
                ? "Converting speech to text..."
                : "Your transcript will appear here"}
            </Text>
          )}

          <TouchableOpacity style={styles.testButton} 
            onPress={() => Speech.speak("This is a test of the voice recorder functionality.")}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Button"
          >
            <Ionicons name="flask" size={16} color={designTokens.colors.accent} />
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
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
              >
                <Ionicons name="checkmark" size={16} color={designTokens.colors.success} />
                <Text style={styles.actionButtonText}>Use</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={cancelRecording} 
                accessibilityRole="button" 
                accessible={true} 
                accessibilityLabel="Button"
              >
                <Ionicons name="refresh" size={16} color={designTokens.colors.textSecondary} />
                <Text style={styles.actionButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}; 