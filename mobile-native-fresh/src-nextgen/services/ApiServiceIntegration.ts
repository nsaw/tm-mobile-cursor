import { authService } from './authService';
import { userService } from './userService';
import { emailService } from './emailService';
import { errorService } from './errorService';
import { analyticsService } from './analyticsService';
import { securityService } from './securityService';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  isTestUser?: boolean;
  preferences?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Unified API Response Interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Sign up data interface
export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

// User profile updates interface
export interface UserProfileUpdates {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

// API Service Integration Class
export class ApiServiceIntegration {
  private static instance: ApiServiceIntegration;
  private isInitialized = false;

  // Singleton pattern
  public static getInstance(): ApiServiceIntegration {
    if (!ApiServiceIntegration.instance) {
      ApiServiceIntegration.instance = new ApiServiceIntegration();
    }
    return ApiServiceIntegration.instance;
  }

  // Initialize all services
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ API Service Integration already initialized');
      return;
    }

    try {
      await Promise.all([
        authService.initialize(),
        userService.initialize(),
        emailService.initialize(),
        errorService.initialize(),
        analyticsService.initialize(),
        securityService.initialize(),
      ]);

      this.isInitialized = true;
      console.log('✅ API Service Integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize API Service Integration:', error);
      throw error;
    }
  }

  // Authentication Methods
  public async signIn(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await authService.signIn(credentials);
      return {
        success: true,
        data: {
          user: {
            ...response.user,
            isPremium: false, // Default value for now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: response.token,
        },
        message: 'Sign in successful',
      };
    } catch (error) {
      return this.handleError('Sign in failed', error);
    }
  }

  public async signUp(data: SignUpData): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await authService.signUp(data);
      return {
        success: true,
        data: {
          user: {
            ...response.user,
            isPremium: false, // Default value for now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: response.token,
        },
        message: 'Sign up successful',
      };
    } catch (error) {
      return this.handleError('Sign up failed', error);
    }
  }

  public async signOut(): Promise<ApiResponse> {
    try {
      await authService.signOut();
      return {
        success: true,
        message: 'Sign out successful',
      };
    } catch (error) {
      return this.handleError('Sign out failed', error);
    }
  }

  public async resetPassword(email: string): Promise<ApiResponse> {
    try {
      await authService.resetPassword(email);
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      return this.handleError('Password reset failed', error);
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    try {
      const user = await userService.getCurrentUser();
      return {
        success: true,
        data: {
          user: {
            ...user,
            isPremium: false, // Default value for now
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString(),
          },
        },
        message: 'Current user retrieved successfully',
      };
    } catch (error) {
      return this.handleError('Failed to get current user', error);
    }
  }

  public async updateUserProfile(updates: UserProfileUpdates): Promise<ApiResponse<User>> {
    try {
      const user = await userService.updateProfile(updates);
      return {
        success: true,
        data: {
          ...user,
          isPremium: false, // Default value for now
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return this.handleError('Profile update failed', error);
    }
  }

  public async deleteUserAccount(): Promise<ApiResponse> {
    try {
      await userService.deleteAccount();
      return {
        success: true,
        message: 'Account deleted successfully',
      };
    } catch (error) {
      return this.handleError('Account deletion failed', error);
    }
  }

  // Email Methods
  public async sendVerificationEmail(email: string): Promise<ApiResponse> {
    try {
      await emailService.sendVerificationEmail(email);
      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error) {
      return this.handleError('Failed to send verification email', error);
    }
  }

  public async sendPasswordResetEmail(email: string): Promise<ApiResponse> {
    try {
      await emailService.sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      return this.handleError('Failed to send password reset email', error);
    }
  }

  // Analytics Methods
  public async trackEvent(eventName: string, properties?: Record<string, unknown>): Promise<ApiResponse> {
    try {
      await analyticsService.trackEvent({ 
        name: eventName, 
        properties: properties as Record<string, string | number | boolean> | undefined 
      });
      return {
        success: true,
        message: 'Event tracked successfully',
      };
    } catch (error) {
      return this.handleError('Failed to track event', error);
    }
  }

  public async setUserProperties(properties: Record<string, unknown>): Promise<ApiResponse> {
    try {
      await analyticsService.setUserProperties(properties as Record<string, string | number | boolean>);
      return {
        success: true,
        message: 'User properties set successfully',
      };
    } catch (error) {
      return this.handleError('Failed to set user properties', error);
    }
  }

  // Security Methods
  public async validateToken(token: string): Promise<ApiResponse<{ isValid: boolean }>> {
    try {
      const isValid = await securityService.validateToken(token);
      return {
        success: true,
        data: { isValid },
        message: 'Token validation completed',
      };
    } catch (error) {
      return this.handleError('Token validation failed', error);
    }
  }

  public async encryptData(data: string): Promise<ApiResponse<{ encrypted: string }>> {
    try {
      const encrypted = await securityService.encryptData(data);
      return {
        success: true,
        data: { encrypted },
        message: 'Data encrypted successfully',
      };
    } catch (error) {
      return this.handleError('Data encryption failed', error);
    }
  }

  public async decryptData(encryptedData: string): Promise<ApiResponse<{ decrypted: string }>> {
    try {
      const decrypted = await securityService.decryptData(encryptedData);
      return {
        success: true,
        data: { decrypted },
        message: 'Data decrypted successfully',
      };
    } catch (error) {
      return this.handleError('Data decryption failed', error);
    }
  }

  // Error Handling
  public handleError<T = unknown>(message: string, error: unknown): ApiResponse<T> {
    console.error(`❌ ${message}:`, error);
    
    // Log error to error service
    errorService.logError(error as Error, {
      context: 'ApiServiceIntegration',
      message,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: message,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      statusCode: 500,
    };
  }

  // Health Check
  public async healthCheck(): Promise<ApiResponse<{
    auth: boolean;
    analytics: boolean;
    security: boolean;
  }>> {
    try {
      const checks = await Promise.allSettled([
        authService.getCurrentUser(),
        analyticsService.trackEvent({ name: 'health_check' }),
        securityService.validateToken('test'),
      ]);

      const allHealthy = checks.every(result => result.status === 'fulfilled');
      
      return {
        success: allHealthy,
        data: {
          auth: checks[0].status === 'fulfilled',
          analytics: checks[1].status === 'fulfilled',
          security: checks[2].status === 'fulfilled',
        },
        message: allHealthy ? 'All services healthy' : 'Some services unhealthy',
      };
    } catch (error) {
      return this.handleError('Health check failed', error);
    }
  }

  // Cleanup
  public async cleanup(): Promise<void> {
    try {
      await Promise.all([
        errorService.cleanup(),
        analyticsService.cleanup(),
        securityService.cleanup(),
      ]);
      this.isInitialized = false;
      console.log('✅ API Service Integration cleaned up successfully');
    } catch (error) {
      console.error('❌ Failed to cleanup API Service Integration:', error);
    }
  }
}

// Export singleton instance
export const apiServiceIntegration = ApiServiceIntegration.getInstance();

// Export for convenience
export default apiServiceIntegration; 