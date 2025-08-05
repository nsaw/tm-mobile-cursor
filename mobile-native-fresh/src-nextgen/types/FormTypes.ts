export interface FormField<T = string> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  disabled?: boolean;
}

export interface FormValidationRule<T = unknown> {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: T;
  message: string;
}

export interface FormConfig {
  initialValues: Record<string, unknown>;
  validationSchema?: Record<string, FormValidationRule[]>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormActions {
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  resetForm: () => void;
  submitForm: () => void;
}

export interface FormHook {
  state: FormState;
  actions: FormActions;
}

export interface FormFieldProps<T = string> {
  name: string;
  value: T;
  onChange: (value: T) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
}

export interface FormSubmitProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  disabled?: boolean;
}

export interface FormResetProps {
  onReset: () => void;
  disabled?: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormValidator {
  validate: (values: Record<string, unknown>) => FormValidationResult;
  validateField: (name: string, value: unknown) => string | undefined;
} 