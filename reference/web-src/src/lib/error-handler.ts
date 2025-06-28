/**
 * Comprehensive Error Handling System
 * Provides graceful error handling with user-friendly messages and recovery options
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  context?: ErrorContext;
  originalError?: any;
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  isPrimary?: boolean;
}

class ErrorHandlerSystem {
  private errorLog: ErrorDetails[] = [];
  private maxLogSize = 100;
  private errorListeners: ((error: ErrorDetails) => void)[] = [];

  /**
   * Register error listener
   */
  onError(listener: (error: ErrorDetails) => void): () => void {
    this.errorListeners.push(listener);
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Handle different types of errors with appropriate user messages
   */
  handleError(
    error: any,
    context: ErrorContext = {},
    customMessage?: string
  ): ErrorDetails {
    const errorDetails = this.categorizeError(error, context, customMessage);
    
    // Log the error
    this.logError(errorDetails);
    
    // Notify listeners
    this.errorListeners.forEach(listener => {
      try {
        listener(errorDetails);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });

    return errorDetails;
  }

  /**
   * Categorize error and provide appropriate user message
   */
  private categorizeError(
    error: any,
    context: ErrorContext,
    customMessage?: string
  ): ErrorDetails {
    const timestamp = Date.now();
    const enhancedContext: ErrorContext = {
      ...context,
      timestamp,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Network errors
    if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message,
        userMessage: customMessage || 'Network connection issue. Please check your internet connection and try again.',
        severity: 'medium',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // Authentication errors
    if (error?.message?.includes('auth') || error?.status === 401) {
      return {
        code: 'AUTH_ERROR',
        message: error.message || 'Authentication failed',
        userMessage: customMessage || 'Your session has expired. Please sign in again.',
        severity: 'high',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // Permission errors
    if (error?.status === 403) {
      return {
        code: 'PERMISSION_ERROR',
        message: error.message || 'Permission denied',
        userMessage: customMessage || 'You don\'t have permission to perform this action.',
        severity: 'medium',
        recoverable: false,
        context: enhancedContext,
        originalError: error
      };
    }

    // Not found errors
    if (error?.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: error.message || 'Resource not found',
        userMessage: customMessage || 'The requested item could not be found.',
        severity: 'low',
        recoverable: false,
        context: enhancedContext,
        originalError: error
      };
    }

    // Server errors
    if (error?.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: error.message || 'Server error',
        userMessage: customMessage || 'Server is temporarily unavailable. Please try again in a moment.',
        severity: 'high',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // Validation errors
    if (error?.name === 'ValidationError' || error?.code === 'VALIDATION_ERROR') {
      return {
        code: 'VALIDATION_ERROR',
        message: error.message,
        userMessage: customMessage || 'Please check your input and try again.',
        severity: 'low',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // PIN authentication specific errors
    if (error?.message?.includes('PIN')) {
      return {
        code: 'PIN_ERROR',
        message: error.message,
        userMessage: customMessage || 'PIN authentication failed. Please try again or use email login.',
        severity: 'medium',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // Database errors
    if (error?.message?.includes('database') || error?.code?.includes('DB')) {
      return {
        code: 'DATABASE_ERROR',
        message: error.message,
        userMessage: customMessage || 'Data storage issue. Your changes may not be saved. Please try again.',
        severity: 'high',
        recoverable: true,
        context: enhancedContext,
        originalError: error
      };
    }

    // Generic application errors
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'Unknown error occurred',
      userMessage: customMessage || 'Something went wrong. Please try again or contact support if the problem persists.',
      severity: 'medium',
      recoverable: true,
      context: enhancedContext,
      originalError: error
    };
  }

  /**
   * Log error with rotation
   */
  private logError(errorDetails: ErrorDetails): void {
    this.errorLog.unshift(errorDetails);
    
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`[ERROR] ${errorDetails.code} - ${errorDetails.severity}`);
      console.error('User Message:', errorDetails.userMessage);
      console.error('Technical Message:', errorDetails.message);
      console.error('Context:', errorDetails.context);
      console.error('Original Error:', errorDetails.originalError);
      console.groupEnd();
    }
  }

  /**
   * Get error history
   */
  getErrorHistory(): ErrorDetails[] {
    return [...this.errorLog];
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorLog = [];
  }

  /**
   * Get common recovery actions for error types
   */
  getRecoveryActions(errorCode: string): ErrorRecoveryAction[] {
    const actions: Record<string, ErrorRecoveryAction[]> = {
      NETWORK_ERROR: [
        {
          label: 'Retry',
          action: () => window.location.reload(),
          isPrimary: true
        },
        {
          label: 'Check Connection',
          action: () => {
            if (navigator.onLine) {
              alert('Your device appears to be online. The issue may be temporary.');
            } else {
              alert('Your device is offline. Please check your internet connection.');
            }
          }
        }
      ],
      AUTH_ERROR: [
        {
          label: 'Sign In Again',
          action: () => {
            localStorage.clear();
            window.location.href = '/auth';
          },
          isPrimary: true
        }
      ],
      SERVER_ERROR: [
        {
          label: 'Try Again',
          action: () => window.location.reload(),
          isPrimary: true
        },
        {
          label: 'Wait and Retry',
          action: () => {
            setTimeout(() => window.location.reload(), 5000);
          }
        }
      ],
      PIN_ERROR: [
        {
          label: 'Try PIN Again',
          action: () => {
            // Clear PIN input if available
            const pinInputs = document.querySelectorAll('input[type="password"], input[inputmode="numeric"]');
            pinInputs.forEach(input => (input as HTMLInputElement).value = '');
          },
          isPrimary: true
        },
        {
          label: 'Use Email Login',
          action: () => {
            const event = new CustomEvent('switchToEmailLogin');
            window.dispatchEvent(event);
          }
        }
      ]
    };

    return actions[errorCode] || [
      {
        label: 'Try Again',
        action: () => window.location.reload(),
        isPrimary: true
      }
    ];
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(errorCode: string): boolean {
    const nonRecoverableErrors = ['PERMISSION_ERROR', 'NOT_FOUND'];
    return !nonRecoverableErrors.includes(errorCode);
  }

  /**
   * Export error log for debugging
   */
  exportErrorLog(): string {
    return JSON.stringify(this.errorLog, null, 2);
  }

  /**
   * Handle async operations with error catching
   */
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: ErrorContext = {},
    customMessage?: string
  ): Promise<{ success: boolean; data?: T; error?: ErrorDetails }> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      const errorDetails = this.handleError(error, context, customMessage);
      return { success: false, error: errorDetails };
    }
  }

  /**
   * Handle sync operations with error catching
   */
  withSyncErrorHandling<T>(
    operation: () => T,
    context: ErrorContext = {},
    customMessage?: string
  ): { success: boolean; data?: T; error?: ErrorDetails } {
    try {
      const data = operation();
      return { success: true, data };
    } catch (error) {
      const errorDetails = this.handleError(error, context, customMessage);
      return { success: false, error: errorDetails };
    }
  }
}

export const errorHandler = new ErrorHandlerSystem();