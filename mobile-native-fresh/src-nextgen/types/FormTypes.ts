export interface FormField<T = any> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  validators?: Validator<T>[];
  transform?: (value: T) => T;
}

export interface FormState<T extends Record<string, any> = Record<string, any>> {
  fields: Record<keyof T, FormField<any>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
}

export interface Validator<T = any> {
  (value: T, allValues?: Record<string, any>): string | undefined;
}

export interface FormConfig<T extends Record<string, any> = Record<string, any>> {
  initialValues: T;
  validationSchema?: Record<keyof T, Validator<any>[]>;
  onSubmit: (values: T) => void | Promise<void>;
  onReset?: () => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormActions<T extends Record<string, any> = Record<string, any>> {
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => Promise<Record<keyof T, string>>;
  getFieldValue: (name: keyof T) => any;
  getFieldError: (name: keyof T) => string | undefined;
  getFieldTouched: (name: keyof T) => boolean;
} 