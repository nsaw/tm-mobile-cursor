import { typeValidator } from './TypeValidation';
import { isUser, isThoughtmark, isBin, isTask, isApiResponse, isApiError, isAppState, isAuthState, isUIState } from './TypeGuards';
import { User, Thoughtmark, Bin, Task } from './DataTypes';
import { ApiResponse, ApiError } from './ApiTypes';
import { AppState, AuthState, UIState } from './StateTypes';

export interface TypeTestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export interface TypeTestSuite {
  name: string;
  results: TypeTestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

export class TypeTester {
  private static instance: TypeTester;
  private testResults: TypeTestResult[] = [];

  public static getInstance(): TypeTester {
    if (!TypeTester.instance) {
      TypeTester.instance = new TypeTester();
    }
    return TypeTester.instance;
  }

  public runTypeGuardTests(): TypeTestSuite {
    const startTime = Date.now();
    const results: TypeTestResult[] = [];

    // Test User type guard
    results.push(this.testTypeGuard('isUser', () => {
      const validUser: User = {
        id: 'test',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return isUser(validUser) && !isUser({ invalid: 'data' });
    }));

    // Test Thoughtmark type guard
    results.push(this.testTypeGuard('isThoughtmark', () => {
      const validThoughtmark: Thoughtmark = {
        id: 'test',
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
        tags: ['test'],
        binId: 'bin-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        isPinned: false,
        isPublic: true,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      return isThoughtmark(validThoughtmark) && !isThoughtmark({ invalid: 'data' });
    }));

    // Test Bin type guard
    results.push(this.testTypeGuard('isBin', () => {
      const validBin: Bin = {
        id: 'test',
        name: 'Test Bin',
        color: '#FF0000',
        thoughtmarkCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false,
        sortOrder: 0,
      };
      return isBin(validBin) && !isBin({ invalid: 'data' });
    }));

    // Test Task type guard
    results.push(this.testTypeGuard('isTask', () => {
      const validTask: Task = {
        id: 'test',
        title: 'Test Task',
        isCompleted: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return isTask(validTask) && !isTask({ invalid: 'data' });
    }));

    // Test ApiResponse type guard
    results.push(this.testTypeGuard('isApiResponse', () => {
      const validResponse: ApiResponse<User> = {
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
      return isApiResponse(validResponse) && !isApiResponse({ invalid: 'data' });
    }));

    // Test ApiError type guard
    results.push(this.testTypeGuard('isApiError', () => {
      const validError: ApiError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        timestamp: new Date().toISOString(),
      };
      return isApiError(validError) && !isApiError({ invalid: 'data' });
    }));

    // Test AppState type guard
    results.push(this.testTypeGuard('isAppState', () => {
      const validAppState: AppState = {
        currentEnvironment: 'nextgen',
        isFirstLaunch: false,
        onboardingCompleted: true,
        theme: 'light',
        notifications: true,
        analytics: true,
        version: '1.0.0',
        buildNumber: '1',
      };
      return isAppState(validAppState) && !isAppState({ invalid: 'data' });
    }));

    // Test AuthState type guard
    results.push(this.testTypeGuard('isAuthState', () => {
      const validAuthState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
      };
      return isAuthState(validAuthState) && !isAuthState({ invalid: 'data' });
    }));

    // Test UIState type guard
    results.push(this.testTypeGuard('isUIState', () => {
      const validUIState: UIState = {
        isLoading: false,
        error: null,
        modal: {
          isVisible: false,
          type: null,
          data: null,
        },
        sidebar: {
          isOpen: false,
        },
        search: {
          query: '',
          isActive: false,
          results: [],
          filters: {
            bins: [],
            tags: [],
            dateRange: { start: null, end: null },
            sortBy: 'created',
            sortOrder: 'desc',
          },
        },
        toast: {
          isVisible: false,
          message: '',
          type: 'info',
          duration: 3000,
        },
      };
      return isUIState(validUIState) && !isUIState({ invalid: 'data' });
    }));

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;

    return {
      name: 'Type Guard Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration,
    };
  }

  public runValidationTests(): TypeTestSuite {
    const startTime = Date.now();
    const results: TypeTestResult[] = [];

    // Test API types validation
    results.push(this.testValidation('API Types Validation', () => {
      const validation = typeValidator.validateApiTypes();
      return validation.isValid;
    }));

    // Test Data types validation
    results.push(this.testValidation('Data Types Validation', () => {
      const validation = typeValidator.validateDataTypes();
      return validation.isValid;
    }));

    // Test State types validation
    results.push(this.testValidation('State Types Validation', () => {
      const validation = typeValidator.validateStateTypes();
      return validation.isValid;
    }));

    // Test Navigation types validation
    results.push(this.testValidation('Navigation Types Validation', () => {
      const validation = typeValidator.validateNavigationTypes();
      return validation.isValid;
    }));

    // Test All types validation
    results.push(this.testValidation('All Types Validation', () => {
      const validation = typeValidator.validateAllTypes();
      return validation.isValid;
    }));

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;

    return {
      name: 'Type Validation Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration,
    };
  }

  public runCompatibilityTests(): TypeTestSuite {
    const startTime = Date.now();
    const results: TypeTestResult[] = [];

    // Test legacy compatibility
    results.push(this.testCompatibility('Legacy Compatibility Check', () => {
      const checks = typeValidator.checkLegacyCompatibility();
      return checks.every(check => check.isCompatible);
    }));

    const duration = Date.now() - startTime;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = results.filter(r => !r.passed).length;

    return {
      name: 'Type Compatibility Tests',
      results,
      totalTests: results.length,
      passedTests,
      failedTests,
      duration,
    };
  }

  public runAllTests(): TypeTestSuite[] {
    return [
      this.runTypeGuardTests(),
      this.runValidationTests(),
      this.runCompatibilityTests(),
    ];
  }

  private testTypeGuard(testName: string, testFn: () => boolean): TypeTestResult {
    const startTime = Date.now();
    try {
      const passed = testFn();
      const duration = Date.now() - startTime;
      return {
        testName,
        passed,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      };
    }
  }

  private testValidation(testName: string, testFn: () => boolean): TypeTestResult {
    const startTime = Date.now();
    try {
      const passed = testFn();
      const duration = Date.now() - startTime;
      return {
        testName,
        passed,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      };
    }
  }

  private testCompatibility(testName: string, testFn: () => boolean): TypeTestResult {
    const startTime = Date.now();
    try {
      const passed = testFn();
      const duration = Date.now() - startTime;
      return {
        testName,
        passed,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
      };
    }
  }

  public getTestResults(): TypeTestResult[] {
    return [...this.testResults];
  }

  public clearTestResults(): void {
    this.testResults = [];
  }
}

export const typeTester = TypeTester.getInstance(); 