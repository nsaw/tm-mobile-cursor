import { apiClient } from '../../../services/api/apiClient';
import {
  Bin,
  Tag,
  OrganizationItem,
  OrganizationFilter,
  BulkOperation,
  OrganizationStats,
} from '../types/organization';

class OrganizationService {
  private readonly baseUrl = '/organization';

  async getBins(): Promise<Bin[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/bins`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bins:', error);
      throw error;
    }
  }

  async createBin(binData: Partial<Bin>): Promise<Bin> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/bins`, binData);
      return response.data;
    } catch (error) {
      console.error('Error creating bin:', error);
      throw error;
    }
  }

  async updateBin(id: string, updates: Partial<Bin>): Promise<Bin> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/bins/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating bin:', error);
      throw error;
    }
  }

  async deleteBin(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/bins/${id}`);
    } catch (error) {
      console.error('Error deleting bin:', error);
      throw error;
    }
  }

  async getTags(): Promise<Tag[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/tags`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/tags`, tagData);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  async updateTag(id: string, updates: Partial<Tag>): Promise<Tag> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/tags/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  async deleteTag(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/tags/${id}`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }

  async getItems(filter?: OrganizationFilter): Promise<OrganizationItem[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/items`, {
        params: filter,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async performBulkOperation(operation: BulkOperation): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/bulk-operation`, operation);
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw error;
    }
  }

  async getStats(): Promise<OrganizationStats> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization stats:', error);
      throw error;
    }
  }
}

export const organizationService = new OrganizationService();
