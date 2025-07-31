// @ts-nocheck
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Vibration } from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useValidation } from '../../hooks/useValidation';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useBiometrics } from '../../hooks/useBiometrics';
import { useSecurity } from '../../hooks/useSecurity';
import { analyticsService } from '../../services/analyticsService';
import { errorService } from '../../services/errorService';

import { PINEntryScreen } from './PINEntryScreen';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useTheme');
jest.mock('../../hooks/useValidation');
jest.mock('../../hooks/useAccessibility');
jest.mock('../../hooks/useBiometrics');
jest.mock('../../hooks/useSecurity');
jest.mock('../../services/authService');
jest.mock('../../services/analyticsService');
jest.mock('../../services/errorService');
jest.mock('../../services/securityService');

// Mock Alert and Vibration
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
jest.spyOn(Vibration, 'vibrate').mockImplementation(() => {});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockUseValidation = useValidation as jest.MockedFunction<typeof useValidation>;
const mockUseAccessibility = useAccessibility as jest.MockedFunction<typeof useAccessibility>;
const mockUseBiometrics = useBiometrics as jest.MockedFunction<typeof useBiometrics>;
const mockUseSecurity = useSecurity as jest.MockedFunction<typeof useSecurity>;
const mockAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;
const mockErrorService = errorService as jest.Mocked<typeof errorService>;

