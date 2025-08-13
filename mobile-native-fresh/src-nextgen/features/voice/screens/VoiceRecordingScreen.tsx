import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { VoiceRecorder } from '../../components/ui/VoiceRecorder';
import { AudioPlayer } from '../components/AudioPlayer';
import { TranscriptionView } from '../components/TranscriptionView';

export const VoiceRecordingScreen: React.FC = () => {
  const handleRecordingComplete = (recording: any) => {
    console.log('Recording completed:', recording);
  };

  const handleTranscriptionComplete = (transcription: any) => {
    console.log('Transcription completed:', transcription);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Recording</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Record Voice Note</Text>
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Recordings</Text>
          <AudioPlayer />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transcriptions</Text>
          <TranscriptionView />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
});
