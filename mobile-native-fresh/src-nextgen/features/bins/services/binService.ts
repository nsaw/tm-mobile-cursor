import { Bin, CreateBinRequest, UpdateBinRequest, BinFilters } from '../types/binTypes';
import { apiClient } from '../../../services/api/apiClient';

class BinService {
  private readonly baseUrl = '/bins';

  async getBins(filters?: BinFilters): Promise<Bin[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.includeArchived) params.append('includeArchived', 'true');
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bins:', error);
      throw error;
    }
  }

  async getBin(id: string): Promise<Bin> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bin:', error);
      throw error;
    }
  }

  async createBin(binData: CreateBinRequest): Promise<Bin> {
    try {
      const response = await apiClient.post(this.baseUrl, binData);
      return response.data;
    } catch (error) {
      console.error('Error creating bin:', error);
      throw error;
    }
  }

  async updateBin(id: string, binData: UpdateBinRequest): Promise<Bin> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, binData);
      return response.data;
    } catch (error) {
      console.error('Error updating bin:', error);
      throw error;
    }
  }

  async deleteBin(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting bin:', error);
      throw error;
    }
  }

  async archiveBin(id: string): Promise<Bin> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving bin:', error);
      throw error;
    }
  }

  async restoreBin(id: string): Promise<Bin> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error restoring bin:', error);
      throw error;
    }
  }
}

export const binService = new BinService();
