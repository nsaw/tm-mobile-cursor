// src/utils/debugSystem.ts
// Debug system configuration for dual-mount architecture

export interface DebugConfig {
  enabled: boolean;
  level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  environment: 'legacy' | 'nextgen' | 'both';
  logToConsole: boolean;
  logToFile: boolean;
  logFilePath: string;
  maxLogSize: number;
  maxLogFiles: number;
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableComponentDebugging: boolean;
  enableNetworkDebugging: boolean;
  enableStateDebugging: boolean;
}

export interface DebugLog {
  timestamp: number;
  level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  environment: 'legacy' | 'nextgen';
  component?: string;
  message: string;
  data?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  environment: 'legacy' | 'nextgen';
  component?: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
  error: Error;
  component?: string;
  userInfo?: {
    userId?: string;
    sessionId?: string;
    deviceInfo?: any;
  };
  context?: {
    route?: string;
    action?: string;
    state?: any;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  handled: boolean;
}

export interface ComponentDebugInfo {
  componentName: string;
  environment: 'legacy' | 'nextgen';
  props: any;
  state?: any;
  renderCount: number;
  lastRenderTime: number;
  performanceMetrics: PerformanceMetric[];
  errors: ErrorReport[];
}

export interface DebugReport {
  timestamp: number;
  environment: 'legacy' | 'nextgen';
  logs: DebugLog[];
  performanceMetrics: PerformanceMetric[];
  errors: ErrorReport[];
  componentDebugInfo: ComponentDebugInfo[];
  summary: {
    totalLogs: number;
    totalErrors: number;
    totalPerformanceMetrics: number;
    averagePerformance: number;
    errorRate: number;
  };
}

class DebugSystem {
  private config: DebugConfig;
  private logs: DebugLog[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private componentDebugInfo: Map<string, ComponentDebugInfo> = new Map();
  private isInitialized = false;

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = {
      enabled: true,
      level: 'info',
      environment: 'both',
      logToConsole: true,
      logToFile: false,
      logFilePath: './logs/debug.log',
      maxLogSize: 10 * 1024 * 1024, // 10MB
      maxLogFiles: 5,
      enableErrorTracking: true,
      enablePerformanceMonitoring: true,
      enableComponentDebugging: true,
      enableNetworkDebugging: true,
      enableStateDebugging: true,
      ...config,
    };

    this.initialize();
  }

  /**
   * Initialize debug system
   */
  private initialize(): void {
    if (this.isInitialized) return;

    // Set environment variables for dual-mount
    const currentEnvironment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    process.env.EXPO_PUBLIC_ENVIRONMENT = currentEnvironment;

    // Initialize console logging
    if (this.config.logToConsole) {
      this.setupConsoleLogging();
    }

    // Initialize file logging
    if (this.config.logToFile) {
      this.setupFileLogging();
    }

    // Setup error tracking
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    // Setup performance monitoring
    if (this.config.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }

    this.isInitialized = true;
    this.log('info', 'Debug system initialized', { environment: currentEnvironment });
  }

  /**
   * Setup console logging
   */
  private setupConsoleLogging(): void {
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };

    // Override console methods
    console.log = (...args) => {
      this.log('info', args.join(' '));
      originalConsole.log(...args);
    };

    console.warn = (...args) => {
      this.log('warn', args.join(' '));
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      this.log('error', args.join(' '));
      originalConsole.error(...args);
    };

    console.info = (...args) => {
      this.log('info', args.join(' '));
      originalConsole.info(...args);
    };

    console.debug = (...args) => {
      this.log('debug', args.join(' '));
      originalConsole.debug(...args);
    };
  }

