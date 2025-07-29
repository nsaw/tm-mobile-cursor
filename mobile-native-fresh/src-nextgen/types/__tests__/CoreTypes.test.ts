import { typeValidator } from '../TypeValidation';
import { typeTester } from '../TypeTesting';
import { isUser, isThoughtmark, isBin, isTask, isApiResponse, isApiError, isAppState, isAuthState, isUIState } from '../TypeGuards';
import { User, Thoughtmark, Bin, Task } from '../DataTypes';
import { ApiResponse, ApiError } from '../ApiTypes';
import { AppState, AuthState, UIState } from '../StateTypes';

describe('Core Types Validation', () => {
  describe('Type Validator', () => {
    it('should validate API types successfully', () => {
      const result = typeValidator.validateApiTypes();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate Data types successfully', () => {
      const result = typeValidator.validateDataTypes();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate State types successfully', () => {
      const result = typeValidator.validateStateTypes();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate Navigation types successfully', () => {
      const result = typeValidator.validateNavigationTypes();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate all types successfully', () => {
      const result = typeValidator.validateAllTypes();
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should check legacy compatibility', () => {
      const checks = typeValidator.checkLegacyCompatibility();
      expect(checks).toBeDefined();
      expect(checks.length).toBeGreaterThan(0);
      checks.forEach(check => {
        expect(check.typeName).toBeDefined();
        expect(typeof check.isCompatible).toBe('boolean');
      });
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify valid User objects', () => {
      const validUser: User = {
        id: 'test',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(isUser(validUser)).toBe(true);
      expect(isUser({ invalid: 'data' })).toBe(false);
      expect(isUser(null)).toBe(false);
      expect(isUser(undefined)).toBe(false);
    });

    it('should correctly identify valid Thoughtmark objects', () => {
      const validThoughtmark: Thoughtmark = {
        id: 'test',
        title: 'Test Title',
        content: 'Test Content',
        tags: ['test'],
        binId: 'bin-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
        isPinned: false,
      };

      expect(isThoughtmark(validThoughtmark)).toBe(true);
      expect(isThoughtmark({ invalid: 'data' })).toBe(false);
      expect(isThoughtmark(null)).toBe(false);
    });

    it('should correctly identify valid Bin objects', () => {
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

      expect(isBin(validBin)).toBe(true);
      expect(isBin({ invalid: 'data' })).toBe(false);
      expect(isBin(null)).toBe(false);
    });

    it('should correctly identify valid Task objects', () => {
      const validTask: Task = {
        id: 'test',
        title: 'Test Task',
        isCompleted: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(isTask(validTask)).toBe(true);
      expect(isTask({ invalid: 'data' })).toBe(false);
      expect(isTask(null)).toBe(false);
    });

    it('should correctly identify valid ApiResponse objects', () => {
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

      expect(isApiResponse(validResponse)).toBe(true);
      expect(isApiResponse({ invalid: 'data' })).toBe(false);
      expect(isApiResponse(null)).toBe(false);
    });

    it('should correctly identify valid ApiError objects', () => {
      const validError: ApiError = {
        code: 'TEST_ERROR',
        message: 'Test error message',
        timestamp: new Date().toISOString(),
      };

      expect(isApiError(validError)).toBe(true);
      expect(isApiError({ invalid: 'data' })).toBe(false);
      expect(isApiError(null)).toBe(false);
    });

    it('should correctly identify valid AppState objects', () => {
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

      expect(isAppState(validAppState)).toBe(true);
      expect(isAppState({ invalid: 'data' })).toBe(false);
      expect(isAppState(null)).toBe(false);
    });

    it('should correctly identify valid AuthState objects', () => {
      const validAuthState: AuthState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
      };

      expect(isAuthState(validAuthState)).toBe(true);
      expect(isAuthState({ invalid: 'data' })).toBe(false);
      expect(isAuthState(null)).toBe(false);
    });

    it('should correctly identify valid UIState objects', () => {
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

      expect(isUIState(validUIState)).toBe(true);
      expect(isUIState({ invalid: 'data' })).toBe(false);
      expect(isUIState(null)).toBe(false);
    });
  });

  describe('Type Tester', () => {
    it('should run type guard tests successfully', () => {
      const suite = typeTester.runTypeGuardTests();
      expect(suite.name).toBe('Type Guard Tests');
      expect(suite.totalTests).toBeGreaterThan(0);
      expect(suite.passedTests).toBe(suite.totalTests);
      expect(suite.failedTests).toBe(0);
      expect(suite.duration).toBeGreaterThan(0);
    });

    it('should run validation tests successfully', () => {
      const suite = typeTester.runValidationTests();
      expect(suite.name).toBe('Type Validation Tests');
      expect(suite.totalTests).toBeGreaterThan(0);
      expect(suite.passedTests).toBe(suite.totalTests);
      expect(suite.failedTests).toBe(0);
      expect(suite.duration).toBeGreaterThan(0);
    });

    it('should run compatibility tests successfully', () => {
      const suite = typeTester.runCompatibilityTests();
      expect(suite.name).toBe('Type Compatibility Tests');
      expect(suite.totalTests).toBeGreaterThan(0);
      expect(suite.passedTests).toBe(suite.totalTests);
      expect(suite.failedTests).toBe(0);
      expect(suite.duration).toBeGreaterThan(0);
    });

    it('should run all tests successfully', () => {
      const suites = typeTester.runAllTests();
      expect(suites.length).toBe(3);
      
      suites.forEach(suite => {
        expect(suite.totalTests).toBeGreaterThan(0);
        expect(suite.passedTests).toBe(suite.totalTests);
        expect(suite.failedTests).toBe(0);
        expect(suite.duration).toBeGreaterThan(0);
      });
    });
  });

  describe('Type Compatibility', () => {
    it('should maintain compatibility with legacy system', () => {
      const checks = typeValidator.checkLegacyCompatibility();
      const allCompatible = checks.every(check => check.isCompatible);
      expect(allCompatible).toBe(true);
    });

    it('should provide meaningful suggestions for improvements', () => {
      const checks = typeValidator.checkLegacyCompatibility();
      checks.forEach(check => {
        expect(check.suggestions).toBeDefined();
        expect(Array.isArray(check.suggestions)).toBe(true);
      });
    });
  });

  describe('Runtime Validation', () => {
    it('should handle edge cases gracefully', () => {
      // Test with null values
      expect(isUser(null)).toBe(false);
      expect(isThoughtmark(null)).toBe(false);
      expect(isBin(null)).toBe(false);
      expect(isTask(null)).toBe(false);
      expect(isApiResponse(null)).toBe(false);
      expect(isApiError(null)).toBe(false);
      expect(isAppState(null)).toBe(false);
      expect(isAuthState(null)).toBe(false);
      expect(isUIState(null)).toBe(false);

      // Test with undefined values
      expect(isUser(undefined)).toBe(false);
      expect(isThoughtmark(undefined)).toBe(false);
      expect(isBin(undefined)).toBe(false);
      expect(isTask(undefined)).toBe(false);
      expect(isApiResponse(undefined)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isAppState(undefined)).toBe(false);
      expect(isAuthState(undefined)).toBe(false);
      expect(isUIState(undefined));

      // Test with primitive values
      expect(isUser('string')).toBe(false);
      expect(isThoughtmark(123)).toBe(false);
      expect(isBin(true)).toBe(false);
      expect(isTask([])).toBe(false);
    });

    it('should validate complex nested structures', () => {
      const complexUser: User = {
        id: 'test',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          analytics: true,
          language: 'en',
          timezone: 'UTC',
        },
      };

      expect(isUser(complexUser)).toBe(true);
    });

    it('should handle partial objects correctly', () => {
      const partialUser = {
        id: 'test',
        email: 'test@example.com',
        // Missing required fields
      };

      expect(isUser(partialUser)).toBe(false);
    });
  });
}); 