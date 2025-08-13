import { useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { voiceService } from '../services/voiceService';
import { VoiceRecording, TranscriptionResult } from '../types/voice';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setDuration(0);

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access microphone was denied');
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setIsRecording(true);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Error starting recording:', err);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    try {
      if (!recordingRef.current) return;

      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      setIsRecording(false);

      if (uri) {
        // Upload recording
        const uploadedRecording = await voiceService.uploadRecording(uri, duration);
        setRecording(uploadedRecording);

        // Auto-transcribe if enabled
        if (uploadedRecording.status === 'completed') {
          const transcriptionResult = await voiceService.transcribeAudio(uploadedRecording.id);
          setTranscription(transcriptionResult);
        }
      }
    } catch (err) {
      setError('Failed to stop recording');
      console.error('Error stopping recording:', err);
    }
  }, [duration]);

  const transcribeRecording = useCallback(async (recordingId: string) => {
    try {
      const result = await voiceService.transcribeAudio(recordingId);
      setTranscription(result);
      return { success: true, data: result };
    } catch (err) {
      setError('Failed to transcribe recording');
      console.error('Error transcribing recording:', err);
      return { success: false, error: err };
    }
  }, []);

  const deleteRecording = useCallback(async (recordingId: string) => {
    try {
      await voiceService.deleteRecording(recordingId);
      setRecording(null);
      setTranscription(null);
      return { success: true };
    } catch (err) {
      setError('Failed to delete recording');
      console.error('Error deleting recording:', err);
      return { success: false, error: err };
    }
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
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
  };
};
