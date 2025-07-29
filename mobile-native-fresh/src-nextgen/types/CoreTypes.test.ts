import { typeValidator } from './TypeValidation';
import { isUser, isThoughtmark, isApiResponse, isAppState, isPerformanceMetrics, isValidationResult, isNavigationState, isTheme, isAccessibilityState } from './TypeGuards';

describe('CoreTypes', () => {
  describe('TypeValidation', () => {
    it('should validate basic types correctly', () => {
      expect(typeValidator.isString('test')).toBe(true);
      expect(typeValidator.isString(123)).toBe(false);
      
      expect(typeValidator.isNumber(123)).toBe(true);
      expect(typeValidator.isNumber('123')).toBe(false);
      
      expect(typeValidator.isBoolean(true)).toBe(true);
      expect(typeValidator.isBoolean('true')).toBe(false);
      
      expect(typeValidator.isObject({})).toBe(true);
      expect(typeValidator.isObject([])).toBe(false);
      
      expect(typeValidator.isArray([])).toBe(true);
      expect(typeValidator.isArray({})).toBe(false);
    });

    it('should validate complex types correctly', () => {
      expect(typeValidator.isEmail('test@example.com')).toBe(true);
      expect(typeValidator.isEmail('invalid-email')).toBe(false);
      
      expect(typeValidator.isURL('https://example.com')).toBe(true);
      expect(typeValidator.isURL('not-a-url')).toBe(false);
      
      expect(typeValidator.isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(typeValidator.isUUID('invalid-uuid')).toBe(false);
      
      expect(typeValidator.isDate(new Date())).toBe(true);
      expect(typeValidator.isDate('2023-01-01')).toBe(false);
      
      expect(typeValidator.isDateString('2023-01-01')).toBe(true);
      expect(typeValidator.isDateString('invalid-date')).toBe(false);
    });

    it('should validate arrays correctly', () => {
      expect(typeValidator.isStringArray(['a', 'b', 'c'])).toBe(true);
      expect(typeValidator.isStringArray([1, 2, 3])).toBe(false);
      
      expect(typeValidator.isNumberArray([1, 2, 3])).toBe(true);
      expect(typeValidator.isNumberArray(['a', 'b', 'c'])).toBe(false);
      
      expect(typeValidator.isObjectArray([{}, { a: 1 }])).toBe(true);
      expect(typeValidator.isObjectArray([1, 2, 3])).toBe(false);
    });

    it('should validate objects correctly', () => {
      const obj = { name: 'test', age: 25 };
      
      expect(typeValidator.hasRequiredKeys(obj, ['name', 'age'])).toBe(true);
      expect(typeValidator.hasRequiredKeys(obj, ['name', 'age', 'missing'])).toBe(false);
      
      expect(typeValidator.hasOptionalKeys(obj, ['name'])).toBe(true);
      expect(typeValidator.hasOptionalKeys(obj, ['missing'])).toBe(false);
    });

    it('should provide detailed validation results', () => {
      const stringResult = typeValidator.validateString('test', { minLength: 3, maxLength: 10 });
      expect(stringResult.isValid).toBe(true);
      expect(stringResult.errors).toHaveLength(0);
      
      const invalidStringResult = typeValidator.validateString('ab', { minLength: 3 });
      expect(invalidStringResult.isValid).toBe(false);
      expect(invalidStringResult.errors).toHaveLength(1);
      
      const numberResult = typeValidator.validateNumber(5, { min: 1, max: 10 });
      expect(numberResult.isValid).toBe(true);
      expect(numberResult.errors).toHaveLength(0);
      
      const invalidNumberResult = typeValidator.validateNumber(15, { max: 10 });
      expect(invalidNumberResult.isValid).toBe(false);
      expect(invalidNumberResult.errors).toHaveLength(1);
    });

    it('should validate API types', () => {
      const result = typeValidator.validateApiTypes();
      expect(result.isValid).toBe(true);
    });

    it('should validate data types', () => {
      const result = typeValidator.validateDataTypes();
      expect(result.isValid).toBe(true);
    });

    it('should validate state types', () => {
      const result = typeValidator.validateStateTypes();
      expect(result.isValid).toBe(true);
    });

    it('should validate navigation types', () => {
      const result = typeValidator.validateNavigationTypes();
      expect(result.isValid).toBe(true);
    });

    it('should validate all types', () => {
      const result = typeValidator.validateAllTypes();
      expect(result.isValid).toBe(true);
    });

    it('should check legacy compatibility', () => {
      const checks = typeValidator.checkLegacyCompatibility();
      expect(Array.isArray(checks)).toBe(true);
      expect(checks.length).toBeGreaterThan(0);
      
      checks.forEach(check => {
        expect(check).toHaveProperty('type');
        expect(check).toHaveProperty('isCompatible');
        expect(check).toHaveProperty('issues');
        expect(check).toHaveProperty('suggestions');
      });
    });
  });

  describe('TypeGuards', () => {
    it('should validate User type', () => {
      const validUser = { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 };
      const invalidUser = { id: '1', name: 'John Doe' }; // missing email and age
      
      expect(isUser(validUser)).toBe(true);
      expect(isUser(invalidUser)).toBe(false);
      expect(isUser(null)).toBe(false);
      expect(isUser(undefined)).toBe(false);
    });

    it('should validate Thoughtmark type', () => {
      const validThoughtmark = {
        id: '1',
        title: 'Test Thoughtmark',
        content: 'This is a test thoughtmark',
        userId: 'user1',
        createdAt: '2023-01-01T00:00:00Z',
      };
      const invalidThoughtmark = { id: '1', title: 'Test' }; // missing required fields
      
      expect(isThoughtmark(validThoughtmark)).toBe(true);
      expect(isThoughtmark(invalidThoughtmark)).toBe(false);
      expect(isThoughtmark(null)).toBe(false);
    });

    it('should validate ApiResponse type', () => {
      const validApiResponse = {
        data: { result: 'success' },
        status: 200,
        message: 'OK',
      };
      const invalidApiResponse = { data: 'invalid' }; // missing required fields
      
      expect(isApiResponse(validApiResponse)).toBe(true);
      expect(isApiResponse(invalidApiResponse)).toBe(false);
      expect(isApiResponse(null)).toBe(false);
    });

    it('should validate AppState type', () => {
      const validAppState = {
        theme: 'light',
        environment: 'production',
        isInitialized: true,
        lastUpdated: '2023-01-01T00:00:00Z',
      };
      const invalidAppState = { theme: 'light' }; // missing required fields
      
      expect(isAppState(validAppState)).toBe(true);
      expect(isAppState(invalidAppState)).toBe(false);
      expect(isAppState(null)).toBe(false);
    });

    it('should validate PerformanceMetrics type', () => {
      const validMetrics = {
        componentRenderTime: 100,
        apiCallTime: 200,
        memoryUsage: 50,
        timestamp: Date.now(),
      };
      const invalidMetrics = { componentRenderTime: 'invalid' }; // wrong type
      
      expect(isPerformanceMetrics(validMetrics)).toBe(true);
      expect(isPerformanceMetrics(invalidMetrics)).toBe(false);
      expect(isPerformanceMetrics(null)).toBe(false);
    });

    it('should validate ValidationResult type', () => {
      const validResult = {
        isValid: true,
        errors: [],
        warnings: [],
      };
      const invalidResult = { isValid: true }; // missing required fields
      
      expect(isValidationResult(validResult)).toBe(true);
      expect(isValidationResult(invalidResult)).toBe(false);
      expect(isValidationResult(null)).toBe(false);
    });

    it('should validate NavigationState type', () => {
      const validNavigationState = {
        currentRoute: 'Home',
        params: {},
        history: ['Home'],
        isNavigating: false,
        lastNavigationTime: Date.now(),
      };
      const invalidNavigationState = { currentRoute: 'Home' }; // missing required fields
      
      expect(isNavigationState(validNavigationState)).toBe(true);
      expect(isNavigationState(invalidNavigationState)).toBe(false);
      expect(isNavigationState(null)).toBe(false);
    });

    it('should validate Theme type', () => {
      const validTheme = {
        id: 'light',
        name: 'Light Theme',
        mode: 'light',
        variant: 'default',
        colors: {
          primary: '#007AFF',
          secondary: '#5856D6',
          background: '#FFFFFF',
          surface: '#F2F2F7',
          text: '#000000',
          textSecondary: '#8E8E93',
          border: '#C6C6C8',
          error: '#FF3B30',
          warning: '#FF9500',
          success: '#34C759',
          info: '#007AFF',
        },
        spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
        typography: {
          fontFamily: 'System',
          fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
          fontWeight: { light: '300', normal: '400', medium: '500', bold: '700' },
          lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.8 },
        },
        borderRadius: 8,
        shadow: {
          small: '0 1px 3px rgba(0,0,0,0.12)',
          medium: '0 4px 6px rgba(0,0,0,0.1)',
          large: '0 10px 15px rgba(0,0,0,0.1)',
        },
        animation: {
          duration: { fast: 150, normal: 300, slow: 500 },
          easing: { ease: 'ease', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out' },
        },
      };
      const invalidTheme = { id: 'light' }; // missing required fields
      
      expect(isTheme(validTheme)).toBe(true);
      expect(isTheme(invalidTheme)).toBe(false);
      expect(isTheme(null)).toBe(false);
    });

    it('should validate AccessibilityState type', () => {
      const validAccessibilityState = {
        isScreenReaderEnabled: true,
        isReduceMotionEnabled: false,
        isReduceTransparencyEnabled: false,
        isInvertColorsEnabled: false,
        isBoldTextEnabled: false,
        isGrayscaleEnabled: false,
        isHighContrastEnabled: false,
        isLargeTextEnabled: false,
        isVoiceOverEnabled: true,
        isTalkBackEnabled: false,
        fontSize: 'normal',
        contrast: 'normal',
        lastUpdated: Date.now(),
      };
      const invalidAccessibilityState = { isScreenReaderEnabled: true }; // missing required fields
      
      expect(isAccessibilityState(validAccessibilityState)).toBe(true);
      expect(isAccessibilityState(invalidAccessibilityState)).toBe(false);
      expect(isAccessibilityState(null)).toBe(false);
    });
  });
}); 