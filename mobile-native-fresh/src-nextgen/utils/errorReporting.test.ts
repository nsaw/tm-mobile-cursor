import {
  ConsoleErrorReporter,
  reportError,
  reportBoundaryError,
  setErrorReporterUser,
  setErrorReporterVersion,
  setErrorReporterEnvironment,
} from './errorReporting';

describe('Error Reporting', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('ConsoleErrorReporter', () => {
    let reporter: ConsoleErrorReporter;

    beforeEach(() => {
      reporter = new ConsoleErrorReporter();
    });

    it('should report error with basic information', () => {
      const error = new Error('Test error');
      const additionalData = { test: 'data' };

      reporter.report(error, additionalData);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        message: 'Test error',
        stack: error.stack,
        timestamp: expect.any(String),
        environment: 'legacy',
        version: '1.0.0',
        platform: 'react-native',
        additionalData,
      }));
    });

    it('should report boundary error with component stack', () => {
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'Component stack trace' };
      const additionalData = { test: 'data' };

      reporter.reportBoundary(error, errorInfo, additionalData);

      expect(consoleSpy).toHaveBeenCalledWith('Error Boundary Report:', expect.objectContaining({
        message: 'Test error',
        stack: error.stack,
        componentStack: 'Component stack trace',
        timestamp: expect.any(String),
        environment: 'legacy',
        version: '1.0.0',
        platform: 'react-native',
        additionalData,
      }));
    });

    it('should set user ID', () => {
      const userId = 'test-user-123';
      reporter.setUser(userId);

      const error = new Error('Test error');
      reporter.report(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        userId,
      }));
    });

    it('should set version', () => {
      const version = '2.0.0';
      reporter.setVersion(version);

      const error = new Error('Test error');
      reporter.report(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        version,
      }));
    });

    it('should set environment', () => {
      const environment = 'nextgen' as const;
      reporter.setEnvironment(environment);

      const error = new Error('Test error');
      reporter.report(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        environment,
      }));
    });
  });

  describe('Global error reporter functions', () => {
    it('should report error using global reporter', () => {
      const error = new Error('Test error');
      reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        message: 'Test error',
      }));
    });

    it('should report boundary error using global reporter', () => {
      const error = new Error('Test error');
      const errorInfo = { componentStack: 'Component stack trace' };
      reportBoundaryError(error, errorInfo);

      expect(consoleSpy).toHaveBeenCalledWith('Error Boundary Report:', expect.objectContaining({
        message: 'Test error',
        componentStack: 'Component stack trace',
      }));
    });

    it('should set user ID on global reporter', () => {
      const userId = 'test-user-123';
      setErrorReporterUser(userId);

      const error = new Error('Test error');
      reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        userId,
      }));
    });

    it('should set version on global reporter', () => {
      const version = '2.0.0';
      setErrorReporterVersion(version);

      const error = new Error('Test error');
      reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        version,
      }));
    });

    it('should set environment on global reporter', () => {
      const environment = 'nextgen' as const;
      setErrorReporterEnvironment(environment);

      const error = new Error('Test error');
      reportError(error);

      expect(consoleSpy).toHaveBeenCalledWith('Error Report:', expect.objectContaining({
        environment,
      }));
    });
  });
}); 