  /**
   * Setup file logging
   */
  private setupFileLogging(): void {
    // Simulate file logging setup
    this.log('info', 'File logging configured', { logFilePath: this.config.logFilePath });
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    // Global error handler
    const originalOnError = global.onerror;
    global.onerror = (message, source, lineno, colno, error) => {
      this.trackError(error || new Error(message as string), {
        source,
        lineno,
        colno,
      });
      if (originalOnError) {
        originalOnError(message, source, lineno, colno, error);
      }
    };

    // Unhandled promise rejection handler
    const originalOnUnhandledRejection = global.onunhandledrejection;
    global.onunhandledrejection = (event) => {
      this.trackError(event.reason, { type: 'unhandledRejection' });
      if (originalOnUnhandledRejection && typeof originalOnUnhandledRejection === 'function') {
        (originalOnUnhandledRejection as any).call(globalThis, event);
      }
    };
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor React component renders
    if (this.config.enableComponentDebugging) {
      this.setupComponentMonitoring();
    }

    // Monitor network requests
    if (this.config.enableNetworkDebugging) {
      this.setupNetworkMonitoring();
    }
  }

  /**
   * Setup component monitoring
   */
  private setupComponentMonitoring(): void {
    // This would integrate with React DevTools or custom HOC
    this.log('info', 'Component monitoring enabled');
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    // This would intercept fetch/XMLHttpRequest calls
    this.log('info', 'Network monitoring enabled');
  }

  /**
   * Log a message
   */
  log(level: DebugLog['level'], message: string, data?: any, component?: string): void {
    if (!this.config.enabled) return;

    const logLevels = { error: 0, warn: 1, info: 2, debug: 3, trace: 4 };
    const configLevel = logLevels[this.config.level];
    const messageLevel = logLevels[level];

    if (messageLevel > configLevel) return;

    const environment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    
    const debugLog: DebugLog = {
      timestamp: Date.now(),
      level,
      environment,
      component,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined,
    };

    this.logs.push(debugLog);

    // Emit to console if enabled
    if (this.config.logToConsole) {
      const prefix = `[${environment.toUpperCase()}] [${level.toUpperCase()}]`;
      const componentPrefix = component ? ` [${component}]` : '';
      console.log(`${prefix}${componentPrefix}: ${message}`, data || '');
    }
  }

  /**
   * Track performance metric
   */
  trackPerformance(name: string, component?: string, metadata?: Record<string, any>): string {
    if (!this.config.enablePerformanceMonitoring) return '';

    const environment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    const id = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const metric: PerformanceMetric = {
      id,
      name,
      startTime: Date.now(),
      environment,
      component,
      metadata,
    };

    this.performanceMetrics.push(metric);
    return id;
  }

  /**
   * End performance tracking
   */
  endPerformanceTracking(id: string): void {
    const metric = this.performanceMetrics.find(m => m.id === id);
    if (metric) {
      metric.endTime = Date.now();
      metric.duration = metric.endTime - metric.startTime;
      
      this.log('debug', `Performance metric completed: ${metric.name}`, {
        duration: metric.duration,
        component: metric.component,
      });
    }
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: any, component?: string): void {
    if (!this.config.enableErrorTracking) return;

    const environment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    
    const errorReport: ErrorReport = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      environment,
      error,
      component,
      context,
      severity: this.determineErrorSeverity(error),
      handled: false,
    };

