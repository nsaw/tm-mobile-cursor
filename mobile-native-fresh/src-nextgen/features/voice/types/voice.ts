export interface VoiceRecording {
  id: string;
  url: string;
  duration: number;
  transcription?: string;
  status: 'recording' | 'processing' | 'completed' | 'error';
  createdAt: string;
  metadata: VoiceMetadata;
}

export interface VoiceMetadata {
  sampleRate: number;
  channels: number;
  bitDepth: number;
  format: string;
  size: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  segments: TranscriptionSegment[];
  language: string;
}

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

export interface VoiceRecorderConfig {
  quality: 'low' | 'medium' | 'high';
  maxDuration: number;
  autoTranscribe: boolean;
  language: string;
}
