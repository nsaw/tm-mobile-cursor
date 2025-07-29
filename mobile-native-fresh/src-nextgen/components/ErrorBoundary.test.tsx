import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import { ErrorBoundary } from './ErrorBoundary';

// Mock theme and accessibility hooks
jest.mock('../theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        error: '#FF3B30',
        background: '#FFFFFF',
        text: '#000000',
        primary: '#007AFF',
      },
      spacing: {
        lg: 24,
        md: 16,
      },
      typography: {
        fontSize: {
          xl: 20,
          base: 16,
        },
        fontWeight: {
          bold: '700',
          medium: '500',
        },
        lineHeight: {
          normal: 1.5,
        },
      },
      borderRadius: {
        md: 8,
      },
    },
  }),
}));

jest.mock('../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
  }),
}));

jest.mock('../state/stores/uiStore', () => ({
  useUIStore: () => ({
    setError: jest.fn(),
  }),
}));

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <View><Text>Normal component</Text></View>;
};

// Custom fallback component
const CustomFallback: React.FC = () => <View><Text>Custom error fallback</Text></View>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(getByText('Normal component')).toBeDefined();
  });

  it('should render error fallback when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeDefined();
    expect(getByText('Test error')).toBeDefined();
    expect(getByText('Try Again')).toBeDefined();
  });

  it('should render custom fallback when provided', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error fallback')).toBeDefined();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should reset error state when reset button is pressed', () => {
    // Create a component that can be controlled to stop throwing errors
    const ControlledErrorComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <View><Text>Normal component</Text></View>;
    };

    const { getByText, queryByText, rerender } = render(
      <ErrorBoundary>
        <ControlledErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeDefined();

    // Change the component to not throw before pressing reset
    rerender(
      <ErrorBoundary>
        <ControlledErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Now press the reset button
    fireEvent.press(getByText('Try Again'));

    // Error should be cleared
    expect(queryByText('Something went wrong')).toBeNull();
    expect(getByText('Normal component')).toBeDefined();
  });

  it('should reset error state when props change if resetOnPropsChange is true', () => {
    const { getByText, queryByText, rerender } = render(
      <ErrorBoundary resetOnPropsChange={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeDefined();

    // Change children
    rerender(
      <ErrorBoundary resetOnPropsChange={true}>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Error should be cleared
    expect(queryByText('Something went wrong')).toBeNull();
    expect(getByText('Normal component')).toBeDefined();
  });
}); 