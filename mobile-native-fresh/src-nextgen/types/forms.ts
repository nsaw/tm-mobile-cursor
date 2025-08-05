export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export interface SignInValidationSchema {
  email: unknown[];
  password: unknown[];
}

export interface SignUpValidationSchema {
  firstName: unknown[];
  lastName: unknown[];
  email: unknown[];
  password: unknown[];
  confirmPassword: unknown[];
}

export const SignInValidationSchema = {
  email: [],
  password: [],
};

export const SignUpValidationSchema = {
  firstName: [],
  lastName: [],
  email: [],
  password: [],
  confirmPassword: [],
};

export interface PINValidationSchema {
  pin: unknown[];
}

export const PINValidationSchema = {
  pin: [],
}; 
