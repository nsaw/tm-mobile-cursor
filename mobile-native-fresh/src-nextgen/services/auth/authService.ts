import { apiClient } from '../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  premium: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

class AuthService {
  private readonly baseUrl = '/auth';

  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/login`, request);
      const authData = response.data;
      await this.storeAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/register`, request);
      const authData = response.data;
      await this.storeAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('@thoughtmarks_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(`${this.baseUrl}/refresh`, {
        refreshToken,
      });
      const authData = response.data;
      await this.storeAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearAuthData();
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.setItem('@thoughtmarks_auth_token', authData.token);
      await AsyncStorage.setItem('@thoughtmarks_refresh_token', authData.refreshToken);
      await AsyncStorage.setItem('@thoughtmarks_user', JSON.stringify(authData.user));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        '@thoughtmarks_auth_token',
        '@thoughtmarks_refresh_token',
        '@thoughtmarks_user',
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export const authService = new AuthService();
