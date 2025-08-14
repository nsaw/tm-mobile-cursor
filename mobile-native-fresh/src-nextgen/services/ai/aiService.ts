import { apiClient } from '../api/apiClient';

export interface AIInsightRequest {
  content: string;
  type: 'summary' | 'analysis' | 'suggestions';
}

export interface AIInsightResponse {
  insight: string;
  confidence: number;
  suggestions?: string[];
}

class AIService {
  async getInsight(request: AIInsightRequest): Promise<AIInsightResponse> {
    const response = await apiClient.post<AIInsightResponse>('/ai/insight', request);
    return response.data;
  }

  async generateTags(content: string): Promise<string[]> {
    const response = await apiClient.post<{ tags: string[] }>('/ai/tags', { content });
    return response.data.tags;
  }

  async suggestBins(content: string): Promise<string[]> {
    const response = await apiClient.post<{ bins: string[] }>('/ai/suggest-bins', { content });
    return response.data.bins;
  }
}

export const aiService = new AIService();
