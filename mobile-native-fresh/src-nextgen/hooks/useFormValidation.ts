import { useState, useCallback, useEffect } from 'react';
import { 
  ValidationRule, 
  FormField, 
  FormState, 
  ValidationResult,
  validateField,
  VALIDATION_SCHEMAS,
  createFormState
} from '../validation/formValidation';

// Dual-mount form validation hook
export const useDualMountFormValidation = (
  schema: { [key: string]: ValidationRule },
  environment: 'legacy' | 'nextgen' = 'nextgen'
) => {
  const [formState, setFormState] = useState<FormState>(() => createFormState(schema));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Environment-aware validation
  const validateForm = useCallback((): ValidationResult => {
    const errors: { [key: string]: string | null } = {};
    let isValid = true;

    Object.keys(formState).forEach(fieldName => {
      const field = formState[fieldName];
      let error = validateField(field.value, field.rules);

      // Environment-specific validation adjustments
      if (environment === 'legacy') {
        // Legacy environment might have different validation rules
        if (field.rules.email && field.value) {
          // Legacy email validation might be more lenient
          const legacyEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!legacyEmailPattern.test(field.value)) {
            error = 'Invalid email address';
          }
        }
      } else {
        // NextGen environment uses stricter validation
        error = validateField(field.value, field.rules);
      }

      errors[fieldName] = error;
      if (error) {
        isValid = false;
      }
    });

    return { isValid, errors };
  }, [formState, environment]);

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
    setSubmitError(null); // Clear submit error when user starts typing
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
    setFormState(createFormState(schema));
    setSubmitError(null);
    setIsSubmitting(false);
  }, [schema]);

  const getFieldError = useCallback((name: string): string | null => {
    const field = formState[name];
    return field?.touched ? field.error : null;
  }, [formState]);

  const hasErrors = useCallback((): boolean => {
    return Object.values(formState).some(field => field.error !== null);
  }, [formState]);

  const getFormValues = useCallback(() => {
    const values: { [key: string]: any } = {};
    Object.keys(formState).forEach(fieldName => {
      values[fieldName] = formState[fieldName].value;
    });
    return values;
  }, [formState]);

  const setFormValues = useCallback((values: { [key: string]: any }) => {
    setFormState(prev => {
      const newState = { ...prev };
      Object.keys(values).forEach(fieldName => {
        if (newState[fieldName]) {
          newState[fieldName] = {
            ...newState[fieldName],
            value: values[fieldName],
            error: validateField(values[fieldName], newState[fieldName].rules),
          };
        }
      });
      return newState;
    });
  }, []);

  const handleSubmit = useCallback(async (
    onSubmit: (values: { [key: string]: any }) => Promise<void>
  ) => {
    const validation = validateForm();
    if (!validation.isValid) {
      // Mark all fields as touched to show errors
      setFormState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(fieldName => {
          newState[fieldName] = {
            ...newState[fieldName],
            touched: true,
          };
        });
        return newState;
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const values = getFormValues();
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, getFormValues]);

  // Auto-save form state to localStorage for dual-mount persistence
  useEffect(() => {
    const saveFormState = () => {
      try {
        const values = getFormValues();
        localStorage.setItem(`form-state-${environment}`, JSON.stringify(values));
      } catch (error) {
        console.warn('Failed to save form state:', error);
      }
    };

    // Save form state when it changes
    const timeoutId = setTimeout(saveFormState, 500);
    return () => clearTimeout(timeoutId);
  }, [formState, environment, getFormValues]);

  // Load form state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(`form-state-${environment}`);
      if (savedState) {
        const values = JSON.parse(savedState);
        setFormValues(values);
      }
    } catch (error) {
      console.warn('Failed to load form state:', error);
    }
  }, [environment, setFormValues]);

  return {
    formState,
    validateForm,
    updateField,
    setFieldTouched,
    resetForm,
    getFieldError,
    hasErrors,
    getFormValues,
    setFormValues,
    handleSubmit,
    isSubmitting,
    submitError,
    environment,
  };
};

// Pre-configured hooks for common forms
export const useSignupForm = (environment: 'legacy' | 'nextgen' = 'nextgen') => {
  return useDualMountFormValidation(VALIDATION_SCHEMAS.SIGNUP, environment);
};

export const useSigninForm = (environment: 'legacy' | 'nextgen' = 'nextgen') => {
  return useDualMountFormValidation(VALIDATION_SCHEMAS.SIGNIN, environment);
};

export const useProfileForm = (environment: 'legacy' | 'nextgen' = 'nextgen') => {
  return useDualMountFormValidation(VALIDATION_SCHEMAS.PROFILE, environment);
};

// Form state persistence hook for dual-mount architecture
export const useFormPersistence = (formKey: string, environment: 'legacy' | 'nextgen' = 'nextgen') => {
  const [persistedState, setPersistedState] = useState<any>(null);

  const saveState = useCallback((state: any) => {
    try {
      const key = `form-persistence-${environment}-${formKey}`;
      localStorage.setItem(key, JSON.stringify({
        state,
        timestamp: Date.now(),
        environment,
      }));
    } catch (error) {
      console.warn('Failed to save form state:', error);
    }
  }, [formKey, environment]);

  const loadState = useCallback(() => {
    try {
      const key = `form-persistence-${environment}-${formKey}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only load if it's from the same environment and not too old (24 hours)
        if (parsed.environment === environment && 
            Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setPersistedState(parsed.state);
          return parsed.state;
        }
      }
    } catch (error) {
      console.warn('Failed to load form state:', error);
    }
    return null;
  }, [formKey, environment]);

  const clearState = useCallback(() => {
    try {
      const key = `form-persistence-${environment}-${formKey}`;
      localStorage.removeItem(key);
      setPersistedState(null);
    } catch (error) {
      console.warn('Failed to clear form state:', error);
    }
  }, [formKey, environment]);

  return {
    persistedState,
    saveState,
    loadState,
    clearState,
  };
}; 