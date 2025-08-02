import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from './ErrorBoundary';

// Mock theme and accessibility hooks
jest.mock('../theme', () => ({
  useTheme: () => ({
    tokens: {
      colors: {
        error: '#FF3B30',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#007AFF',
      },
      spacing: {
        lg: 24,
        md: 16,
      },
      typography: {
        fontSize: {
          xl: 20,
          body: 16,
        },
        fontWeight: {
          bold: '700',
          medium: '500',
        },
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
  return <div>Normal component</div>;
};

// Custom fallback component
const CustomFallback: React.FC = () => <div>Custom error fallback</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress error output in tests
    });
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
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Something went wrong')).toBeDefined();

    fireEvent.press(getByText('Try Again'));

    // Error should be cleared
    expect(queryByText('Something went wrong')).toBeNull();
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