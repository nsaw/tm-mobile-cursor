import { useState, useCallback } from 'react';

// Validation rule types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
}

// Form field interface
export interface FormField {
  name: string;
  value: any;
  rules: ValidationRule;
  touched: boolean;
  error: string | null;
}

// Form state interface
export interface FormState {
  [key: string]: FormField;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string | null };
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

// Validation functions
export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'This field is required';
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  const stringValue = value.toString();

  // Length validations
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return 'Invalid format';
  }

  // Email validation
  if (rules.email && !VALIDATION_PATTERNS.EMAIL.test(stringValue)) {
    return 'Invalid email address';
  }

  // Phone validation
  if (rules.phone && !VALIDATION_PATTERNS.PHONE.test(stringValue)) {
    return 'Invalid phone number';
  }

  // URL validation
  if (rules.url && !VALIDATION_PATTERNS.URL.test(stringValue)) {
    return 'Invalid URL';
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

// Form validation hook
export const useFormValidation = (initialState: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const validateForm = useCallback((): ValidationResult => {
    const errors: { [key: string]: string | null } = {};
    let isValid = true;

    Object.keys(formState).forEach(fieldName => {
      const field = formState[fieldName];
      const error = validateField(field.value, field.rules);
      errors[fieldName] = error;
      if (error) {
        isValid = false;
      }
    });

    return { isValid, errors };
  }, [formState]);

  const updateField = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        touched: true,
        error: validateField(value, prev[name].rules),
      },
    }));
  }, []);

  const setFieldTouched = useCallback((name: string, touched: boolean = true) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched,
        error: touched ? validateField(prev[name].value, prev[name].rules) : prev[name].error,
      },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(initialState);
  }, [initialState]);

  const getFieldError = useCallback((name: string): string | null => {
    const field = formState[name];
    return field?.touched ? field.error : null;
  }, [formState]);

  const hasErrors = useCallback((): boolean => {
    return Object.values(formState).some(field => field.error !== null);
  }, [formState]);

  return {
    formState,
    validateForm,
    updateField,
    setFieldTouched,
    resetForm,
    getFieldError,
    hasErrors,
  };
};

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  SIGNUP: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: VALIDATION_PATTERNS.PASSWORD,
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formState?: FormState) => {
        if (formState && value !== formState.password?.value) {
          return 'Passwords do not match';
        }
        return null;
      },
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: VALIDATION_PATTERNS.USERNAME,
    },
  },
  SIGNIN: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
  PROFILE: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    phone: {
      phone: true,
    },
    website: {
      url: true,
    },
  },
};

// Utility function to create initial form state from schema
export const createFormState = (schema: { [key: string]: ValidationRule }): FormState => {
  const initialState: FormState = {};
  
  Object.keys(schema).forEach(fieldName => {
    initialState[fieldName] = {
      name: fieldName,
      value: '',
      rules: schema[fieldName],
      touched: false,
      error: null,
    };
  });

  return initialState;
}; 