    this.errors.push(errorReport);
    this.log('error', `Error tracked: ${error.message}`, { errorId: errorReport.id, component });
  }

  /**
   * Determine error severity
   */
  private determineErrorSeverity(error: Error): ErrorReport['severity'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) return 'critical';
    if (message.includes('error') || message.includes('exception')) return 'high';
    if (message.includes('warning') || message.includes('deprecated')) return 'medium';
    return 'low';
  }

  /**
   * Track component debug info
   */
  trackComponentDebug(componentName: string, props: any, state?: any): void {
    if (!this.config.enableComponentDebugging) return;

    const environment = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy';
    const existing = this.componentDebugInfo.get(componentName);

    const debugInfo: ComponentDebugInfo = {
      componentName,
      environment,
      props,
      state,
      renderCount: (existing?.renderCount || 0) + 1,
      lastRenderTime: Date.now(),
      performanceMetrics: existing?.performanceMetrics || [],
      errors: existing?.errors || [],
    };

    this.componentDebugInfo.set(componentName, debugInfo);
  }

  /**
   * Generate debug report
   */
  generateDebugReport(environment?: 'legacy' | 'nextgen'): DebugReport {
    const currentEnvironment = environment || (process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true' ? 'nextgen' : 'legacy');
    
    const filteredLogs = this.logs.filter(log => 
      environment ? log.environment === environment : true
    );
    
    const filteredMetrics = this.performanceMetrics.filter(metric => 
      environment ? metric.environment === environment : true
    );
    
    const filteredErrors = this.errors.filter(error => 
      environment ? error.environment === environment : true
    );
    
    const filteredComponents = Array.from(this.componentDebugInfo.values()).filter(component => 
      environment ? component.environment === environment : true
    );

    const totalDuration = filteredMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    const averagePerformance = filteredMetrics.length > 0 ? totalDuration / filteredMetrics.length : 0;
    const errorRate = filteredLogs.length > 0 ? (filteredErrors.length / filteredLogs.length) * 100 : 0;

    const report: DebugReport = {
      timestamp: Date.now(),
      environment: currentEnvironment,
      logs: filteredLogs,
      performanceMetrics: filteredMetrics,
      errors: filteredErrors,
      componentDebugInfo: filteredComponents,
      summary: {
        totalLogs: filteredLogs.length,
        totalErrors: filteredErrors.length,
        totalPerformanceMetrics: filteredMetrics.length,
        averagePerformance,
        errorRate,
      },
    };

    return report;
  }

  /**
   * Clear debug data
   */
  clearDebugData(): void {
    this.logs = [];
    this.performanceMetrics = [];
    this.errors = [];
    this.componentDebugInfo.clear();
    this.log('info', 'Debug data cleared');
  }

  /**
   * Get debug configuration
   */
  getConfig(): DebugConfig {
    return { ...this.config };
  }

  /**
   * Update debug configuration
   */
  updateConfig(updates: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...updates };
    this.log('info', 'Debug configuration updated', updates);
  }

  /**
   * Enable/disable debug system
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.log('info', `Debug system ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Set log level
   */
  setLogLevel(level: DebugConfig['level']): void {
    this.config.level = level;
    this.log('info', `Log level set to: ${level}`);
  }
}

// Export singleton instance
export const debugSystem = new DebugSystem();

// Export utility functions
export function initializeDebugSystem(config?: Partial<DebugConfig>): void {
  if (config) {
    debugSystem.updateConfig(config);
  }
}

export function log(level: DebugLog['level'], message: string, data?: any, component?: string): void {
  debugSystem.log(level, message, data, component);
}

export function trackPerformance(name: string, component?: string, metadata?: Record<string, any>): string {
  return debugSystem.trackPerformance(name, component, metadata);
}

export function endPerformanceTracking(id: string): void {
  debugSystem.endPerformanceTracking(id);
}

export function trackError(error: Error, context?: any, component?: string): void {
  debugSystem.trackError(error, context, component);
}

export function trackComponentDebug(componentName: string, props: any, state?: any): void {
  debugSystem.trackComponentDebug(componentName, props, state);
}

export function generateDebugReport(environment?: 'legacy' | 'nextgen'): DebugReport {
  return debugSystem.generateDebugReport(environment);
}

export function clearDebugData(): void {
  debugSystem.clearDebugData();
}

export function getDebugConfig(): DebugConfig {
  return debugSystem.getConfig();
}

export function updateDebugConfig(updates: Partial<DebugConfig>): void {
  debugSystem.updateConfig(updates);
}

export function setDebugEnabled(enabled: boolean): void {
  debugSystem.setEnabled(enabled);
}

export function setDebugLogLevel(level: DebugConfig['level']): void {
  debugSystem.setLogLevel(level);
} 