import { apiClient } from '../api/apiClient';

export interface VoiceTranscriptionRequest {
  audioData: string;
  format: 'wav' | 'mp3' | 'm4a';
}

export interface VoiceTranscriptionResponse {
  text: string;
  confidence: number;
  duration: number;
}

class VoiceService {
  async transcribeAudio(request: VoiceTranscriptionRequest): Promise<VoiceTranscriptionResponse> {
    const response = await apiClient.post<VoiceTranscriptionResponse>('/voice/transcribe', request);
    return response.data;
  }

  async textToSpeech(text: string): Promise<string> {
    const response = await apiClient.post<{ audioUrl: string }>('/voice/tts', { text });
    return response.data.audioUrl;
  }
}

export const voiceService = new VoiceService();
