import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './useAuth';
import { analyticsService } from '../services/analyticsService';
import { errorService } from '../services/errorService';

// Define navigation type for auth flow
type AuthNavigation = {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
  reset: (state: Record<string, unknown>) => void;
};

export interface AuthFlowState {
  currentStep: 'signin' | 'signup' | 'pinentry' | 'passwordreset' | 'complete';
  email: string;
  requiresPin: boolean;
  pinPurpose: 'verification' | 'setup';
  isFlowComplete: boolean;
}

export interface UserData {
  email: string;
  password: string;
  name?: string;
}

export const useAuthFlow = (): {
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
  goBack: () => void;
  resetFlow: () => void;
} => {
  const navigation = useNavigation<AuthNavigation>();
  const { signIn, signUp, verifyPIN, resetPassword, isLoading, error } = useAuth();

  const [flowState, setFlowState] = useState<AuthFlowState>({
    currentStep: 'signin',
    email: '',
    requiresPin: false,
    pinPurpose: 'verification',
    isFlowComplete: false,
  });

  const [flowHistory, setFlowHistory] = useState<string[]>([]);

  // Track flow progression
  const trackFlowStep = useCallback((step: string) => {
    setFlowHistory(prev => [...prev, step]);
    analyticsService.track('auth_flow_step', {
      step,
      flowHistory: flowHistory.length,
      email: flowState.email ? 'provided' : 'not_provided',
    });
  }, [flowHistory, flowState.email]);

  // Handle sign in flow
  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      trackFlowStep('signin_attempt');
      setFlowState(prev => ({ ...prev, email, currentStep: 'signin' }));

      const result = await signIn(email, password);

      if (result.requiresPin) {
        setFlowState(prev => ({ 
          ...prev, 
          requiresPin: true, 
          pinPurpose: 'verification',
          currentStep: 'pinentry' 
        }));
        trackFlowStep('signin_pin_required');
        navigation.navigate('PinEntry', { email, purpose: 'verification' });
      } else {
        setFlowState(prev => ({ ...prev, currentStep: 'complete', isFlowComplete: true }));
        trackFlowStep('signin_complete');
        // Navigate to main app
      }
    } catch (error) {
      trackFlowStep('signin_error');
      const errorObj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Sign in error');
      errorService.reportError(errorObj, { error, email });
      throw error;
    }
  }, [signIn, navigation, trackFlowStep]);

  // Handle sign up flow
  const handleSignUp = useCallback(async (userData: UserData) => {
    try {
      trackFlowStep('signup_attempt');
      setFlowState(prev => ({ ...prev, email: userData.email, currentStep: 'signup' }));

      const result = await signUp(userData.email, userData.password);

      if (result.requiresPin) {
        setFlowState(prev => ({ 
          ...prev, 
          requiresPin: true, 
          pinPurpose: 'setup',
          currentStep: 'pinentry' 
        }));
        trackFlowStep('signup_pin_required');
        navigation.navigate('PinEntry', { email: userData.email, purpose: 'setup' });
      } else {
        setFlowState(prev => ({ ...prev, currentStep: 'complete', isFlowComplete: true }));
        trackFlowStep('signup_complete');
        // Navigate to main app
      }
    } catch (error) {
      trackFlowStep('signup_error');
      const errorObj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Sign up error');
      errorService.reportError(errorObj, { error, email: userData.email });
      throw error;
    }
  }, [signUp, navigation, trackFlowStep]);

  // Handle PIN entry
  const handlePinEntry = useCallback(async (pin: string) => {
    try {
      trackFlowStep('pin_entry_attempt');
      setFlowState(prev => ({ ...prev, currentStep: 'pinentry' }));

      const result = await verifyPIN(pin, flowState.pinPurpose);

      if (result.success) {
        setFlowState(prev => ({ ...prev, currentStep: 'complete', isFlowComplete: true }));
        trackFlowStep('pin_entry_success');
        // Navigate to main app
      } else {
        trackFlowStep('pin_entry_failed');
        throw new Error('Invalid PIN');
      }
    } catch (error) {
      trackFlowStep('pin_entry_error');
      const errorObj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'PIN entry error');
      errorService.reportError(errorObj, { error, email: flowState.email });
      throw error;
    }
  }, [verifyPIN, trackFlowStep, flowState.email, flowState.pinPurpose]);

  // Handle password reset
  const handlePasswordReset = useCallback(async (email: string) => {
    try {
      trackFlowStep('password_reset_attempt');
      setFlowState(prev => ({ ...prev, email, currentStep: 'passwordreset' }));

      await resetPassword(email);

      setFlowState(prev => ({ ...prev, currentStep: 'complete' }));
      trackFlowStep('password_reset_success');
      // Navigate to sign in
    } catch (error) {
      trackFlowStep('password_reset_error');
      const errorObj = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Password reset error');
      errorService.reportError(errorObj, { error, email });
      throw error;
    }
  }, [resetPassword, trackFlowStep]);

  // Navigation helpers
  const navigateToSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const navigateToSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  const navigateToPasswordReset = useCallback(() => {
    navigation.navigate('PasswordReset');
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const resetFlow = useCallback(() => {
    setFlowState({
      currentStep: 'signin',
      email: '',
      requiresPin: false,
      pinPurpose: 'verification',
      isFlowComplete: false,
    });
    setFlowHistory([]);
  }, []);

  return {
    flowState,
    flowHistory,
    isLoading,
    error,
    handleSignIn,
    handleSignUp,
    handlePinEntry,
    handlePasswordReset,
    navigateToSignUp,
    navigateToSignIn,
    navigateToPasswordReset,
    goBack,
    resetFlow,
  };
}; 