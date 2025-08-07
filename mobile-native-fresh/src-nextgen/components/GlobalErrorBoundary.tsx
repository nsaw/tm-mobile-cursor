import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../state/stores/authStore';
import { apiServiceIntegration } from '../services/ApiServiceIntegration';
import { AutoRoleView } from '../shell/wrappers/AutoRoleView';

// Error Boundary State Interface
export interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  recoveryAttempts: number;
}

// Error Boundary Props Interface
export interface GlobalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRecovery?: () => void;
  maxRecoveryAttempts?: number;
  recoveryDelay?: number;
}

// Error Recovery Strategy
export type RecoveryStrategy = 
  | 'immediate'
  | 'delayed'
  | 'manual'
  | 'graceful';

// Error Severity Level
export type ErrorSeverity = 
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

// Error Context
export interface ErrorContext {
  componentName?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  sessionId?: string;
}

/**
 * Global Error Boundary Component
 * 
 * This component provides comprehensive error handling and recovery
 * for the entire application. It integrates with all stores and services
 * to provide intelligent error recovery strategies.
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  private recoveryTimeout?: ReturnType<typeof setTimeout>;
  private errorContext: ErrorContext;

  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      recoveryAttempts: 0,
    };
    this.errorContext = {
      timestamp: Date.now(),
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({ errorInfo });

    // Update error context
    this.errorContext = {
      ...this.errorContext,
      componentName: errorInfo.componentStack?.split('\n')[1]?.trim(),
      timestamp: Date.now(),
    };

    // Log error to analytics
    this.logError(error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Determine recovery strategy
    const strategy = this.determineRecoveryStrategy(error);
    this.executeRecoveryStrategy(strategy);
  }

  private logError = (error: Error, errorInfo: ErrorInfo): void => {
    try {
      // Log to error service
      apiServiceIntegration.handleError('Global Error Boundary', error);

      // Log to console for debugging
      console.error('Global Error Boundary caught error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        context: this.errorContext,
        errorId: this.state.errorId,
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  private determineRecoveryStrategy = (error: Error): RecoveryStrategy => {
    const { recoveryAttempts } = this.state;
    const maxAttempts = this.props.maxRecoveryAttempts || 3;

    // If we've exceeded max attempts, use graceful degradation
    if (recoveryAttempts >= maxAttempts) {
      return 'graceful';
    }

    // Determine strategy based on error type
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return 'delayed';
    }

    if (error.name === 'AuthenticationError' || error.message.includes('auth')) {
      return 'manual';
    }

    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return 'immediate';
    }

    // Default to immediate recovery for unknown errors
    return 'immediate';
  };

  private executeRecoveryStrategy = (strategy: RecoveryStrategy): void => {
    const { recoveryDelay = 1000 } = this.props;

    switch (strategy) {
      case 'immediate':
        this.attemptRecovery();
        break;

      case 'delayed':
        this.recoveryTimeout = setTimeout(() => {
          this.attemptRecovery();
        }, recoveryDelay);
        break;

      case 'manual':
        this.showManualRecoveryDialog();
        break;

      case 'graceful':
        this.performGracefulDegradation();
        break;
    }
  };

  private attemptRecovery = (): void => {
    const { recoveryAttempts } = this.state;
    const maxAttempts = this.props.maxRecoveryAttempts || 3;

    if (recoveryAttempts >= maxAttempts) {
      this.performGracefulDegradation();
      return;
    }

    try {
      // Clear error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        recoveryAttempts: recoveryAttempts + 1,
      });

      // Call recovery callback
      if (this.props.onRecovery) {
        this.props.onRecovery();
      }

      console.log(`✅ Error recovery attempted (${recoveryAttempts + 1}/${maxAttempts})`);
    } catch (recoveryError) {
      console.error('Recovery attempt failed:', recoveryError);
      this.setState({ hasError: true });
    }
  };

  private showManualRecoveryDialog = (): void => {
    Alert.alert(
      'Application Error',
      'An error occurred. Would you like to try to recover?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => this.performGracefulDegradation(),
        },
        {
          text: 'Retry',
          onPress: () => this.attemptRecovery(),
        },
      ]
    );
  };

  private performGracefulDegradation = (): void => {
    // Clear auth state if it's an auth error
    if (this.state.error?.message.includes('auth')) {
      try {
        const authStore = useAuthStore.getState();
        authStore.clearUser();
        authStore.setAuthenticated(false);
      } catch (error) {
        console.error('Failed to clear auth state:', error);
      }
    }

    // Show fallback UI
    this.setState({
      hasError: true,
      error: new Error('Application degraded due to repeated errors'),
    });

    console.log('⚠️ Application degraded due to repeated errors');
  };

  private handleRetry = (): void => {
    this.attemptRecovery();
  };

  private handleReset = (): void => {
    // Reset to initial state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      recoveryAttempts: 0,
    });

    // Clear any recovery timeout
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }

    console.log('🔄 Application state reset');
  };

  componentWillUnmount(): void {
    // Clear any pending recovery timeout
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <AutoRoleView layoutRole="container-main" style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>
              {error?.message || 'An unexpected error occurred'}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.resetButton} onPress={this.handleReset}>
                <Text style={styles.buttonText}>Reset App</Text>
              </TouchableOpacity>
            </View>

            {__DEV__ && errorInfo && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>{errorInfo.componentStack}</Text>
              </View>
            )}
          </View>
        </AutoRoleView>
      );
    }

    return children;
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0F',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    maxWidth: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
});

export default GlobalErrorBoundary; 