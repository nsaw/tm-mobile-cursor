export interface VoiceRecording {
  id: string;
  title: string;
  duration: number; // seconds
  filePath: string;
  createdAt: string;
  isTranscribed: boolean;
  transcription?: string;
  tags: string[];
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // seconds
  currentTime: number; // seconds
  error: string | null;
}

export interface VoiceRecorderConfig {
  sampleRate: number;
  channels: number;
  bitDepth: number;
  format: 'wav' | 'mp3' | 'm4a';
  maxDuration: number; // seconds
}
