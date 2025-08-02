export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  type: string;
  value?: unknown;
  message: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationContext {
  field: string;
  value: unknown;
  formValues: Record<string, unknown>;
}

export type Validator = (value: unknown, context?: ValidationContext) => ValidationResult;

export interface ValidationConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  stopOnFirstError?: boolean;
} 