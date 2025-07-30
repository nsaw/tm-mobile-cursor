/**
 * Validation utility functions for form validation
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validator?: (value: any) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    return { 
      isValid: false, 
      message: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }

  return { isValid: true };
};

/**
 * Validates that two passwords match
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true };
};

/**
 * Validates required field
 */
export const validateRequired = (value: any): ValidationResult => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, message: 'This field is required' };
  }
  return { isValid: true };
};

/**
 * Validates minimum length
 */
export const validateMinLength = (value: string, minLength: number): ValidationResult => {
  if (!value || value.length < minLength) {
    return { isValid: false, message: `Must be at least ${minLength} characters` };
  }
  return { isValid: true };
};

/**
 * Validates maximum length
 */
export const validateMaxLength = (value: string, maxLength: number): ValidationResult => {
  if (value && value.length > maxLength) {
    return { isValid: false, message: `Must be no more than ${maxLength} characters` };
  }
  return { isValid: true };
};

/**
 * Validates pattern match
 */
export const validatePattern = (value: string, pattern: RegExp, message?: string): ValidationResult => {
  if (!pattern.test(value)) {
    return { isValid: false, message: message || 'Invalid format' };
  }
  return { isValid: true };
};

/**
 * Generic validation function
 */
export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    // Required validation
    if (rule.required) {
      const requiredResult = validateRequired(value);
      if (!requiredResult.isValid) {
        return { isValid: false, message: rule.message || requiredResult.message };
      }
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      continue;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string') {
      const minLengthResult = validateMinLength(value, rule.minLength);
      if (!minLengthResult.isValid) {
        return { isValid: false, message: rule.message || minLengthResult.message };
      }
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string') {
      const maxLengthResult = validateMaxLength(value, rule.maxLength);
      if (!maxLengthResult.isValid) {
        return { isValid: false, message: rule.message || maxLengthResult.message };
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      const patternResult = validatePattern(value, rule.pattern, rule.message);
      if (!patternResult.isValid) {
        return patternResult;
      }
    }

    // Custom validator
    if (rule.validator) {
      const validatorResult = rule.validator(value);
      if (typeof validatorResult === 'string') {
        return { isValid: false, message: validatorResult };
      }
      if (!validatorResult) {
        return { isValid: false, message: rule.message || 'Invalid value' };
      }
    }
  }

  return { isValid: true };
};

/**
 * Validates form data against a schema
 */
export const validateForm = (data: Record<string, any>, schema: Record<string, ValidationRule[]>): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const result = validateField(value, rules);
    
    if (!result.isValid && result.message) {
      errors[field] = result.message;
    }
  }

  return errors;
};

/**
 * Common validation schemas
 */
export const validationSchemas = {
  email: [
    { required: true, message: 'Email is required' },
    { validator: validateEmail, message: 'Please enter a valid email address' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { minLength: 8, message: 'Password must be at least 8 characters' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      message: 'Password must contain uppercase, lowercase, number, and special character' 
    }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password' }
  ],
  resetToken: [
    { required: true, message: 'Reset token is required' },
    { minLength: 6, message: 'Token must be at least 6 characters' }
  ]
}; 