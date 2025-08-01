import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react-native';

import { useTheme } from '../theme/theme';
import { Button } from './ui/Button';
import { AutoRoleView } from './AutoRoleView';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  timestamp: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  environment?: 'legacy' | 'nextgen';
  componentName?: string;
}

interface ErrorReport {
  errorId: string;
  timestamp: number;
  environment: string;
  componentName?: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  errorInfo: {
    componentStack: string;
  };
  userAgent?: string;
  platform?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      timestamp: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error report (in production, this would go to a service like Sentry)
    this.sendErrorReport(error, errorInfo);
  }

  private sendErrorReport(error: Error, errorInfo: ErrorInfo) {
    const errorReport: ErrorReport = {
      errorId: this.state.errorId,
      timestamp: this.state.timestamp,
      environment: this.props.environment || 'unknown',
      componentName: this.props.componentName || 'Unknown',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      userAgent: 'React Native',
      platform: 'mobile',
    };

    // In production, send to error reporting service
    // For now, just log to console
    console.log('Error Report:', JSON.stringify(errorReport, null, 2));
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      timestamp: 0,
    });
  };

  private handleGoHome = () => {
    // Navigate to home screen
    // This would typically use navigation.navigate('Home')
    console.log('Navigating to home screen');
  };

  private handleReportBug = () => {
    // Open bug reporting interface
    console.log('Opening bug report interface');
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <ErrorFallbackUI 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        environment={this.props.environment}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        onReportBug={this.handleReportBug}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackUIProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  environment?: string;
  onRetry: () => void;
  onGoHome: () => void;
  onReportBug: () => void;
}

const ErrorFallbackUI: React.FC<ErrorFallbackUIProps> = ({
  error,
  errorInfo,
  errorId,
  environment,
  onRetry,
  onGoHome,
  onReportBug,
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.xl,
      flexGrow: 1,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.error,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: typography.sizes.md,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: spacing.xl,
      lineHeight: typography.lineHeights.md,
    },
    errorId: {
      fontSize: typography.sizes.sm,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: spacing.lg,
      fontFamily: 'monospace',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
    },
    retryButton: {
      backgroundColor: colors.accent,
    },
    homeButton: {
      backgroundColor: colors.success,
    },
    reportButton: {
      backgroundColor: colors.warning,
    },
    buttonText: {
      color: colors.background,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    detailsContainer: {
      marginTop: spacing.xl,
      padding: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    detailsTitle: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    detailsText: {
      fontSize: typography.sizes.sm,
      color: colors.textMuted,
      fontFamily: 'monospace',
      lineHeight: typography.lineHeights.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <AutoRoleView layoutRole="screen" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorContainer}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={40} color={colors.background} />
            </View>
            
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>
              We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
            </Text>
            
            <Text style={styles.errorId}>Error ID: {errorId}</Text>
            
            <View style={styles.buttonRow}>
              <Button onPress={onRetry} style={[styles.button, styles.retryButton]}>
                <RefreshCw size={16} color={colors.background} />
                <Text style={styles.buttonText}> Retry</Text>
              </Button>
              
              <Button onPress={onGoHome} style={[styles.button, styles.homeButton]}>
                <Home size={16} color={colors.background} />
                <Text style={styles.buttonText}> Home</Text>
              </Button>
            </View>
            
            <Button onPress={onReportBug} style={[styles.button, styles.reportButton]}>
              <Bug size={16} color={colors.background} />
              <Text style={styles.buttonText}> Report Bug</Text>
            </Button>

            {/* Error details for development */}
            {__DEV__ && error && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Error Details (Development Only)</Text>
                <Text style={styles.detailsText}>
                  Environment: {environment || 'unknown'}{'\n'}
                  Error: {error.name}: {error.message}{'\n'}
                  Stack: {error.stack}
                </Text>
                {errorInfo && (
                  <Text style={styles.detailsText}>
                    Component Stack: {errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </AutoRoleView>
    </SafeAreaView>
  );
};

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  return (props: P) => (
    <ErrorBoundary
      environment="nextgen"
      componentName={WrappedComponent.displayName || WrappedComponent.name}
      {...errorBoundaryProps}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
};

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In production, send to error reporting service
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      timestamp: Date.now(),
      environment: 'nextgen',
    };
    
    console.log('Error Report:', JSON.stringify(errorReport, null, 2));
  };

  return { handleError };
}; 