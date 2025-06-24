import { Thoughtmark, Bin, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  // Thoughtmarks
  async getThoughtmarks(): Promise<Thoughtmark[]> {
    return this.request<Thoughtmark[]>('/thoughtmarks');
  }

  async getThoughtmark(id: number): Promise<Thoughtmark> {
    return this.request<Thoughtmark>(`/thoughtmarks/${id}`);
  }

  async createThoughtmark(thoughtmark: Partial<Thoughtmark>): Promise<Thoughtmark> {
    return this.request<Thoughtmark>('/thoughtmarks', {
      method: 'POST',
      body: JSON.stringify(thoughtmark),
    });
  }

  async updateThoughtmark(id: number, thoughtmark: Partial<Thoughtmark>): Promise<Thoughtmark> {
    return this.request<Thoughtmark>(`/thoughtmarks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(thoughtmark),
    });
  }

  async deleteThoughtmark(id: number): Promise<void> {
    return this.request<void>(`/thoughtmarks/${id}`, {
      method: 'DELETE',
    });
  }

  // Bins
  async getBins(): Promise<Bin[]> {
    return this.request<Bin[]>('/bins');
  }

  async createBin(bin: Partial<Bin>): Promise<Bin> {
    return this.request<Bin>('/bins', {
      method: 'POST',
      body: JSON.stringify(bin),
    });
  }

  // Search
  async searchThoughtmarks(query: string): Promise<Thoughtmark[]> {
    return this.request<Thoughtmark[]>(`/search?q=${encodeURIComponent(query)}`);
  }
}

export const thoughtmarkService = new ApiService();