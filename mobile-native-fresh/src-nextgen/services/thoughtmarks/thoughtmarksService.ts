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
    return apiClient.get<Thoughtmark[]>('/thoughtmarks');
  }

  async getThoughtmark(id: string): Promise<Thoughtmark> {
    return apiClient.get<Thoughtmark>(`/thoughtmarks/${id}`);
  }

  async createThoughtmark(data: CreateThoughtmarkRequest): Promise<Thoughtmark> {
    return apiClient.post<Thoughtmark>('/thoughtmarks', data);
  }

  async updateThoughtmark(id: string, data: UpdateThoughtmarkRequest): Promise<Thoughtmark> {
    return apiClient.put<Thoughtmark>(`/thoughtmarks/${id}`, data);
  }

  async deleteThoughtmark(id: string): Promise<void> {
    return apiClient.delete(`/thoughtmarks/${id}`);
  }

  async searchThoughtmarks(query: string): Promise<Thoughtmark[]> {
    return apiClient.get<Thoughtmark[]>(`/thoughtmarks/search?q=${encodeURIComponent(query)}`);
  }
}

export const thoughtmarksService = new ThoughtmarksService();
