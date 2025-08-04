import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useAccessibility } from '../hooks/useAccessibility';
import { useUIStore } from '../state/stores/uiStore';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (
      this.props.resetOnPropsChange &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const { tokens } = useTheme();
  const { isScreenReaderEnabled } = useAccessibility();
  const { setError } = useUIStore();

  React.useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.background,
    },
    title: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.bold as any,
      color: tokens.colors.error,
      marginBottom: tokens.spacing.md,
      textAlign: 'center',
    },
    message: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
      marginBottom: tokens.spacing.lg,
      textAlign: 'center',
      lineHeight: 1.5,
    },
    button: {
      backgroundColor: tokens.colors.accent,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderRadius: 8,
    },
    buttonText: {
      color: tokens.colors.background,
      fontSize: tokens.typography.fontSize.body,
      fontWeight: tokens.typography.fontWeight.medium as any,
    },
  });

  return (
    <View style={styles.container} accessible={isScreenReaderEnabled}>
      <Text style={styles.title} accessibilityRole="header">
        Something went wrong
      </Text>
      <Text style={styles.message} accessibilityRole="text">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        accessibilityHint="Press to retry the operation"
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}; 