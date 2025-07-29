import { User } from '../../types/DataTypes';
import { ApiResponse } from '../../types/ApiTypes';

import { ApiClient } from './ApiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  password: string;
}

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success) {
      this.apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.apiClient.post<AuthResponse>('/auth/register', data);
    if (response.success) {
      this.apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.apiClient.post<void>('/auth/logout');
    } finally {
      this.apiClient.removeAuthToken();
    }
    return {
      data: undefined,
      status: 200,
      message: 'Logged out successfully',
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    if (response.success) {
      this.apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>('/auth/password-reset', data);
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>('/auth/password-reset/confirm', data);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.apiClient.get<User>('/auth/me');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.apiClient.put<User>('/auth/profile', updates);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return this.apiClient.post<void>('/auth/change-password', data);
  }
} 