import { useState } from 'react';
import { signIn, signUp, resetPassword } from '../services/authService';

export interface AuthContextValue {
  token?: string;
  signIn: typeof signIn;
  signUp: typeof signUp;
  resetPassword: typeof resetPassword;
}

export function useAuth(): AuthContextValue {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_token, setToken] = useState<string|undefined>(undefined);
  return { token: _token, signIn, signUp, resetPassword };
} 