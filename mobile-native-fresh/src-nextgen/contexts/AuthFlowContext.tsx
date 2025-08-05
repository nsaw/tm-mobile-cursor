import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthFlow, AuthFlowState, UserData } from '../hooks/useAuthFlow';

export interface AuthFlowContextType {
  flowState: AuthFlowState;
  flowHistory: string[];
  isLoading: boolean;
  error: unknown;
  handleSignIn: (email: string, password: string) => Promise<void>;
  handleSignUp: (userData: UserData) => Promise<void>;
  handlePinEntry: (pin: string) => Promise<void>;
  handlePasswordReset: (email: string) => Promise<void>;
  navigateToSignUp: () => void;
  navigateToSignIn: () => void;
  navigateToPasswordReset: () => void;
  resetFlow: () => void;
}

const AuthFlowContext = createContext<AuthFlowContextType | undefined>(undefined);

export const useAuthFlowContext = (): AuthFlowContextType => {
  const context = useContext(AuthFlowContext);
  if (!context) {
    throw new Error('useAuthFlowContext must be used within an AuthFlowProvider');
  }
  return context;
};

export interface AuthFlowProviderProps {
  children: ReactNode;
}

export const AuthFlowProvider: React.FC<AuthFlowProviderProps> = ({ children }): React.JSX.Element => {
  const authFlow = useAuthFlow();

  return (
    <AuthFlowContext.Provider value={authFlow}>
      {children}
    </AuthFlowContext.Provider>
  );
}; 