import { apiClient } from '../api/apiClient';
import { Thoughtmark } from '../types/thoughtmark';

export interface CreateThoughtmarkRequest {
  content: string;
  tags?: string[];
  binId?: string;
}

export interface UpdateThoughtmarkRequest {
  content?: string;
  tags?: string[];
  binId?: string;
}

class ThoughtmarksService {
  async getThoughtmarks(): Promise<Thoughtmark[]> {
    const response = await apiClient.get<Thoughtmark[]>('/thoughtmarks');
    return response.data;
  }

  async getThoughtmark(id: string): Promise<Thoughtmark> {
    const response = await apiClient.get<Thoughtmark>(`/thoughtmarks/${id}`);
    return response.data;
  }

  async createThoughtmark(data: CreateThoughtmarkRequest): Promise<Thoughtmark> {
    const response = await apiClient.post<Thoughtmark>('/thoughtmarks', data);
    return response.data;
  }

  async updateThoughtmark(id: string, data: UpdateThoughtmarkRequest): Promise<Thoughtmark> {
    const response = await apiClient.put<Thoughtmark>(`/thoughtmarks/${id}`, data);
    return response.data;
  }

  async deleteThoughtmark(id: string): Promise<void> {
    await apiClient.delete(`/thoughtmarks/${id}`);
  }

  async searchThoughtmarks(query: string): Promise<Thoughtmark[]> {
    const response = await apiClient.get<Thoughtmark[]>(`/thoughtmarks/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const thoughtmarksService = new ThoughtmarksService();
