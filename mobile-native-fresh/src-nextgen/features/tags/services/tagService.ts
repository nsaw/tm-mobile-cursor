import { Tag, CreateTagRequest, UpdateTagRequest, TagFilters } from '../types/tagTypes';
import { apiClient } from '../../../services/api/apiClient';

class TagService {
  private readonly baseUrl = '/tags';

  async getTags(filters?: TagFilters): Promise<Tag[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.includeSystem) params.append('includeSystem', 'true');
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  async getTag(id: string): Promise<Tag> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  }

  async createTag(tagData: CreateTagRequest): Promise<Tag> {
    try {
      const response = await apiClient.post(this.baseUrl, tagData);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  async updateTag(id: string, tagData: UpdateTagRequest): Promise<Tag> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, tagData);
      return response.data;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  }

  async deleteTag(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  }
}

export const tagService = new TagService();
