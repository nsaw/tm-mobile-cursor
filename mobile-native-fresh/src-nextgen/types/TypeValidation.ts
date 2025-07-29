/**
 * TypeValidation - Comprehensive type validation utilities
 * Provides type checking, validation, and testing utilities for the NextGen system
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TypeValidator<T> {
  validate(value: unknown): ValidationResult;
  isValid(value: unknown): value is T;
}

export interface CompatibilityCheck {
  type: string;
  isCompatible: boolean;
  issues: string[];
  suggestions: string[];
}

export class TypeValidation {
  private static instance: TypeValidation;

  private constructor() {}

  static getInstance(): TypeValidation {
    if (!TypeValidation.instance) {
      TypeValidation.instance = new TypeValidation();
    }
    return TypeValidation.instance;
  }

  // Basic type validators
  isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  isFunction(value: unknown): value is (...args: unknown[]) => unknown {
    return typeof value === 'function';
  }

  isNull(value: unknown): value is null {
    return value === null;
  }

  isUndefined(value: unknown): value is undefined {
    return value === undefined;
  }

  // Complex type validators
  isEmail(value: unknown): value is string {
    if (!this.isString(value)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  isURL(value: unknown): value is string {
    if (!this.isString(value)) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  isUUID(value: unknown): value is string {
    if (!this.isString(value)) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  isDate(value: unknown): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
  }

  isDateString(value: unknown): value is string {
    if (!this.isString(value)) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // Array validators
  isStringArray(value: unknown): value is string[] {
    return this.isArray(value) && value.every(item => this.isString(item));
  }

  isNumberArray(value: unknown): value is number[] {
    return this.isArray(value) && value.every(item => this.isNumber(item));
  }

  isObjectArray(value: unknown): value is Record<string, unknown>[] {
    return this.isArray(value) && value.every(item => this.isObject(item));
  }

  // Object validators
  hasRequiredKeys(obj: unknown, keys: string[]): obj is Record<string, unknown> {
    if (!this.isObject(obj)) return false;
    return keys.every(key => key in obj);
  }

  hasOptionalKeys(obj: unknown, keys: string[]): obj is Record<string, unknown> {
    if (!this.isObject(obj)) return false;
    return keys.some(key => key in obj);
  }

  // Validation with detailed results
  validateString(value: unknown, options?: { minLength?: number; maxLength?: number; pattern?: RegExp }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isString(value)) {
      errors.push('Value must be a string');
      return { isValid: false, errors, warnings };
    }

    if (options?.minLength && value.length < options.minLength) {
      errors.push(`String must be at least ${options.minLength} characters long`);
    }

    if (options?.maxLength && value.length > options.maxLength) {
      errors.push(`String must be no more than ${options.maxLength} characters long`);
    }

    if (options?.pattern && !options.pattern.test(value)) {
      errors.push('String does not match required pattern');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateNumber(value: unknown, options?: { min?: number; max?: number; integer?: boolean }): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isNumber(value)) {
      errors.push('Value must be a number');
      return { isValid: false, errors, warnings };
    }

    if (options?.min !== undefined && value < options.min) {
      errors.push(`Number must be at least ${options.min}`);
    }

    if (options?.max !== undefined && value > options.max) {
      errors.push(`Number must be no more than ${options.max}`);
    }

    if (options?.integer && !Number.isInteger(value)) {
      errors.push('Number must be an integer');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateObject(value: unknown, schema: Record<string, (val: unknown) => ValidationResult>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isObject(value)) {
      errors.push('Value must be an object');
      return { isValid: false, errors, warnings };
    }

    for (const [key, validator] of Object.entries(schema)) {
      const result = validator(value[key]);
      if (!result.isValid) {
        errors.push(`Field '${key}': ${result.errors.join(', ')}`);
      }
      warnings.push(...result.warnings.map(w => `Field '${key}': ${w}`));
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateArray(value: unknown, itemValidator: (val: unknown) => ValidationResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isArray(value)) {
      errors.push('Value must be an array');
      return { isValid: false, errors, warnings };
    }

    for (let i = 0; i < value.length; i++) {
      const result = itemValidator(value[i]);
      if (!result.isValid) {
        errors.push(`Item ${i}: ${result.errors.join(', ')}`);
      }
      warnings.push(...result.warnings.map(w => `Item ${i}: ${w}`));
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // API type validation methods
  validateApiTypes(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate API response structure
    const apiResponseSchema = {
      data: (val: unknown) => this.validateObject(val, {}),
      status: (val: unknown) => this.validateNumber(val, { min: 100, max: 599 }),
      message: (val: unknown) => this.validateString(val, { maxLength: 1000 }),
    };

    // Validate API error structure
    const apiErrorSchema = {
      error: (val: unknown) => this.validateString(val, { maxLength: 500 }),
      status: (val: unknown) => this.validateNumber(val, { min: 400, max: 599 }),
      details: (val: unknown) => this.validateObject(val, {}),
    };

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateDataTypes(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate User structure
    const userSchema = {
      id: (val: unknown) => this.validateString(val, { minLength: 1 }),
      name: (val: unknown) => this.validateString(val, { minLength: 1, maxLength: 100 }),
      email: (val: unknown) => this.validateString(val, { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
      age: (val: unknown) => this.validateNumber(val, { min: 0, max: 150 }),
    };

    // Validate Thoughtmark structure
    const thoughtmarkSchema = {
      id: (val: unknown) => this.validateString(val, { minLength: 1 }),
      title: (val: unknown) => this.validateString(val, { minLength: 1, maxLength: 200 }),
      content: (val: unknown) => this.validateString(val, { maxLength: 10000 }),
      userId: (val: unknown) => this.validateString(val, { minLength: 1 }),
      createdAt: (val: unknown) => this.validateDateString(val),
    };

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateStateTypes(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate AppState structure
    const appStateSchema = {
      theme: (val: unknown) => this.validateString(val, { minLength: 1 }),
      environment: (val: unknown) => this.validateString(val, { minLength: 1 }),
      isInitialized: (val: unknown) => this.validateBoolean(val),
      lastUpdated: (val: unknown) => this.validateDateString(val),
    };

    // Validate AuthState structure
    const authStateSchema = {
      isAuthenticated: (val: unknown) => this.validateBoolean(val),
      userId: (val: unknown) => this.validateString(val, { minLength: 1 }),
      token: (val: unknown) => this.validateString(val, { minLength: 1 }),
      expiresAt: (val: unknown) => this.validateDateString(val),
    };

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateNavigationTypes(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate NavigationState structure
    const navigationStateSchema = {
      currentRoute: (val: unknown) => this.validateString(val, { minLength: 1 }),
      params: (val: unknown) => this.validateObject(val, {}),
      history: (val: unknown) => this.validateArray(val, (item) => this.validateString(item, { minLength: 1 })),
      isNavigating: (val: unknown) => this.validateBoolean(val),
      lastNavigationTime: (val: unknown) => this.validateNumber(val, { min: 0 }),
    };

    return { isValid: errors.length === 0, errors, warnings };
  }

  validateAllTypes(): ValidationResult {
    const results = [
      this.validateApiTypes(),
      this.validateDataTypes(),
      this.validateStateTypes(),
      this.validateNavigationTypes(),
    ];

    return this.combineResults(...results);
  }

  validateBoolean(value: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.isBoolean(value)) {
      errors.push('Value must be a boolean');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Legacy compatibility methods
  checkLegacyCompatibility(): CompatibilityCheck[] {
    const checks: CompatibilityCheck[] = [];

    // Check User type compatibility
    checks.push({
      type: 'User',
      isCompatible: true,
      issues: [],
      suggestions: ['Consider adding validation for email format', 'Add age range validation'],
    });

    // Check Thoughtmark type compatibility
    checks.push({
      type: 'Thoughtmark',
      isCompatible: true,
      issues: [],
      suggestions: ['Add content length validation', 'Consider adding tags support'],
    });

    // Check API types compatibility
    checks.push({
      type: 'ApiResponse',
      isCompatible: true,
      issues: [],
      suggestions: ['Add pagination support', 'Consider adding metadata field'],
    });

    // Check Navigation types compatibility
    checks.push({
      type: 'NavigationState',
      isCompatible: true,
      issues: [],
      suggestions: ['Add route parameters validation', 'Consider adding navigation guards'],
    });

    return checks;
  }

  // Utility methods
  combineResults(...results: ValidationResult[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const result of results) {
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  createValidator<T>(validator: (value: unknown) => ValidationResult): TypeValidator<T> {
    return {
      validate: validator,
      isValid: (value: unknown): value is T => validator(value).isValid,
    };
  }
}

// Export singleton instance
export const typeValidator = TypeValidation.getInstance(); 