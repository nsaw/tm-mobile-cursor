import { useState, useCallback, useRef } from 'react';
import { FormState, FormConfig, FormActions, FormField, ValidationRule } from '../types/FormTypes';

export function useForm(
  config: FormConfig
): [FormState, FormActions] {
  const [state, setState] = useState<FormState>(() => {
    const fields: Record<string, FormField> = {};
    const errors: Record<string, string> = {};
    const touched: Record<string, boolean> = {};

    Object.keys(config.initialValues).forEach(key => {
      fields[key] = {
        name: key,
        label: key,
        type: 'text',
        value: config.initialValues[key],
        error: undefined,
        required: false,
      };
      errors[key] = '';
      touched[key] = false;
    });

    return {
      fields,
      isValid: true,
      isDirty: false,
      isSubmitting: false,
      errors,
      touched,
    };
  });

  const initialValuesRef = useRef(config.initialValues);
  const validationSchemaRef = useRef(config.validationSchema);

  const validateField = useCallback(
    async (name: keyof T, value: unknown, allValues?: T): Promise<string | undefined> => {
      const validators = validationSchemaRef.current?.[name] || [];
      
      for (const validator of validators) {
        const error = await validator(value, allValues);
        if (error) return error;
      }
      
      return undefined;
    },
    []
  );

  const validateForm = useCallback(async (): Promise<Record<keyof T, string>> => {
    const allValues = Object.keys(state.fields).reduce((acc, key) => {
      acc[key] = state.fields[key].value;
      return acc;
    }, {} as T);

    const newErrors: Record<keyof T, string> = {} as any;
    let isValid = true;

    for (const key of Object.keys(state.fields)) {
      const error = await validateField(key as keyof T, state.fields[key].value, allValues);
      newErrors[key] = error || '';
      if (error) isValid = false;
    }

    setState(prev => ({
      ...prev,
      errors: newErrors,
      isValid,
    }));

    return newErrors;
  }, [state.fields, validateField]);

  const setFieldValue = useCallback(
    async (name: keyof T, value: unknown) => {
      setState(prev => {
        const newFields = { ...prev.fields };
        newFields[name] = { ...newFields[name], value };

        const isDirty = Object.keys(newFields).some(
          key => newFields[key].value !== initialValuesRef.current[key]
        );

        return {
          ...prev,
          fields: newFields,
          isDirty,
        };
      });

      if (config.validateOnChange) {
        const error = await validateField(name, value);
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: error || '' },
        }));
      }
    },
    [config.validateOnChange, validateField]
  );

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  const setFieldTouched = useCallback(
    async (name: keyof T, touched: boolean) => {
      setState(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [name]: { ...prev.fields[name], touched },
        },
        touched: { ...prev.touched, [name]: touched },
      }));

      if (touched && config.validateOnBlur) {
        const error = await validateField(name, state.fields[name].value);
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [name]: error || '' },
        }));
      }
    },
    [config.validateOnBlur, validateField, state.fields]
  );

  const resetForm = useCallback(() => {
    setState(prev => {
      const newFields = { ...prev.fields };
      Object.keys(newFields).forEach(key => {
        newFields[key] = {
          ...newFields[key],
          value: initialValuesRef.current[key],
          error: undefined,
          touched: false,
        };
      });

      return {
        ...prev,
        fields: newFields,
        isValid: true,
        isDirty: false,
        errors: Object.keys(newFields).reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {} as Record<keyof T, string>),
        touched: Object.keys(newFields).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as Record<keyof T, boolean>),
      };
    });
    config.onReset?.();
  }, [config.onReset]);

  const submitForm = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const errors = await validateForm();
      const hasErrors = Object.values(errors).some(error => error);

      if (hasErrors) {
        setState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      const values = Object.keys(state.fields).reduce((acc, key) => {
        acc[key] = state.fields[key].value;
        return acc;
      }, {} as T);

      await config.onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [validateForm, state.fields, config.onSubmit]);

  const getFieldValue = useCallback((name: keyof T) => {
    return state.fields[name].value;
  }, [state.fields]);

  const getFieldError = useCallback((name: keyof T) => {
    return state.errors[name] || undefined;
  }, [state.errors]);

  const getFieldTouched = useCallback((name: keyof T) => {
    return state.touched[name];
  }, [state.touched]);

  return [
    state,
    {
      setFieldValue,
      setFieldError,
      setFieldTouched,
      resetForm,
      submitForm,
      validateForm,
      getFieldValue,
      getFieldError,
      getFieldTouched,
    },
  ];
} 