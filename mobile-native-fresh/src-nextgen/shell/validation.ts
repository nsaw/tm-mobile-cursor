// Shell validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateShell = (): ValidationResult => {
  return {
    isValid: true,
    errors: [],
    warnings: [],
  };
}; 