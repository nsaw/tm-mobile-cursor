export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthService {
  initialize: () => Promise<void>;
  signIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getCurrentUser: () => Promise<AuthResponse['user'] | null>;
}

class AuthServiceImpl implements AuthService {
  private baseUrl = 'https://api.thoughtmarks.app'; // Replace with actual API URL
  private token: string | null = null;

  async initialize(): Promise<void> {
    // TODO: Implement actual auth service initialization
    console.log('AuthService initialized');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Auth service request failed:', error);
      throw error;
    }
  }

  async signIn(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<AuthResponse>('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      this.token = response.token;
      return response;
    } catch (error) {
      // For development, provide mock response if API is not available
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('API not available, using mock response for development');
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-123',
            name: credentials.email.split('@')[0],
            email: credentials.email,
          },
        };
        this.token = mockResponse.token;
        return mockResponse;
      }
      throw error;
    }
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      this.token = response.token;
      return response;
    } catch (error) {
      // For development, provide mock response if API is not available
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('API not available, using mock response for development');
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-' + Date.now(),
            name: data.name,
            email: data.email,
          },
        };
        this.token = mockResponse.token;
        return mockResponse;
      }
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.makeRequest('/auth/signout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Sign out request failed:', error);
    } finally {
      this.token = null;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.makeRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      // For development, just log the request
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('Password reset requested for:', email);
        return;
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    if (!this.token) {
      return null;
    }

    try {
      const user = await this.makeRequest<AuthResponse['user']>('/auth/me');
      return user;
    } catch (error) {
      // For development, return mock user if API is not available
      if (error instanceof Error && error.message.includes('fetch')) {
        console.warn('API not available, returning mock user for development');
        return {
          id: 'user-123',
          name: 'Mock User',
          email: 'mock@example.com',
        };
      }
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthServiceImpl(); 