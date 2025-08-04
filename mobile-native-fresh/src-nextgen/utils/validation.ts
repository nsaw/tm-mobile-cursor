import { useState } from 'react';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule<T> {
  validate: (_value: T) => ValidationResult;
  message: string;
}

export class ValidationService {
  static validateEmail(email: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      isValid,
      errors: isValid ? [] : ['Invalid email format'],
      warnings: [],
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      warnings.push('Consider using uppercase letters');
    }

    if (!/[a-z]/.test(password)) {
      warnings.push('Consider using lowercase letters');
    }

    if (!/\d/.test(password)) {
      warnings.push('Consider using numbers');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      warnings.push('Consider using special characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static validateRequired(value: string, fieldName: string): ValidationResult {
    const isValid = value.trim().length > 0;
    
    return {
      isValid,
      errors: isValid ? [] : [`${fieldName} is required`],
      warnings: [],
    };
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
    const isValid = value.length >= minLength;
    
    return {
      isValid,
      errors: isValid ? [] : [`${fieldName} must be at least ${minLength} characters`],
      warnings: [],
    };
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    const isValid = value.length <= maxLength;
    
    return {
      isValid,
      errors: isValid ? [] : [`${fieldName} must be no more than ${maxLength} characters`],
      warnings: [],
    };
  }

  static combineResults(...results: ValidationResult[]): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    results.forEach(result => {
      allErrors.push(...result.errors);
      allWarnings.push(...result.warnings);
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }
}

export function useValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const clearValidationErrors = () => {
    setValidationErrors({});
  };

  const validateForm = (formData: Record<string, any>): boolean => {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    // Basic form validation - can be extended based on form structure
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      const fieldErrors: string[] = [];

      // Required field validation
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        fieldErrors.push(`${key} is required`);
        isValid = false;
      }

      // Email validation for email fields
      if (key.toLowerCase().includes('email') && value) {
        const emailResult = ValidationService.validateEmail(value);
        if (!emailResult.isValid) {
          fieldErrors.push(...emailResult.errors);
          isValid = false;
        }
      }

      // Password validation for password fields
      if (key.toLowerCase().includes('password') && value) {
        const passwordResult = ValidationService.validatePassword(value);
        if (!passwordResult.isValid) {
          fieldErrors.push(...passwordResult.errors);
          isValid = false;
        }
      }

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  return {
    validateEmail: ValidationService.validateEmail,
    validatePassword: ValidationService.validatePassword,
    validateRequired: ValidationService.validateRequired,
    validateMinLength: ValidationService.validateMinLength,
    validateMaxLength: ValidationService.validateMaxLength,
    combineResults: ValidationService.combineResults,
    validateForm,
    validationErrors,
    clearValidationErrors,
  };
} 