import { VoiceRecording, TranscriptionResult } from '../types/voice';
import { apiClient } from '../../../services/api/apiClient';

class VoiceService {
  private readonly baseUrl = '/voice';

  async uploadRecording(uri: string, duration: number): Promise<VoiceRecording> {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('duration', duration.toString());

      const response = await apiClient.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading recording:', error);
      throw error;
    }
  }

  async transcribeAudio(recordingId: string): Promise<TranscriptionResult> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${recordingId}/transcribe`);
      return response.data;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async deleteRecording(recordingId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${recordingId}`);
    } catch (error) {
      console.error('Error deleting recording:', error);
      throw error;
    }
  }

  async getRecordings(): Promise<VoiceRecording[]> {
    try {
      const response = await apiClient.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching recordings:', error);
      throw error;
    }
  }
}

export const voiceService = new VoiceService();
