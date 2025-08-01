export interface SignInPayload { email: string; password: string; }
export interface SignUpPayload { name: string; email: string; password: string; }
export interface ResetPasswordPayload { email: string; }
export interface AuthResponse { token: string; }
export interface UserProfile { id: string; name: string; email: string; }

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInValidationSchema {
  email: {
    required: boolean;
    email: boolean;
  };
  password: {
    required: boolean;
    minLength: number;
  };
}

export interface SignUpValidationSchema {
  name: {
    required: boolean;
    minLength: number;
  };
  email: {
    required: boolean;
    email: boolean;
  };
  password: {
    required: boolean;
    minLength: number;
    pattern?: RegExp;
  };
  confirmPassword: {
    required: boolean;
    match: string;
  };
} 