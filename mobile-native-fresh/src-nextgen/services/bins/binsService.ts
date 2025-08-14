import { apiClient } from '../api/apiClient';
import { Bin } from '../types/bin';

export interface CreateBinRequest {
  name: string;
  description?: string;
  color?: string;
}

class BinsService {
  async getBins(): Promise<Bin[]> {
    const response = await apiClient.get<Bin[]>('/bins');
    return response.data;
  }

  async getBin(id: string): Promise<Bin> {
    const response = await apiClient.get<Bin>(`/bins/${id}`);
    return response.data;
  }

  async createBin(data: CreateBinRequest): Promise<Bin> {
    const response = await apiClient.post<Bin>('/bins', data);
    return response.data;
  }

  async updateBin(id: string, data: Partial<CreateBinRequest>): Promise<Bin> {
    const response = await apiClient.put<Bin>(`/bins/${id}`, data);
    return response.data;
  }

  async deleteBin(id: string): Promise<void> {
    await apiClient.delete(`/bins/${id}`);
  }
}

export const binsService = new BinsService();
