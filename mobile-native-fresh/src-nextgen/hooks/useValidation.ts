import { useState, useCallback } from 'react';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationState {
  errors: ValidationError[];
  isValid: boolean;
  isDirty: boolean;
}

export interface ValidationActions {
  validateField: (field: string, value: unknown, rules: ValidationRule[]) => boolean;
  validateForm: (data: Record<string, unknown>, rules: Record<string, ValidationRule[]>) => boolean;
  clearValidationErrors: () => void;
  clearFieldError: (field: string) => void;
  setFieldError: (field: string, message: string) => void;
  validationErrors: ValidationError[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: unknown;
  message?: string;
  validator?: (value: unknown) => boolean;
}

export const useValidation = (): ValidationState & ValidationActions => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback((field: string, value: unknown, rules: ValidationRule[]): boolean => {
    const fieldErrors: ValidationError[] = [];

    for (const rule of rules) {
      let isValid = true;

      switch (rule.type) {
        case 'required':
          isValid = value !== null && value !== undefined && value !== '';
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isValid = typeof value === 'string' && emailRegex.test(value);
          break;
        case 'minLength':
          isValid = typeof value === 'string' && value.length >= (rule.value as number);
          break;
        case 'maxLength':
          isValid = typeof value === 'string' && value.length <= (rule.value as number);
          break;
        case 'pattern':
          isValid = typeof value === 'string' && rule.value instanceof RegExp && rule.value.test(value);
          break;
        case 'custom':
          isValid = rule.validator ? rule.validator(value) : true;
          break;
      }

      if (!isValid) {
        fieldErrors.push({
          field,
          message: rule.message || `Validation failed for ${field}`,
        });
      }
    }

    // Update errors for this field
    setErrors(prev => {
      const otherErrors = prev.filter(error => error.field !== field);
      return [...otherErrors, ...fieldErrors];
    });

    setIsDirty(true);
    return fieldErrors.length === 0;
  }, []);

  const validateForm = useCallback((data: Record<string, unknown>, rules: Record<string, ValidationRule[]>): boolean => {
    const formErrors: ValidationError[] = [];

    for (const [field, fieldRules] of Object.entries(rules)) {
      const value = data[field];
      const fieldErrors: ValidationError[] = [];

      for (const rule of fieldRules) {
        let isValid = true;

        switch (rule.type) {
          case 'required':
            isValid = value !== null && value !== undefined && value !== '';
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = typeof value === 'string' && emailRegex.test(value);
            break;
          case 'minLength':
            isValid = typeof value === 'string' && value.length >= (rule.value as number);
            break;
          case 'maxLength':
            isValid = typeof value === 'string' && value.length <= (rule.value as number);
            break;
          case 'pattern':
            isValid = typeof value === 'string' && rule.value instanceof RegExp && rule.value.test(value);
            break;
          case 'custom':
            isValid = rule.validator ? rule.validator(value) : true;
            break;
        }

        if (!isValid) {
          fieldErrors.push({
            field,
            message: rule.message || `Validation failed for ${field}`,
          });
        }
      }

      formErrors.push(...fieldErrors);
    }

    setErrors(formErrors);
    setIsDirty(true);
    return formErrors.length === 0;
  }, []);

  const clearValidationErrors = useCallback(() => {
    setErrors([]);
    setIsDirty(false);
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => prev.filter(error => error.field !== field));
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => {
      const otherErrors = prev.filter(error => error.field !== field);
      return [...otherErrors, { field, message }];
    });
    setIsDirty(true);
  }, []);

  return {
    errors,
    isValid: errors.length === 0,
    isDirty,
    validateField,
    validateForm,
    clearValidationErrors,
    clearFieldError,
    setFieldError,
    validationErrors: errors,
  };
}; 