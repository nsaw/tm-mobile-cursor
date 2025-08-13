import { Thoughtmark, CreateThoughtmarkRequest, UpdateThoughtmarkRequest, AIInsight } from '../types/thoughtmark';
import { apiClient } from '../../../services/api/apiClient';

class ThoughtmarkService {
  private readonly baseUrl = '/thoughtmarks';

  async getThoughtmarks(filters?: any): Promise<Thoughtmark[]> {
    try {
      const response = await apiClient.get(this.baseUrl, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching thoughtmarks:', error);
      throw error;
    }
  }

  async createThoughtmark(request: CreateThoughtmarkRequest): Promise<Thoughtmark> {
    try {
      const response = await apiClient.post(this.baseUrl, request);
      return response.data;
    } catch (error) {
      console.error('Error creating thoughtmark:', error);
      throw error;
    }
  }

  async updateThoughtmark(id: string, updates: UpdateThoughtmarkRequest): Promise<Thoughtmark> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating thoughtmark:', error);
      throw error;
    }
  }

  async deleteThoughtmark(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting thoughtmark:', error);
      throw error;
    }
  }

  async generateAIInsights(id: string): Promise<AIInsight[]> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/${id}/ai-insights`);
      return response.data;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      throw error;
    }
  }
}

export const thoughtmarkService = new ThoughtmarkService();
