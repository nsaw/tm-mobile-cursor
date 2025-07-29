import React from 'react';
import performanceMonitor from '../utils/PerformanceMonitor';
import { ValidationSystem } from '../utils/ValidationSystem';

// Error types
export interface ErrorInfo {
  error: Error;
  errorInfo: React.ErrorInfo;
  componentStack: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  recoveryAttempts: number;
  lastRecoveryTime: number;
}

export interface ErrorRecoveryStrategy {
  maxAttempts: number;
  backoffDelay: number;
  recoveryActions: Array<() => Promise<void>>;
}

export class ErrorBoundarySystem {
  private static instance: ErrorBoundarySystem;
  private performanceMonitor: typeof performanceMonitor;
  private validationSystem: ValidationSystem;
  private errors: ErrorInfo[] = [];
  private recoveryStrategies: Map<string, ErrorRecoveryStrategy> = new Map();
  private listeners: Array<(error: ErrorInfo) => void> = [];

  private constructor() {
    this.performanceMonitor = performanceMonitor;
    this.validationSystem = ValidationSystem.getInstance();
  }

  public static getInstance(): ErrorBoundarySystem {
    if (!ErrorBoundarySystem.instance) {
      ErrorBoundarySystem.instance = new ErrorBoundarySystem();
    }
    return ErrorBoundarySystem.instance;
  }

  public async handleError(error: Error, errorInfo: React.ErrorInfo, context: string): Promise<void> {
    try {
      const startTime = Date.now();

      // Create error info
      const errorInfoObj: ErrorInfo = {
        error,
        errorInfo,
        componentStack: errorInfo.componentStack,
        timestamp: Date.now(),
        severity: this.calculateSeverity(error, context),
        context,
      };

      // Validate error handling
      const validationResult = await this.validationSystem.validateErrorHandling(errorInfoObj);
      if (!validationResult.isValid) {
        console.warn('Error validation failed:', validationResult.errors);
      }

      // Add to errors list
      this.errors.push(errorInfoObj);

      // Record performance metrics
      const handlingTime = Date.now() - startTime;
      this.performanceMonitor.recordErrorHandlingMetrics(context, handlingTime, 'nextgen');

      // Notify listeners
      this.notifyListeners(errorInfoObj);

      // Attempt recovery if strategy exists
      await this.attemptRecovery(context, errorInfoObj);

    } catch (recoveryError) {
      console.error('Error handling failed:', recoveryError);
    }
  }

  private calculateSeverity(error: Error, context: string): 'low' | 'medium' | 'high' | 'critical' {
    // Simple severity calculation based on error type and context
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }
    if (context.includes('critical') || context.includes('auth') || context.includes('payment')) {
      return 'critical';
    }
    if (context.includes('ui') || context.includes('render')) {
      return 'medium';
    }
    return 'low';
  }

  private async attemptRecovery(context: string, errorInfo: ErrorInfo): Promise<void> {
    const strategy = this.recoveryStrategies.get(context);
    if (!strategy) return;

    try {
      for (let attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
        try {
          // Execute recovery actions
          for (const action of strategy.recoveryActions) {
            await action();
          }

          console.log(`Recovery successful for ${context} on attempt ${attempt}`);
          return;

        } catch (recoveryError) {
          console.warn(`Recovery attempt ${attempt} failed for ${context}:`, recoveryError);

          if (attempt === strategy.maxAttempts) {
            throw new Error(`Recovery failed after ${strategy.maxAttempts} attempts`);
          }

          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, strategy.backoffDelay * attempt));
        }
      }
    } catch (error) {
      console.error(`Recovery failed for ${context}:`, error);
    }
  }

  public addRecoveryStrategy(context: string, strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.set(context, strategy);
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public addListener(listener: (error: ErrorInfo) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(error: ErrorInfo): void {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error listener failed:', listenerError);
      }
    });
  }

  public destroy(): void {
    this.errors = [];
    this.recoveryStrategies.clear();
    this.listeners = [];
    this.validationSystem.destroy();
  }
}

export class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorInfo: React.ErrorInfo }>;
  context?: string;
}, ErrorBoundaryState> {
  private errorSystem: ErrorBoundarySystem;

  constructor(props: any) {
    super(props);
    this.errorSystem = ErrorBoundarySystem.getInstance();
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      recoveryAttempts: 0,
      lastRecoveryTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const context = this.props.context || 'unknown';
    this.errorSystem.handleError(error, errorInfo, context);

    this.setState(prevState => ({
      errorInfo,
      recoveryAttempts: prevState.recoveryAttempts + 1,
      lastRecoveryTime: Date.now(),
    }));
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} errorInfo={this.state.errorInfo!} />;
      }

      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export const useErrorBoundary = () => {
  const errorSystem = ErrorBoundarySystem.getInstance();
  const [errors, setErrors] = React.useState(errorSystem.getErrors());

  React.useEffect(() => {
    const unsubscribe = errorSystem.addListener((error) => {
      setErrors(errorSystem.getErrors());
    });
    return unsubscribe;
  }, []);

  return {
    errors,
    clearErrors: errorSystem.clearErrors.bind(errorSystem),
    addRecoveryStrategy: errorSystem.addRecoveryStrategy.bind(errorSystem),
  };
}; 