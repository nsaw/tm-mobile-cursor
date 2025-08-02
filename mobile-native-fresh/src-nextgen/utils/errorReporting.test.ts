import { ConsoleErrorReporter, reportError, reportBoundaryError } from './errorReporting';

describe('ConsoleErrorReporter', () => {
  let reporter: ConsoleErrorReporter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    reporter = new ConsoleErrorReporter();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console output in tests
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should report errors with default configuration', () => {
    const error = new Error('Test error');
    
    reporter.report(error);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        message: 'Test error',
        timestamp: expect.any(String),
        environment: 'nextgen',
        version: '1.0.0',
        platform: expect.any(String),
      })
    );
  });

  it('should report boundary errors with component stack', () => {
    const error = new Error('Boundary error');
    const errorInfo = { componentStack: 'Component stack trace' };
    
    reporter.reportBoundary(error, errorInfo);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Boundary Report:',
      expect.objectContaining({
        message: 'Boundary error',
        componentStack: 'Component stack trace',
        timestamp: expect.any(String),
        environment: 'nextgen',
        version: '1.0.0',
        platform: expect.any(String),
      })
    );
  });

  it('should include additional data in reports', () => {
    const error = new Error('Test error');
    const additionalData = { userId: '123', action: 'test' };
    
    reporter.report(error, additionalData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        additionalData: { userId: '123', action: 'test' },
      })
    );
  });

  it('should update user ID when set', () => {
    const error = new Error('Test error');
    
    reporter.setUser('user123');
    reporter.report(error);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        userId: 'user123',
      })
    );
  });

  it('should update version when set', () => {
    const error = new Error('Test error');
    
    reporter.setVersion('2.0.0');
    reporter.report(error);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        version: '2.0.0',
      })
    );
  });

  it('should update environment when set', () => {
    const error = new Error('Test error');
    
    reporter.setEnvironment('legacy');
    reporter.report(error);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        environment: 'legacy',
      })
    );
  });
});

describe('reportError', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console output in tests
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should report errors using default reporter', () => {
    const error = new Error('Test error');
    
    reportError(error);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        message: 'Test error',
      })
    );
  });

  it('should include additional data when provided', () => {
    const error = new Error('Test error');
    const additionalData = { context: 'test' };
    
    reportError(error, additionalData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Report:',
      expect.objectContaining({
        additionalData: { context: 'test' },
      })
    );
  });
});

describe('reportBoundaryError', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console output in tests
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should report boundary errors using default reporter', () => {
    const error = new Error('Boundary error');
    const errorInfo = { componentStack: 'Stack trace' };
    
    reportBoundaryError(error, errorInfo);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Boundary Report:',
      expect.objectContaining({
        message: 'Boundary error',
        componentStack: 'Stack trace',
      })
    );
  });

  it('should include additional data when provided', () => {
    const error = new Error('Boundary error');
    const errorInfo = { componentStack: 'Stack trace' };
    const additionalData = { component: 'TestComponent' };
    
    reportBoundaryError(error, errorInfo, additionalData);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error Boundary Report:',
      expect.objectContaining({
        additionalData: { component: 'TestComponent' },
      })
    );
  });
}); 