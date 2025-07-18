import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User, Thoughtmark, Bin, APIResponse, ThoughtmarkFormData, BinFormData } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await AsyncStorage.getItem('@thoughtmarks_token');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
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

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || responseData.message || `HTTP ${response.status}`,
        };
      }

      // Handle nested response structure from backend
      // Backend returns: { success: true, data: { ... } }
      // We want to return: { success: true, data: { ... } }
      const data = responseData.data || responseData;

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
    return this.makeRequest('/api/auth/login', {
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
    return this.makeRequest('/api/auth/register', {
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

  async demoLogin(): Promise<APIResponse<{ user: User; token: string }>> {
    // TEMPORARY BYPASS — replace demoLogin call for local development
    console.log('🧪 Firebase bypass mode — injecting mock user');
    
    // Mock user data for local development
    const mockUser: User = {
      id: 'dev-bypass-user',
      email: 'demo@bypass.local',
      firstName: 'Demo',
      lastName: 'User',
      displayName: 'Demo User',
      isPremium: false,
      isTestUser: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockToken = 'mock-token-for-local-development';

    return {
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
      error: undefined,
    };
  }

  // User profile methods
  async getUserProfile(): Promise<APIResponse<User>> {
    return this.makeRequest('/api/users/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<APIResponse<User>> {
    return this.makeRequest('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateUserPreferences(
    preferences: {
      marketingEmails?: boolean;
      aiNotifications?: boolean;
      smartReminders?: boolean;
      privacyConsent?: boolean;
    }
  ): Promise<APIResponse<User>> {
    return this.makeRequest('/api/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(preferences),
    });
  }

  async deleteUserAccount(): Promise<APIResponse<boolean>> {
    return this.makeRequest('/api/users/profile', {
      method: 'DELETE',
    });
  }

  // Thoughtmarks methods
  async getThoughtmarks(): Promise<APIResponse<Thoughtmark[]>> {
    // TEMPORARY BYPASS — return mock thoughtmarks for local development
    console.log('🧪 Bypassing getThoughtmarks API call — returning mock data');
    
    const mockThoughtmarks: Thoughtmark[] = [
      {
        id: 1,
        title: 'Welcome to Thoughtmarks',
        content: 'This is your first thoughtmark. Start capturing your ideas, tasks, and insights here.',
        binId: 1,
        userId: 1,
        tags: ['welcome', 'getting-started'],
        aiSummary: 'Introduction to the Thoughtmarks app',
        aiCategorySuggestions: ['introduction', 'tutorial'],
        isArchived: false,
        isPinned: true,
        isDeleted: false,
        isTask: false,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Sample Task',
        content: 'This is a sample task that demonstrates the task functionality.',
        binId: 1,
        userId: 1,
        tags: ['task', 'sample'],
        aiSummary: 'A demonstration task item',
        aiCategorySuggestions: ['task', 'demo'],
        isArchived: false,
        isPinned: false,
        isDeleted: false,
        isTask: true,
        isCompleted: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Ideas for Future Features',
        content: 'Voice recording, AI insights, smart categorization, and more advanced features.',
        binId: 2,
        userId: 1,
        tags: ['ideas', 'features', 'roadmap'],
        aiSummary: 'Feature ideas and roadmap planning',
        aiCategorySuggestions: ['planning', 'ideas'],
        isArchived: false,
        isPinned: false,
        isDeleted: false,
        isTask: false,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      success: true,
      data: mockThoughtmarks,
      error: undefined,
    };
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
    return this.makeRequest(`/api/thoughtmarks/search?query=${encodeURIComponent(query)}`);
  }

  // Bins methods
  async getBins(): Promise<APIResponse<Bin[]>> {
    // TEMPORARY BYPASS — return mock bins for local development
    console.log('🧪 Bypassing getBins API call — returning mock data');
    
    const mockBins: Bin[] = [
      {
        id: 1,
        name: 'General',
        description: 'Default bin for general thoughtmarks',
        userId: 1,
        color: '#3B82F6',
        icon: '📝',
        isDefault: true,
        isArchived: false,
        isDeleted: false,
        sortOrder: 1,
        thoughtmarkCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Ideas',
        description: 'Collection of ideas and concepts',
        userId: 1,
        color: '#10B981',
        icon: '💡',
        isDefault: false,
        isArchived: false,
        isDeleted: false,
        sortOrder: 2,
        thoughtmarkCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'Tasks',
        description: 'Action items and to-dos',
        userId: 1,
        color: '#F59E0B',
        icon: '✅',
        isDefault: false,
        isArchived: false,
        isDeleted: false,
        sortOrder: 3,
        thoughtmarkCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      success: true,
      data: mockBins,
      error: undefined,
    };
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

  // AI methods (for later)
  async generateInsights(thoughtmarkIds?: string[]): Promise<APIResponse<any>> {
    const response = await this.makeRequest('/api/ai/insights', {
      method: 'POST',
      body: JSON.stringify({ thoughtmarkIds }),
    });
    console.log('[apiService.generateInsights] Raw response:', response);
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  async smartSort(thoughtmarkIds?: string[]): Promise<APIResponse<any>> {
    const response = await this.makeRequest('/api/ai/smart-sort', {
      method: 'POST',
      body: JSON.stringify({ thoughtmarkIds }),
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  async recommendations(thoughtmarkIds?: string[]): Promise<APIResponse<any>> {
    const response = await this.makeRequest('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ thoughtmarkIds }),
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  async learningResources(thoughtmarkIds?: string[]): Promise<APIResponse<any>> {
    const response = await this.makeRequest('/api/ai/learning-resources', {
      method: 'POST',
      body: JSON.stringify({ thoughtmarkIds }),
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
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

  // Voice processing (for later)
  async uploadVoiceNote(formData: FormData): Promise<APIResponse<{ url: string; transcription: string }>> {
    const token = await AsyncStorage.getItem('@thoughtmarks_token');
    
    return this.makeRequest('/api/ai/process-voice', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  }

  async semanticSearch(query: string) {
    const response = await this.makeRequest('/api/ai/semantic-search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  async generateSearchSuggestions() {
    const response = await this.makeRequest('/api/ai/search-suggestions', {
      method: 'POST',
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  async generateThoughtmarkSuggestions(data: { content: string; title?: string; tags?: string[] }) {
    const response = await this.makeRequest('/api/ai/thoughtmark-suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  }

  // Premium/StoreKit methods
  async updatePremiumStatus(data: {
    productId: string;
    transactionId: string;
    purchaseDate: string;
    expirationDate?: string;
  }): Promise<APIResponse<User>> {
    return this.makeRequest('/api/users/premium', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();