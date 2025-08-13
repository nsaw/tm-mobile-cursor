import { apiClient } from '../api/apiClient';
import { Bin } from '../types/bin';

export interface CreateBinRequest {
  name: string;
  description?: string;
  color?: string;
}

class BinsService {
  async getBins(): Promise<Bin[]> {
    return apiClient.get<Bin[]>('/bins');
  }

  async getBin(id: string): Promise<Bin> {
    return apiClient.get<Bin>(`/bins/${id}`);
  }

  async createBin(data: CreateBinRequest): Promise<Bin> {
    return apiClient.post<Bin>('/bins', data);
  }

  async updateBin(id: string, data: Partial<CreateBinRequest>): Promise<Bin> {
    return apiClient.put<Bin>(`/bins/${id}`, data);
  }

  async deleteBin(id: string): Promise<void> {
    return apiClient.delete(`/bins/${id}`);
  }
}

export const binsService = new BinsService();
