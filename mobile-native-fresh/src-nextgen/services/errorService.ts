export interface ErrorInfo {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface ErrorReport {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: Record<string, unknown>;
}

export class ErrorService {
  static captureError(error: Error, context?: Record<string, unknown>): void {
    // TODO: Implement real error reporting
    console.error('Error Captured:', error, context);
  }

  static captureException(exception: ErrorReport): void {
    // TODO: Implement real exception reporting
    console.error('Exception Captured:', exception);
  }

  static setUserContext(userId: string, userProperties?: Record<string, unknown>): void {
    // TODO: Implement real user context setting
    console.log('User Context Set:', userId, userProperties);
  }

  static addBreadcrumb(message: string, category?: string, data?: Record<string, unknown>): void {
    // TODO: Implement real breadcrumb tracking
    console.log('Breadcrumb:', message, category, data);
  }

  static setTag(key: string, value: string): void {
    // TODO: Implement real tag setting
    console.log('Tag Set:', key, value);
  }

  static reportError(error: Error, context?: Record<string, unknown>): void {
    // TODO: Implement real error reporting
    console.error('Error Reported:', error, context);
  }
}

export const errorService = ErrorService; 