export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userId?: string;
  environment: 'legacy' | 'nextgen';
  version: string;
  platform: string;
  additionalData?: Record<string, any>;
}

export interface ErrorReporter {
  report: (error: Error, additionalData?: Record<string, any>) => void;
  reportBoundary: (error: Error, errorInfo: any, additionalData?: Record<string, any>) => void;
  setUser: (userId: string) => void;
  setVersion: (version: string) => void;
  setEnvironment: (environment: 'legacy' | 'nextgen') => void;
}

export class ConsoleErrorReporter implements ErrorReporter {
  private userId?: string;
  private version = '1.0.0';
  private environment: 'legacy' | 'nextgen' = 'legacy';

  report(error: Error, additionalData?: Record<string, any>): void {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      environment: this.environment,
      version: this.version,
      platform: 'react-native',
      additionalData,
    };

    console.error('Error Report:', report);
  }

  reportBoundary(error: Error, errorInfo: any, additionalData?: Record<string, any>): void {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      environment: this.environment,
      version: this.version,
      platform: 'react-native',
      additionalData,
    };

    console.error('Error Boundary Report:', report);
  }

  setUser(userId: string): void {
    this.userId = userId;
  }

  setVersion(version: string): void {
    this.version = version;
  }

  setEnvironment(environment: 'legacy' | 'nextgen'): void {
    this.environment = environment;
  }
}

export const errorReporter = new ConsoleErrorReporter();

export const reportError = (error: Error, additionalData?: Record<string, any>): void => {
  errorReporter.report(error, additionalData);
};

export const reportBoundaryError = (error: Error, errorInfo: any, additionalData?: Record<string, any>): void => {
  errorReporter.reportBoundary(error, errorInfo, additionalData);
};

export const setErrorReporterUser = (userId: string): void => {
  errorReporter.setUser(userId);
};

export const setErrorReporterVersion = (version: string): void => {
  errorReporter.setVersion(version);
};

export const setErrorReporterEnvironment = (environment: 'legacy' | 'nextgen'): void => {
  errorReporter.setEnvironment(environment);
}; 