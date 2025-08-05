export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthService {
  signIn: (credentials: AuthCredentials) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getCurrentUser: () => Promise<AuthResponse['user'] | null>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuthServiceImpl implements AuthService {
  async signIn(credentials: AuthCredentials): Promise<AuthResponse> {
    // Implementation would go here
    throw new Error('Not implemented');
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    // Implementation would go here
    throw new Error('Not implemented');
  }

  async signOut(): Promise<void> {
    // Implementation would go here
    throw new Error('Not implemented');
  }

  async resetPassword(email: string): Promise<void> {
    // Implementation would go here
    throw new Error('Not implemented');
  }

  async getCurrentUser(): Promise<AuthResponse['user'] | null> {
    // Implementation would go here
    throw new Error('Not implemented');
  }
}

export const authService = new AuthServiceImpl(); 