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

  static validateForm(formData: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        errors.push(`${key} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static validateObject(obj: Record<string, unknown>, schema: Record<string, ValidationRule<unknown>[]>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.entries(schema).forEach(([field, rules]) => {
      const value = obj[field];
      rules.forEach(rule => {
        const result = rule.validate(value);
        errors.push(...result.errors);
        warnings.push(...result.warnings);
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

export function useValidation(): {
  errors: Record<string, string[]>;
  clearValidationErrors: () => void;
  validateForm: (formData: Record<string, unknown>) => boolean;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
} {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const clearValidationErrors = (): void => {
    setErrors({});
  };

  const validateForm = (formData: Record<string, unknown>): boolean => {
    const validationResult = ValidationService.validateForm(formData);
    const newErrors: Record<string, string[]> = {};

    if (!validationResult.isValid) {
      newErrors.general = validationResult.errors;
    }

    setErrors(newErrors);
    return validationResult.isValid;
  };

  const setFieldError = (field: string, error: string): void => {
    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), error],
    }));
  };

  const clearFieldError = (field: string): void => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    clearValidationErrors,
    validateForm,
    setFieldError,
    clearFieldError,
  };
} 