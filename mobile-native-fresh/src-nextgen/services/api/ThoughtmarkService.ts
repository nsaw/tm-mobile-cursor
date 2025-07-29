import { Thoughtmark, Bin } from '../../types/DataTypes';
import { ApiResponse } from '../../types/ApiTypes';

import { ApiClient } from './ApiClient';

export interface CreateThoughtmarkData {
  title: string;
  content: string;
  tags: string[];
  binId: string;
}

export interface UpdateThoughtmarkData extends Partial<CreateThoughtmarkData> {
  id: string;
}

export interface ThoughtmarkFilters {
  binId?: string;
  tags?: string[];
  search?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  sortBy?: 'created' | 'updated' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreateBinData {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateBinData extends Partial<CreateBinData> {
  id: string;
}

export class ThoughtmarkService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Thoughtmark operations
  async getThoughtmarks(filters?: ThoughtmarkFilters): Promise<ApiResponse<Thoughtmark[]>> {
    return this.apiClient.get<Thoughtmark[]>('/thoughtmarks', filters);
  }

  async getThoughtmark(id: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.get<Thoughtmark>(`/thoughtmarks/${id}`);
  }

  async createThoughtmark(data: CreateThoughtmarkData): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.post<Thoughtmark>('/thoughtmarks', data);
  }

  async updateThoughtmark(data: UpdateThoughtmarkData): Promise<ApiResponse<Thoughtmark>> {
    const { id, ...updateData } = data;
    return this.apiClient.put<Thoughtmark>(`/thoughtmarks/${id}`, updateData);
  }

  async deleteThoughtmark(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/thoughtmarks/${id}`);
  }

  async archiveThoughtmark(id: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.patch<Thoughtmark>(`/thoughtmarks/${id}/archive`);
  }

  async unarchiveThoughtmark(id: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.patch<Thoughtmark>(`/thoughtmarks/${id}/unarchive`);
  }

  async pinThoughtmark(id: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.patch<Thoughtmark>(`/thoughtmarks/${id}/pin`);
  }

  async unpinThoughtmark(id: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.patch<Thoughtmark>(`/thoughtmarks/${id}/unpin`);
  }

  async moveThoughtmark(id: string, binId: string): Promise<ApiResponse<Thoughtmark>> {
    return this.apiClient.patch<Thoughtmark>(`/thoughtmarks/${id}/move`, { binId });
  }

  async searchThoughtmarks(query: string, filters?: Omit<ThoughtmarkFilters, 'search'>): Promise<ApiResponse<Thoughtmark[]>> {
    return this.apiClient.get<Thoughtmark[]>('/thoughtmarks/search', {
      ...filters,
      search: query,
    });
  }

  // Bin operations
  async getBins(): Promise<ApiResponse<Bin[]>> {
    return this.apiClient.get<Bin[]>('/bins');
  }

  async getBin(id: string): Promise<ApiResponse<Bin>> {
    return this.apiClient.get<Bin>(`/bins/${id}`);
  }

  async createBin(data: CreateBinData): Promise<ApiResponse<Bin>> {
    return this.apiClient.post<Bin>('/bins', data);
  }

  async updateBin(data: UpdateBinData): Promise<ApiResponse<Bin>> {
    const { id, ...updateData } = data;
    return this.apiClient.put<Bin>(`/bins/${id}`, updateData);
  }

  async deleteBin(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<void>(`/bins/${id}`);
  }

  async reorderBins(binIds: string[]): Promise<ApiResponse<Bin[]>> {
    return this.apiClient.post<Bin[]>('/bins/reorder', { binIds });
  }
} 