describe('PINEntryScreen', () => {
  const defaultAuthProps = {
    verifyPIN: jest.fn(),
    isLoading: false,
    error: null,
  };

  const defaultTheme = {
    theme: 'light',
    colors: {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      textSecondary: '#6C757D',
      primary: '#007AFF',
      error: '#DC3545',
      border: '#DEE2E6',
      warning: '#FFA500',
    },
    styles: {
      screenContainer: {},
      container: {},
      contentContainer: {},
      searchBar: {},
      input: {},
      voiceButton: {},
      voiceLabel: {},
      clearButton: {},
      clearButtonText: {},
      searchItem: {},
      searchItemContent: {},
      searchItemIcon: {},
      searchItemText: {},
      searchItemLabel: {},
      searchItemDescription: {},
      searchItemTimestamp: {},
      suggestionBadge: {},
      fieldContainer: {},
      fieldHeader: {},
      fieldLabel: {},
      editButton: {},
      editButtonText: {},
      editingContainer: {},
      multilineInput: {},
      inputError: {},
      errorText: {},
      editActions: {},
      saveButton: {},
      saveButtonText: {},
      cancelButton: {},
      cancelButtonText: {},
      displayContainer: {},
      displayText: {},
      editableSection: {},
    },
  };

  const defaultValidation = {
    validateForm: jest.fn().mockResolvedValue(true),
    validationErrors: {},
    clearValidationErrors: jest.fn(),
  };

  const defaultAccessibility = {
    isScreenReaderEnabled: false,
  };

  const defaultBiometrics = {
    isBiometricAvailable: true,
    biometricType: 'TouchID',
    authenticateWithBiometrics: jest.fn(),
    isBiometricSupported: true,
  };

  const defaultSecurity = {
    isLockedOut: false,
    lockoutEndTime: null,
    failedAttempts: 0,
    maxAttempts: 3,
    lockoutDuration: 15 * 60 * 1000,
    recordFailedAttempt: jest.fn(),
    resetFailedAttempts: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue(defaultAuthProps);
    mockUseTheme.mockReturnValue(defaultTheme);
    mockUseValidation.mockReturnValue(defaultValidation);
    mockUseAccessibility.mockReturnValue(defaultAccessibility);
    mockUseBiometrics.mockReturnValue(defaultBiometrics);
    mockUseSecurity.mockReturnValue(defaultSecurity);
  });

  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(<PINEntryScreen />);

    expect(getByText('Enter PIN')).toBeTruthy();
    expect(getByText('Enter your 6-digit PIN to continue')).toBeTruthy();
    expect(getByLabelText('PIN input field')).toBeTruthy();
    expect(getByText('Use Touch ID')).toBeTruthy();
    expect(getByText('Forgot PIN?')).toBeTruthy();
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('handles PIN input correctly', () => {
    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');
    expect(pinInput.props.value).toBe('123456');
  });

  it('only allows numeric input', () => {
    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123abc456');
    expect(pinInput.props.value).toBe('123456');
  });

  it('limits PIN to 6 digits', () => {
    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456789');
    expect(pinInput.props.value).toBe('123456');
  });

  it('auto-submits when PIN is complete', async () => {
    const mockVerifyPIN = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockVerifyPIN).toHaveBeenCalledWith('123456');
    });
  });

  it('validates PIN before submission', async () => {
    const mockValidateForm = jest.fn().mockResolvedValue(false);
    mockUseValidation.mockReturnValue({
      ...defaultValidation,
      validateForm: mockValidateForm,
      validationErrors: { pin: 'Invalid PIN format' },
    });

    const { getByLabelText, getByText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockValidateForm).toHaveBeenCalled();
      expect(getByText('Invalid PIN format')).toBeTruthy();
    });
  });

  it('handles successful PIN verification', async () => {
    const mockVerifyPIN = jest.fn().mockResolvedValue(undefined);
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockVerifyPIN).toHaveBeenCalledWith('123456');
      expect(mockNavigate).toHaveBeenCalledWith('Main');
      expect(mockAnalyticsService.track).toHaveBeenCalledWith('pin_verification_success', {
        attemptCount: 1,
      });
    });
  });

  it('handles PIN verification errors', async () => {
    const mockVerifyPIN = jest.fn().mockRejectedValue(new Error('Invalid PIN'));
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
      error: {
        code: 'PIN_ERROR',
        message: 'Invalid PIN',
        timestamp: new Date().toISOString(),
      },
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid PIN',
        expect.stringContaining('Incorrect PIN')
      );
      expect(Vibration.vibrate).toHaveBeenCalledWith(100);
    });
  });

  it('implements rate limiting for failed attempts', async () => {
    const mockVerifyPIN = jest.fn().mockRejectedValue(new Error('Invalid PIN'));
    const mockRecordFailedAttempt = jest.fn();
    
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
      error: {
        code: 'PIN_ERROR',
        message: 'Invalid PIN',
        timestamp: new Date().toISOString(),
      },
    });

    mockUseSecurity.mockReturnValue({
      ...defaultSecurity,
      failedAttempts: 2,
      recordFailedAttempt: mockRecordFailedAttempt,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockRecordFailedAttempt).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid PIN',
        expect.stringContaining('1 attempts remaining')
      );
    });
  });

  it('locks account after maximum failed attempts', async () => {
    const mockVerifyPIN = jest.fn().mockRejectedValue(new Error('Invalid PIN'));
    
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
      error: {
        code: 'PIN_ERROR',
        message: 'Invalid PIN',
        timestamp: new Date().toISOString(),
      },
    });

    mockUseSecurity.mockReturnValue({
      ...defaultSecurity,
      failedAttempts: 3,
      isLockedOut: true,
      lockoutEndTime: Date.now() + 15 * 60 * 1000,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Account Locked',
        expect.stringContaining('Too many failed PIN attempts')
      );
    });
  });

  it('handles biometric authentication', async () => {
    const mockAuthenticateWithBiometrics = jest.fn().mockResolvedValue(true);
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      authenticateWithBiometrics: mockAuthenticateWithBiometrics,
    });

    const { getByText } = render(<PINEntryScreen />);
    const biometricButton = getByText('Use Touch ID');

    fireEvent.press(biometricButton);

    await waitFor(() => {
      expect(mockAuthenticateWithBiometrics).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Main');
      expect(mockAnalyticsService.track).toHaveBeenCalledWith('biometric_auth_success', {
        biometricType: 'TouchID',
        attemptCount: 1,
      });
    });
  });

  it('handles biometric authentication failure', async () => {
    const mockAuthenticateWithBiometrics = jest.fn().mockResolvedValue(false);

    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      authenticateWithBiometrics: mockAuthenticateWithBiometrics,
    });

    const { getByText } = render(<PINEntryScreen />);
    const biometricButton = getByText('Use Touch ID');

    fireEvent.press(biometricButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Authentication Failed',
        expect.stringContaining('Biometric authentication failed')
      );
    });
  });

  it('handles biometric authentication errors', async () => {
    const mockAuthenticateWithBiometrics = jest.fn().mockRejectedValue(new Error('Biometric error'));

    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      authenticateWithBiometrics: mockAuthenticateWithBiometrics,
    });

    const { getByText } = render(<PINEntryScreen />);
    const biometricButton = getByText('Use Touch ID');

    fireEvent.press(biometricButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Authentication Error',
        expect.stringContaining('Biometric authentication encountered an error')
      );
    });
  });

  it('handles forgot PIN navigation', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByText } = render(<PINEntryScreen />);
    const forgotPINLink = getByText('Forgot PIN?');

    fireEvent.press(forgotPINLink);

    expect(mockNavigate).toHaveBeenCalledWith('PasswordReset');
    expect(mockAnalyticsService.track).toHaveBeenCalledWith('forgot_pin_clicked');
  });

  it('handles sign out navigation', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByText } = render(<PINEntryScreen />);
    const signOutButton = getByText('Sign Out');

    fireEvent.press(signOutButton);

    expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    expect(mockAnalyticsService.track).toHaveBeenCalledWith('sign_out_from_pin');
  });

  it('disables form when locked out', () => {
    mockUseSecurity.mockReturnValue({
      ...defaultSecurity,
      isLockedOut: true,
      lockoutEndTime: Date.now() + 15 * 60 * 1000,
    });

    const { getByLabelText, getByText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');
    const biometricButton = getByText('Use Touch ID');

    expect(pinInput.props.accessibilityState.disabled).toBe(true);
    expect(biometricButton).toBeTruthy(); // Biometric button should still be visible but disabled
  });

  it('shows lockout message when locked out', () => {
    mockUseSecurity.mockReturnValue({
      ...defaultSecurity,
      isLockedOut: true,
      lockoutEndTime: Date.now() + 15 * 60 * 1000,
    });

    const { getByText } = render(<PINEntryScreen />);
    
    expect(getByText(/Account temporarily locked/)).toBeTruthy();
    expect(getByText(/Please try again in/)).toBeTruthy();
  });

  it('shows warning message for failed attempts', () => {
    mockUseSecurity.mockReturnValue({
      ...defaultSecurity,
      failedAttempts: 1,
    });

    const { getByText } = render(<PINEntryScreen />);
    
    expect(getByText('2 attempts remaining')).toBeTruthy();
  });

  it('handles different biometric types correctly', () => {
    // Test Face ID
    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      biometricType: 'FaceID',
    });

    const { getByText, rerender } = render(<PINEntryScreen />);
    expect(getByText('Use Face ID')).toBeTruthy();

    // Test Fingerprint
    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      biometricType: 'Fingerprint',
    });

    rerender(<PINEntryScreen />);
    expect(getByText('Use Fingerprint')).toBeTruthy();
  });

  it('hides biometric button when not available', () => {
    mockUseBiometrics.mockReturnValue({
      ...defaultBiometrics,
      isBiometricAvailable: false,
    });

    const { queryByText } = render(<PINEntryScreen />);
    
    expect(queryByText('Use Touch ID')).toBeNull();
  });

  it('handles loading states correctly', () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      isLoading: true,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    expect(pinInput.props.accessibilityState.disabled).toBe(true);
  });

  it('clears validation errors on input change', () => {
    const mockClearValidationErrors = jest.fn();
    mockUseValidation.mockReturnValue({
      ...defaultValidation,
      clearValidationErrors: mockClearValidationErrors,
      validationErrors: { pin: 'Invalid PIN' },
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '1');

    expect(mockClearValidationErrors).toHaveBeenCalledWith(['pin']);
  });

  it('tracks analytics events correctly', async () => {
    const mockVerifyPIN = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockAnalyticsService.track).toHaveBeenCalledWith('pin_verification_attempt', {
        pinLength: 6,
        attemptCount: 1,
      });
    });
  });

  it('reports errors correctly', async () => {
    const mockVerifyPIN = jest.fn().mockRejectedValue(new Error('Test error'));
    mockUseAuth.mockReturnValue({
      ...defaultAuthProps,
      verifyPIN: mockVerifyPIN,
    });

    const { getByLabelText } = render(<PINEntryScreen />);
    const pinInput = getByLabelText('PIN input field');

    fireEvent.changeText(pinInput, '123456');

    await waitFor(() => {
      expect(mockErrorService.reportError).toHaveBeenCalledWith('pin_verification_unexpected_error', {
        error: expect.any(Error),
        pinLength: 6,
        timestamp: expect.any(String),
      });
    });
  });
}); 