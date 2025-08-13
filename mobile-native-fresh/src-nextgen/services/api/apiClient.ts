import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../../state/store';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.thoughtmarks.app';
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@thoughtmarks_auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async handleUnauthorized() {
    try {
      await AsyncStorage.removeItem('@thoughtmarks_auth_token');
      useAppStore.getState().logout();
    } catch (error) {
      console.error('Error handling unauthorized:', error);
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export const apiClient = new ApiClient();
