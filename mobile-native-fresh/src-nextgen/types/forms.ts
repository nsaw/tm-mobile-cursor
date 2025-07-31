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
  email: any[];
  password: any[];
}

export interface SignUpValidationSchema {
  firstName: any[];
  lastName: any[];
  email: any[];
  password: any[];
  confirmPassword: any[];
}

export interface PINValidationSchema {
  pin: any[];
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

export const PINValidationSchema = {
  pin: [],
}; 