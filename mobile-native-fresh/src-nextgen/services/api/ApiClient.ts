import { ApiResponse, ApiError, ApiRequestConfig, ApiClient as IApiClient } from '../../types/ApiTypes';

export class ApiClient implements IApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private retryCount: number;
  private retryDelay: number;

  constructor(config: {
    baseURL: string;
    timeout?: number;
    retryCount?: number;
    retryDelay?: number;
    defaultHeaders?: Record<string, string>;
  }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.retryCount = config.retryCount || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
  }

  private async makeRequest<T>(
    config: ApiRequestConfig,
    attempt = 0
  ): Promise<ApiResponse<T>> {
    try {
      const url = config.url.startsWith('http') ? config.url : `${this.baseURL}${config.url}`;

      const headers = {
        ...this.defaultHeaders,
        ...config.headers,
      };

      const requestConfig: RequestInit = {
        method: config.method,
        headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        data,
        status: response.status,
        message: 'Success',
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (attempt < this.retryCount && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * Math.pow(2, attempt));
        return this.makeRequest<T>(config, attempt + 1);
      }

      throw this.createApiError(error);
    }
  }

  private shouldRetry(error: any): boolean {
    if (error.name === 'AbortError') return false;
    
    // Check for 5xx errors in the error message
    const errorMessage = error.message?.toLowerCase() || '';
    if (errorMessage.includes('http 5')) return true;
    if (errorMessage.includes('500')) return true;
    if (errorMessage.includes('501')) return true;
    if (errorMessage.includes('502')) return true;
    if (errorMessage.includes('503')) return true;
    if (errorMessage.includes('504')) return true;
    if (errorMessage.includes('505')) return true;
    if (errorMessage.includes('internal server error')) return true;
    if (errorMessage.includes('server error')) return true;
    
    // Check for 429 rate limiting errors
    if (errorMessage.includes('http 429')) return true;
    if (errorMessage.includes('429')) return true;
    if (errorMessage.includes('rate limit')) return true;
    
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createApiError(error: any): ApiError {
    return {
      code: error.code || 'API_ERROR',
      message: error.message || 'Unknown error occurred',
      details: error.details || error,
      timestamp: new Date().toISOString(),
    };
  }

  async request<T>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(config);
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.makeRequest<T>({
      method: 'GET',
      url: `${url}${queryString}`,
    });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'POST',
      url,
      data,
    });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'DELETE',
      url,
    });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: 'PATCH',
      url,
      data,
    });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }
} 