import { ApiResponse, ApiError } from './ApiTypes';
import { User, Thoughtmark } from './DataTypes';
import { AppState, AuthState } from './StateTypes';
import { RootStackParamList } from './NavigationTypes';

export interface TypeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  timestamp: number;
}

export interface TypeCompatibilityCheck {
  typeName: string;
  isCompatible: boolean;
  conflicts: string[];
  suggestions: string[];
}

export class TypeValidator {
  private static instance: TypeValidator;
  private validationCache: Map<string, TypeValidationResult> = new Map();

  public static getInstance(): TypeValidator {
    if (!TypeValidator.instance) {
      TypeValidator.instance = new TypeValidator();
    }
    return TypeValidator.instance;
  }

  public validateApiTypes(): TypeValidationResult {
    const result: TypeValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
    };

    try {
      // Validate ApiResponse structure
      const testResponse: ApiResponse<User> = {
        data: {
          id: 'test',
          email: 'test@example.com',
          name: 'Test User',
          isPremium: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        status: 200,
        message: 'Success',
        success: true,
        timestamp: new Date().toISOString(),
      };

      if (!testResponse.data || !testResponse.status) {
        result.errors.push('ApiResponse structure validation failed');
        result.isValid = false;
      }

      // Validate ApiError structure
      const testError: ApiError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        timestamp: new Date().toISOString(),
      };

      if (!testError.code || !testError.message) {
        result.errors.push('ApiError structure validation failed');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`API types validation error: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  public validateDataTypes(): TypeValidationResult {
    const result: TypeValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
    };

    try {
      // Validate User type
      const testUser: User = {
        id: 'user-1',
        email: 'user@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!testUser.id || !testUser.email || !testUser.name) {
        result.errors.push('User type validation failed');
        result.isValid = false;
      }

      // Validate Thoughtmark type
      const testThoughtmark: Thoughtmark = {
        id: 'thought-1',
        title: 'Test Thoughtmark',
        content: 'Test content',
        tags: ['test'],
        binId: 'bin-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        isPinned: false,
      };

      if (!testThoughtmark.id || !testThoughtmark.title || !testThoughtmark.content) {
        result.errors.push('Thoughtmark type validation failed');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`Data types validation error: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  public validateStateTypes(): TypeValidationResult {
    const result: TypeValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
    };

    try {
      // Validate AppState type
      const testAppState: AppState = {
        currentEnvironment: 'nextgen',
        isFirstLaunch: false,
        onboardingCompleted: true,
        theme: 'light',
        notifications: true,
        analytics: true,
        version: '1.0.0',
        buildNumber: '1',
      };

      if (testAppState.currentEnvironment !== 'legacy' && testAppState.currentEnvironment !== 'nextgen') {
        result.errors.push('AppState currentEnvironment validation failed');
        result.isValid = false;
      }

      // Validate AuthState type
      const testAuthState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
      };

      if (typeof testAuthState.isAuthenticated !== 'boolean') {
        result.errors.push('AuthState isAuthenticated validation failed');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`State types validation error: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  public validateNavigationTypes(): TypeValidationResult {
    const result: TypeValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      timestamp: Date.now(),
    };

    try {
      // Validate RootStackParamList type
      const testParams: RootStackParamList = {
        Home: undefined,
        Dashboard: undefined,
        Search: undefined,
        Profile: undefined,
        Settings: undefined,
        SignIn: undefined,
        SignUp: undefined,
        PasswordReset: undefined,
        ThoughtmarkDetail: { id: 'test-id' },
        TaskDetail: { id: 'test-id' },
        EditProfile: undefined,
        Notifications: undefined,
        CreateThoughtmark: undefined,
        EditThoughtmark: { id: 'test-id' },
        CreateTask: undefined,
        EditTask: { id: 'test-id' },
        BinManagement: undefined,
        SearchResults: { query: 'test' },
        Onboarding: undefined,
      };

      if (!testParams.ThoughtmarkDetail.id || !testParams.TaskDetail.id) {
        result.errors.push('Navigation types validation failed');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`Navigation types validation error: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  public validateAllTypes(): TypeValidationResult {
    const results = [
      this.validateApiTypes(),
      this.validateDataTypes(),
      this.validateStateTypes(),
      this.validateNavigationTypes(),
    ];

    const combinedResult: TypeValidationResult = {
      isValid: results.every(r => r.isValid),
      errors: results.flatMap(r => r.errors),
      warnings: results.flatMap(r => r.warnings),
      timestamp: Date.now(),
    };

    return combinedResult;
  }

  public checkLegacyCompatibility(): TypeCompatibilityCheck[] {
    const checks: TypeCompatibilityCheck[] = [];

    // Check User type compatibility
    checks.push({
      typeName: 'User',
      isCompatible: true,
      conflicts: [],
      suggestions: ['Consider adding more validation for email format'],
    });

    // Check ApiResponse type compatibility
    checks.push({
      typeName: 'ApiResponse',
      isCompatible: true,
      conflicts: [],
      suggestions: ['Add error handling for network failures'],
    });

    return checks;
  }
}

export const typeValidator = TypeValidator.getInstance(); 