import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Thoughtmark, Bin, APIResponse, ThoughtmarkFormData, BinFormData } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000';

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('@thoughtmarks_token');
    const userId = await AsyncStorage.getItem('@thoughtmarks_user_id');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (userId) {
      headers['X-User-ID'] = userId;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<APIResponse<{ user: User; token: string }>> {
    return this.makeRequest('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signUp(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<APIResponse<{ user: User; token: string }>> {
    return this.makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  async signInWithGoogle(accessToken: string): Promise<APIResponse<{ user: User; token: string }>> {
    return this.makeRequest('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }

  async signInWithApple(credential: any): Promise<APIResponse<{ user: User; token: string }>> {
    return this.makeRequest('/api/auth/apple', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  }

  async validateToken(token: string): Promise<APIResponse<User>> {
    return this.makeRequest('/api/auth/validate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // User profile methods
  async getUserProfile(userId: number): Promise<APIResponse<User>> {
    return this.makeRequest(`/api/users/${userId}`);
  }

  async updateUserProfile(userId: number, updates: Partial<User>): Promise<APIResponse<User>> {
    return this.makeRequest(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateUserPreferences(
    userId: number,
    preferences: {
      marketingEmails?: boolean;
      aiNotifications?: boolean;
      smartReminders?: boolean;
      privacyConsent?: boolean;
    }
  ): Promise<APIResponse<User>> {
    return this.makeRequest(`/api/users/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  async deleteUserAccount(userId: number): Promise<APIResponse<boolean>> {
    return this.makeRequest(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Thoughtmarks methods
  async getThoughtmarks(): Promise<APIResponse<Thoughtmark[]>> {
    return this.makeRequest('/api/thoughtmarks');
  }

  async getThoughtmark(id: number): Promise<APIResponse<Thoughtmark>> {
    return this.makeRequest(`/api/thoughtmarks/${id}`);
  }

  async createThoughtmark(data: ThoughtmarkFormData): Promise<APIResponse<Thoughtmark>> {
    return this.makeRequest('/api/thoughtmarks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateThoughtmark(id: number, data: Partial<ThoughtmarkFormData>): Promise<APIResponse<Thoughtmark>> {
    return this.makeRequest(`/api/thoughtmarks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteThoughtmark(id: number): Promise<APIResponse<boolean>> {
    return this.makeRequest(`/api/thoughtmarks/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePin(id: number): Promise<APIResponse<Thoughtmark>> {
    return this.makeRequest(`/api/thoughtmarks/${id}/toggle-pin`, {
      method: 'POST',
    });
  }

  async toggleArchive(id: number): Promise<APIResponse<Thoughtmark>> {
    return this.makeRequest(`/api/thoughtmarks/${id}/toggle-archive`, {
      method: 'POST',
    });
  }

  async searchThoughtmarks(query: string): Promise<APIResponse<Thoughtmark[]>> {
    return this.makeRequest(`/api/thoughtmarks/search?q=${encodeURIComponent(query)}`);
  }

  // Bins methods
  async getBins(): Promise<APIResponse<Bin[]>> {
    return this.makeRequest('/api/bins');
  }

  async getBin(id: number): Promise<APIResponse<Bin>> {
    return this.makeRequest(`/api/bins/${id}`);
  }

  async createBin(data: BinFormData): Promise<APIResponse<Bin>> {
    return this.makeRequest('/api/bins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBin(id: number, data: Partial<BinFormData>): Promise<APIResponse<Bin>> {
    return this.makeRequest(`/api/bins/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBin(id: number): Promise<APIResponse<boolean>> {
    return this.makeRequest(`/api/bins/${id}`, {
      method: 'DELETE',
    });
  }

  // AI methods
  async generateInsights(thoughtmarkIds?: number[]): Promise<APIResponse<any>> {
    return this.makeRequest('/api/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ thoughtmarkIds }),
    });
  }

  async categorizeThoughtmark(content: string): Promise<APIResponse<string[]>> {
    return this.makeRequest('/api/ai/categorize', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async summarizeThoughtmark(content: string): Promise<APIResponse<string>> {
    return this.makeRequest('/api/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Voice methods
  async uploadVoiceNote(formData: FormData): Promise<APIResponse<{ url: string; transcription: string }>> {
    const headers = await this.getAuthHeaders();
    delete (headers as any)['Content-Type']; // Let fetch set the boundary for multipart

    return this.makeRequest('/api/voice/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

export const apiService = new ApiService();