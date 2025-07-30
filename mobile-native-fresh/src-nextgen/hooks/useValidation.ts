import { useState, useCallback } from 'react';

import { validateField as validateFieldUtil, validateForm as validateFormUtil, ValidationRule } from '../utils/validation';

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export function useValidation() {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(async (data: any, schema: ValidationSchema): Promise<boolean> => {
    try {
      const errors = validateFormUtil(data, schema);
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, []);

  const validateField = useCallback((fieldName: string, value: any, rules: ValidationRule[]): string | null => {
    try {
      const result = validateFieldUtil(value, rules);
      if (!result.isValid && result.message) {
        setValidationErrors(prev => ({ ...prev, [fieldName]: result.message }));
        return result.message;
      } else {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return null;
      }
    } catch (error) {
      console.error('Field validation error:', error);
      return 'Validation failed';
    }
  }, []);

  const clearValidationErrors = useCallback((fields?: string[]) => {
    if (fields) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        fields.forEach(field => delete newErrors[field]);
        return newErrors;
      });
    } else {
      setValidationErrors({});
    }
  }, []);

  const errors = validationErrors;

  return {
    validateForm,
    validateField,
    errors,
    clearValidationErrors,
  };
} 