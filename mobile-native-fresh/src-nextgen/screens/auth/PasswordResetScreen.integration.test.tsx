import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PasswordResetScreen from './PasswordResetScreen';
import { ValidationService } from '../../utils/validation';

// Mock the hooks
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

describe('PasswordResetScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full password reset flow successfully', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(<PasswordResetScreen />);

    // Step 1: Enter email
    const emailInput = getByPlaceholderText('Enter your email address');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Step 2: Submit email
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.press(emailSubmitButton);

    // Step 3: Verify password form appears
    await waitFor(() => {
      expect(getByPlaceholderText('Enter new password')).toBeTruthy();
      expect(getByPlaceholderText('Confirm new password')).toBeTruthy();
      expect(getByText('Set New Password')).toBeTruthy();
    });

    // Step 4: Enter passwords
    const passwordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');
    fireEvent.changeText(passwordInput, 'StrongPassword123!');
    fireEvent.changeText(confirmPasswordInput, 'StrongPassword123!');

    // Step 5: Submit password reset
    const passwordSubmitButton = getByText('Set New Password');
    fireEvent.press(passwordSubmitButton);

    // Step 6: Verify reset was called
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('StrongPassword123!');
    });
  });

  it('handles validation errors throughout the flow', async () => {
    const mockResetPassword = jest.fn().mockRejectedValue(new Error('Reset failed'));
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);

    // Test invalid email
    const emailInput = getByPlaceholderText('Enter your email address');
    fireEvent.changeText(emailInput, 'invalid-email');
    
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.press(emailSubmitButton);

    // Should show email validation error
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });

    // Test valid email to proceed
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(emailSubmitButton);

    await waitFor(() => {
      // Test password mismatch
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');

      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'differentpassword');
      fireEvent.press(passwordSubmitButton);

      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('handles network errors gracefully', async () => {
    const mockResetPassword = jest.fn().mockRejectedValue(new Error('Network error'));
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);

    // Complete email submission
    const emailInput = getByPlaceholderText('Enter your email address');
    fireEvent.changeText(emailInput, 'test@example.com');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.press(emailSubmitButton);

    await waitFor(() => {
      // Complete password submission
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      const passwordSubmitButton = getByText('Set New Password');

      fireEvent.changeText(passwordInput, 'StrongPassword123!');
      fireEvent.changeText(confirmPasswordInput, 'StrongPassword123!');
      fireEvent.press(passwordSubmitButton);

      // Should handle error gracefully
      expect(mockResetPassword).toHaveBeenCalledWith('StrongPassword123!');
    });
  });

  it('maintains state consistency during navigation', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);

    // Enter email and submit
    const emailInput = getByPlaceholderText('Enter your email address');
    fireEvent.changeText(emailInput, 'test@example.com');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.press(emailSubmitButton);

    await waitFor(() => {
      // Navigate back
      const backButton = getByText('Back to Sign In');
      fireEvent.press(backButton);

      // Should return to email form
      expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
      expect(getByText('Send Reset Link')).toBeTruthy();
    });
  });

  it('handles rapid user interactions correctly', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText } = render(<PasswordResetScreen />);

    // Rapid email input and submission
    const emailInput = getByPlaceholderText('Enter your email address');
    fireEvent.changeText(emailInput, 'test@example.com');
    const emailSubmitButton = getByText('Send Reset Link');
    
    // Multiple rapid clicks
    fireEvent.press(emailSubmitButton);
    fireEvent.press(emailSubmitButton);
    fireEvent.press(emailSubmitButton);

    await waitFor(() => {
      // Should only process once
      expect(getByPlaceholderText('Enter new password')).toBeTruthy();
    });
  });

  it('validates accessibility throughout the flow', async () => {
    const mockResetPassword = jest.fn().mockResolvedValue({ success: true });
    const mockUseAuth = require('../../../hooks/useAuth');
    mockUseAuth.useAuth.mockReturnValue({
      resetPassword: mockResetPassword,
    });

    const { getByPlaceholderText, getByText, getByRole } = render(<PasswordResetScreen />);

    // Check initial accessibility
    const emailInput = getByPlaceholderText('Enter your email address');
    expect(emailInput.props.accessibilityLabel).toBeTruthy();

    // Complete email submission
    fireEvent.changeText(emailInput, 'test@example.com');
    const emailSubmitButton = getByText('Send Reset Link');
    fireEvent.press(emailSubmitButton);

    await waitFor(() => {
      // Check password form accessibility
      const passwordInput = getByPlaceholderText('Enter new password');
      const confirmPasswordInput = getByPlaceholderText('Confirm new password');
      
      expect(passwordInput.props.accessibilityLabel).toBeTruthy();
      expect(confirmPasswordInput.props.accessibilityLabel).toBeTruthy();
    });
  });
}); 
