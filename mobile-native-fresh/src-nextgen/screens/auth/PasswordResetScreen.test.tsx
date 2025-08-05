/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-namespace */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PasswordResetScreen } from './PasswordResetScreen';

// Mock the hooks and services
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    resetPassword: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useValidation', () => ({
  useValidation: () => ({
    validationErrors: {},
    clearValidationErrors: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      text: '#000000',
      error: '#FF3B30',
      success: '#34C759',
      border: '#E5E5EA',
      placeholder: '#8E8E93',
    },
  }),
}));

jest.mock('../../../utils/validation', () => ({
  ValidationService: {
    validateEmail: jest.fn(),
    validatePassword: jest.fn(),
  },
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('PasswordResetScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input form initially', () => {
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    
    expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(getByText('Reset Password')).toBeTruthy();
    expect(getByText('Enter your email to receive a password reset link')).toBeTruthy();
  });

  it('handles email input change', () => {
    const { getByPlaceholderText } = render(<PasswordResetScreen />);
    const emailInput = getByPlaceholderText('Enter your email address');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('validates email format before submission', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockValidateEmail = require('../../../utils/validation').ValidationService.validateEmail;
    mockValidateEmail.mockReturnValue(false);
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    const emailInput = getByPlaceholderText('Enter your email address');
    const submitButton = getByText('Send Reset Link');
    
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(mockValidateEmail).toHaveBeenCalledWith('invalid-email');
    });
  });

  it('shows password reset form after email submission', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    const emailInput = getByPlaceholderText('Enter your email address');
    const submitButton = getByText('Send Reset Link');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);
    
    await waitFor(() => {
      expect(getByPlaceholderText('Enter new password')).toBeTruthy();
      expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
      expect(getByText('Set New Password')).toBeTruthy();
    });
  });

  it('validates password strength', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockValidatePassword = require('../../../utils/validation').ValidationService.validatePassword;
    mockValidatePassword.mockReturnValue(false);
    
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    
    // First submit email
    const emailInput = getByPlaceholderText('Enter your email address');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(emailSubmitButton);
    
    await waitFor(() => {
      // Then test password validation
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');
      
      fireEvent.changeText(passwordInput, 'weak');
      fireEvent.changeText(confirmPasswordInput, 'weak');
      fireEvent.press(passwordSubmitButton);
      
      expect(mockValidatePassword).toHaveBeenCalledWith('weak');
    });
  });

  it('validates password confirmation match', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    
    // First submit email
    const emailInput = getByPlaceholderText('Enter your email address');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(emailSubmitButton);
    
    await waitFor(() => {
      // Then test password confirmation
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');
      
      fireEvent.changeText(passwordInput, 'strongpassword123');
      fireEvent.changeText(confirmPasswordInput, 'differentpassword');
      fireEvent.press(passwordSubmitButton);
      
      // Should show error for password mismatch
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('handles successful password reset', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockValidatePassword = require('../../../utils/validation').ValidationService.validatePassword;
    mockValidatePassword.mockReturnValue(true);
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    
    // Submit email
    const emailInput = getByPlaceholderText('Enter your email address');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(emailSubmitButton);
    
    await waitFor(() => {
      // Submit password reset
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');
      
      fireEvent.changeText(passwordInput, 'strongpassword123');
      fireEvent.changeText(confirmPasswordInput, 'strongpassword123');
      fireEvent.press(passwordSubmitButton);
      
      expect(mockResetPassword).toHaveBeenCalledWith('strongpassword123');
    });
  });

  it('handles password reset error', async () => {
    const mockResetPassword = jest.fn().mockRejectedValue(new Error('Reset failed'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    
    // Submit email
    const emailInput = getByPlaceholderText('Enter your email address');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(emailSubmitButton);
    
    await waitFor(() => {
      // Submit password reset
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');
      
      fireEvent.changeText(passwordInput, 'strongpassword123');
      fireEvent.changeText(confirmPasswordInput, 'strongpassword123');
      fireEvent.press(passwordSubmitButton);
      
      expect(mockResetPassword).toHaveBeenCalledWith('strongpassword123');
    });
  });

  it('shows loading state during submission', async () => {
    const mockResetPassword = jest.fn().mockImplementation((): Promise<undefined> => new Promise(resolve => setTimeout(() => resolve(undefined), 100)));
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });
    
    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);
    const emailInput = getByPlaceholderText('Enter your email address');
    const submitButton = getByText('Send Reset Link');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);
    
    // Should show loading state
    expect(getByText('Sending...')).toBeTruthy();
  });

  it('handles back navigation', () => {
    const { getByText } = render(<PasswordResetScreen />);
    const backButton = getByText('Back to Sign In');
    
    fireEvent.press(backButton);
    // Navigation should be handled by the parent component
  });
}); 
