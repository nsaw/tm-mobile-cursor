export interface VoiceTranscriptionRequest {
  audioData: string; // Base64 encoded audio data
  language?: string;
  model?: string;
}

export interface VoiceTranscriptionResponse {
  text: string;
  confidence: number;
  language: string;
  segments?: {
    start: number;
    end: number;
    text: string;
    confidence: number;
  }[];
}
