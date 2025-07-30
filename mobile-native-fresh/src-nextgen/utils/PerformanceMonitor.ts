import React from 'react';
import { Platform } from 'react-native';

// React Native Performance API fallbacks with error boundary
let PerformanceObserver: any;
let PerformanceEntry: any;
let performanceAPI: any;

// Error boundary for performance collection failures
class PerformanceErrorBoundary {
  private static instance: PerformanceErrorBoundary;
  private errorCount = 0;
  private maxErrors = 10;
  private fallbackMode = false;

  public static getInstance(): PerformanceErrorBoundary {
    if (!PerformanceErrorBoundary.instance) {
      PerformanceErrorBoundary.instance = new PerformanceErrorBoundary();
    }
    return PerformanceErrorBoundary.instance;
  }

  public handleError(error: Error, context: string): void {
    this.errorCount++;
    console.warn(`Performance collection error in ${context}:`, error);
    
    if (this.errorCount >= this.maxErrors) {
      this.fallbackMode = true;
      console.warn('Performance monitoring switched to fallback mode due to repeated errors');
    }
  }

  public isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  public reset(): void {
    this.errorCount = 0;
    this.fallbackMode = false;
  }
}

// Memory leak tracking
interface MemoryLeakInfo {
  timestamp: number;
  memoryUsage: number;
  componentName: string;
  stack: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Baseline benchmark assertions
interface PerformanceBaseline {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
}

interface PerformanceRegressionReport {
  hasRegression: boolean;
  regressions: Array<{
    metric: string;
    baseline: number;
    current: number;
    degradation: number;
  }>;
  timestamp: number;
}

// Memory threshold violations
interface MemoryThresholdViolation {
  timestamp: number;
  currentUsage: number;
  threshold: number;
  severity: 'warning' | 'critical';
}

try {
  if (Platform.OS === 'web') {
    PerformanceObserver = global.PerformanceObserver;
    PerformanceEntry = global.PerformanceEntry;
    performanceAPI = global.performance;
  } else {
    // React Native doesn't have native Performance API - use native fallbacks
    PerformanceObserver = null;
    PerformanceEntry = null;
    performanceAPI = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
    };
  }
} catch (error) {
  const errorBoundary = PerformanceErrorBoundary.getInstance();
  errorBoundary.handleError(error as Error, 'Performance API initialization');
  
  // Fallback to basic timing
  PerformanceObserver = null;
  PerformanceEntry = null;
  performanceAPI = {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
  };
}

// Performance monitoring utility for AutoRoleView and other components

interface PerformanceMetrics {
  componentName: string;
  context: string;
  renderTime: number;
  mountTime: number;
  unmountTime?: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
}

interface PerformanceMonitorHook {
  recordComponentRender: (componentName: string, context: string) => (startTime?: number) => () => void;
  getMetrics: () => PerformanceMetrics[];
  clearMetrics: () => void;
  logMetrics: () => void;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor | null = null;
  private metrics: PerformanceMetrics[] = [];
  private startTimes: Map<string, number> = new Map();
  private memoryLeaks: Array<{ timestamp: number; memoryUsage: number; stack: string }> = [];
  private memoryThresholdViolations: MemoryThresholdViolation[] = [];
  private activeIntervals: NodeJS.Timeout[] = [];

  private constructor() {
    // Private constructor for singleton pattern
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordComponentRender(componentName: string, context: string) {
    return (startTime?: number) => {
      const actualStartTime = startTime || Date.now();
      const key = `${componentName}-${context}`;
      this.startTimes.set(key, actualStartTime);

      return () => {
        const endTime = Date.now();
        const renderTime = endTime - actualStartTime;
        
        this.metrics.push({
          componentName,
          context,
          renderTime,
          mountTime: actualStartTime,
          unmountTime: endTime,
          memoryUsage: this.getCurrentMemoryUsage(),
          bundleSize: this.getBundleSize(),
          startupTime: this.getStartupTime(),
          dualMountOverhead: this.calculateDualMountOverhead(),
          timestamp: Date.now(),
          environment: 'nextgen',
        });

        this.startTimes.delete(key);
      };
    };
  }

  recordComponentMetrics(componentName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    this.metrics.push({
      componentName,
      context: 'component',
      renderTime,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    });
  }

  recordScreenMetrics(screenName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    this.metrics.push({
      componentName: screenName,
      context: 'screen',
      renderTime,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    });
  }

  recordNavigationMetrics(routeName: string, navigationTime: number, environment: 'legacy' | 'nextgen'): void {
    this.metrics.push({
      componentName: routeName,
      context: 'navigation',
      renderTime: navigationTime,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    });
  }

  recordStateUpdateMetrics(key: string, updateTime: number, environment: 'legacy' | 'nextgen'): void {
    this.metrics.push({
      componentName: key,
      context: 'state_update',
      renderTime: updateTime,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    });
  }

  recordErrorHandlingMetrics(context: string, handlingTime: number, environment: 'legacy' | 'nextgen'): void {
    this.metrics.push({
      componentName: context,
      context: 'error_handling',
      renderTime: handlingTime,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    });
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getCurrentMetrics(): PerformanceMetrics {
    return {
      componentName: 'current',
      context: 'current',
      renderTime: 0,
      mountTime: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment: 'nextgen',
    };
  }

  getPerformanceReport(): {
    currentMetrics: PerformanceMetrics[];
    memoryLeaks: Array<{ timestamp: number; memoryUsage: number; stack: string }>;
    memoryThresholdViolations: MemoryThresholdViolation[];
  } {
    return {
      currentMetrics: this.metrics,
      memoryLeaks: this.memoryLeaks,
      memoryThresholdViolations: this.memoryThresholdViolations,
    };
  }

  establishBaseline(): { legacy: PerformanceBaseline; nextgen: PerformanceBaseline } {
    const legacyMetrics = this.metrics.filter(m => m.environment === 'legacy');
    const nextgenMetrics = this.metrics.filter(m => m.environment === 'nextgen');

    const legacyBaseline: PerformanceBaseline = {
      renderTime: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.renderTime, 0) / legacyMetrics.length : 0,
      memoryUsage: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / legacyMetrics.length : 0,
      bundleSize: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / legacyMetrics.length : 0,
      startupTime: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.startupTime, 0) / legacyMetrics.length : 0,
      dualMountOverhead: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / legacyMetrics.length : 0,
      timestamp: Date.now(),
    };

    const nextgenBaseline: PerformanceBaseline = {
      renderTime: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.renderTime, 0) / nextgenMetrics.length : 0,
      memoryUsage: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / nextgenMetrics.length : 0,
      bundleSize: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / nextgenMetrics.length : 0,
      startupTime: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.startupTime, 0) / nextgenMetrics.length : 0,
      dualMountOverhead: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / nextgenMetrics.length : 0,
      timestamp: Date.now(),
    };

    return { legacy: legacyBaseline, nextgen: nextgenBaseline };
  }

  checkPerformanceTargets(environment: 'legacy' | 'nextgen'): { passed: boolean; violations: string[] } {
    const environmentMetrics = this.metrics.filter(m => m.environment === environment);
    const violations: string[] = [];

    // Check render time target (should be < 16ms for 60fps)
    const avgRenderTime = environmentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / environmentMetrics.length;
    if (avgRenderTime > 16) {
      violations.push(`Average render time ${avgRenderTime.toFixed(2)}ms exceeds 16ms target`);
    }

    // Check memory usage target (should be < 100MB)
    const avgMemoryUsage = environmentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / environmentMetrics.length;
    if (avgMemoryUsage > 100 * 1024 * 1024) {
      violations.push(`Average memory usage ${(avgMemoryUsage / 1024 / 1024).toFixed(2)}MB exceeds 100MB target`);
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  clearMetrics(): void {
    this.metrics = [];
    this.startTimes.clear();
    this.memoryLeaks = [];
    this.memoryThresholdViolations = [];
  }

  logMetrics(): void {
    console.log('Performance Metrics:', this.metrics);
    console.log('Memory Leaks:', this.memoryLeaks);
    console.log('Memory Threshold Violations:', this.memoryThresholdViolations);
  }

  private monitorRenderPerformance(): void {
    try {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      
      if (errorBoundary.isInFallbackMode()) {
        this.fallbackPerformanceMonitoring();
        return;
      }
      
      // Use requestAnimationFrame for performance monitoring
      const measureRenderTime = () => {
        try {
          const startTime = performanceAPI.now();
          requestAnimationFrame(() => {
            try {
              const endTime = performanceAPI.now();
              const renderTime = endTime - startTime;
              this.recordComponentMetrics('global', renderTime, 'nextgen');
            } catch (error) {
              errorBoundary.handleError(error as Error, 'Render performance measurement');
            }
          });
        } catch (error) {
          errorBoundary.handleError(error as Error, 'Render performance setup');
        }
      };

      // Monitor render performance periodically
      const intervalId = setInterval(measureRenderTime, 1000);
      
      // Store interval ID for cleanup
      this.activeIntervals.push(intervalId);
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Render performance monitoring setup');
      // Fallback to basic timing
      this.fallbackPerformanceMonitoring();
    }
  }

  private monitorMemoryUsage(): void {
    try {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      
      // Monitor memory usage periodically with memory leak tracking
      const memoryInterval = setInterval(() => {
        try {
          const memoryUsage = this.getCurrentMemoryUsage();
          const memoryThreshold = this.getMemoryThreshold();
          
          // Enhanced memory leak detection with severity levels
          const leakInfo = this.detectMemoryLeakWithSeverity(memoryUsage);
          if (leakInfo) {
            console.warn('Memory leak detected:', leakInfo);
            this.recordMemoryLeak(leakInfo);
            
            // Trigger alerts for critical leaks
            if (leakInfo.severity === 'critical') {
              this.triggerMemoryLeakAlert(leakInfo);
            }
          }
          
          // Memory threshold tracing
          if (memoryUsage > memoryThreshold) {
            this.recordMemoryThresholdViolation(memoryUsage, memoryThreshold);
          }
          
          this.metrics.push({
            componentName: 'global',
            context: 'memory_monitoring',
            renderTime: 0,
            mountTime: Date.now(),
            memoryUsage,
            bundleSize: this.getBundleSize(),
            startupTime: this.getStartupTime(),
            dualMountOverhead: this.calculateDualMountOverhead(),
            timestamp: Date.now(),
            environment: 'nextgen',
          });
        } catch (error) {
          errorBoundary.handleError(error as Error, 'Memory usage monitoring');
        }
      }, 5000);
      
      // Store interval ID for cleanup
      this.activeIntervals.push(memoryInterval);
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Memory monitoring setup');
    }
  }

  private detectMemoryLeak(currentUsage: number): boolean {
    const recentUsage = this.metrics
      .filter(m => m.timestamp > Date.now() - 60000) // Last minute
      .map(m => m.memoryUsage);
    
    if (recentUsage.length < 3) return false;
    
    // Check if memory usage is consistently increasing
    const trend = recentUsage.slice(-3);
    return trend.every((usage, i) => i === 0 || usage > trend[i - 1]);
  }

  private detectMemoryLeakWithSeverity(currentUsage: number): MemoryLeakInfo | null {
    const recentUsage = this.metrics
      .filter(m => m.timestamp > Date.now() - 60000) // Last minute
      .map(m => m.memoryUsage);
    
    if (recentUsage.length < 3) return null;
    
    // Check if memory usage is consistently increasing
    const trend = recentUsage.slice(-3);
    const isIncreasing = trend.every((usage, i) => i === 0 || usage > trend[i - 1]);
    
    if (!isIncreasing) return null;
    
    // Calculate severity based on rate of increase
    const rateOfIncrease = (currentUsage - recentUsage[0]) / recentUsage[0];
    let severity: 'low' | 'medium' | 'high' | 'critical';
    
    if (rateOfIncrease < 0.1) severity = 'low';
    else if (rateOfIncrease < 0.25) severity = 'medium';
    else if (rateOfIncrease < 0.5) severity = 'high';
    else severity = 'critical';
    
    return {
      timestamp: Date.now(),
      memoryUsage: currentUsage,
      componentName: 'PerformanceMonitor',
      stack: new Error().stack || '',
      severity,
    };
  }

  private recordMemoryLeak(memoryUsage: number): void {
    this.memoryLeaks.push({
      timestamp: Date.now(),
      memoryUsage,
      stack: new Error().stack,
    });
  }

  private recordMemoryLeak(leakInfo: MemoryLeakInfo): void {
    this.memoryLeaks.push({
      timestamp: leakInfo.timestamp,
      memoryUsage: leakInfo.memoryUsage,
      stack: leakInfo.stack,
    });
  }

  private getMemoryThreshold(): number {
    // Dynamic memory threshold based on platform and available memory
    const baseThreshold = 50 * 1024 * 1024; // 50MB base
    const platformMultiplier = Platform.OS === 'ios' ? 1.5 : 1.0;
    return baseThreshold * platformMultiplier;
  }

  private recordMemoryThresholdViolation(currentUsage: number, threshold: number): void {
    console.warn(`Memory usage (${(currentUsage / 1024 / 1024).toFixed(2)}MB) exceeds threshold (${(threshold / 1024 / 1024).toFixed(2)}MB)`);
    
    // Record violation for analysis
    this.memoryThresholdViolations.push({
      timestamp: Date.now(),
      currentUsage,
      threshold,
      severity: currentUsage > threshold * 1.5 ? 'critical' : 'warning',
    });
  }

  private triggerMemoryLeakAlert(leakInfo: MemoryLeakInfo): void {
    // Send alert for critical memory leaks
    console.error('CRITICAL MEMORY LEAK DETECTED:', leakInfo);
    
    // In a real implementation, this would send to monitoring service
    if (typeof global !== 'undefined' && global.alert) {
      global.alert(`Critical memory leak detected: ${leakInfo.memoryUsage} bytes`);
    }
  }

  private fallbackPerformanceMonitoring(): void {
    // Basic timing fallback when Performance API is not available
    const basicInterval = setInterval(() => {
      try {
        const startTime = Date.now();
        setTimeout(() => {
          const endTime = Date.now();
          const renderTime = endTime - startTime;
          this.recordComponentMetrics('global', renderTime, 'nextgen');
        }, 0);
      } catch (error) {
        console.warn('Fallback performance monitoring failed:', error);
      }
    }, 2000);
    
    this.activeIntervals.push(basicInterval);
  }

  private cleanupIntervals(): void {
    this.activeIntervals.forEach(intervalId => {
      try {
        clearInterval(intervalId);
      } catch (error) {
        console.warn('Failed to cleanup interval:', error);
      }
    });
    this.activeIntervals = [];
  }

  // Baseline benchmark assertions
  public establishBaselineAssertions(): PerformanceBaseline {
    const baseline: PerformanceBaseline = {
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      startupTime: 0,
      dualMountOverhead: 0,
      timestamp: Date.now(),
    };

    try {
      // Measure baseline metrics
      const startTime = performanceAPI.now();
      baseline.renderTime = performanceAPI.now() - startTime;
      baseline.memoryUsage = this.getCurrentMemoryUsage();
      baseline.bundleSize = this.getBundleSize();
      baseline.startupTime = this.getStartupTime();
      baseline.dualMountOverhead = this.calculateDualMountOverhead();
    } catch (error) {
      console.warn('Failed to establish baseline assertions:', error);
    }

    return baseline;
  }

  public assertPerformanceBaseline(baseline: PerformanceBaseline, threshold = 0.2): boolean {
    try {
      const currentMetrics = this.getCurrentMetrics();
      
      // Assert render time
      if (currentMetrics.renderTime > baseline.renderTime * (1 + threshold)) {
        console.error(`Render time regression: ${currentMetrics.renderTime} > ${baseline.renderTime * (1 + threshold)}`);
        return false;
      }
      
      // Assert memory usage
      if (currentMetrics.memoryUsage > baseline.memoryUsage * (1 + threshold)) {
        console.error(`Memory usage regression: ${currentMetrics.memoryUsage} > ${baseline.memoryUsage * (1 + threshold)}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('Performance baseline assertion failed:', error);
      return false;
    }
  }

  // Utility methods
  private getCurrentMemoryUsage(): number {
    // Mock memory usage for now - in real implementation would use platform APIs
    return Math.random() * 100 * 1024 * 1024; // Random between 0-100MB
  }

  private getBundleSize(): number {
    // Mock bundle size - in real implementation would measure actual bundle
    return 1024 * 1024; // 1MB mock
  }

  private getStartupTime(): number {
    // Mock startup time - in real implementation would measure actual startup
    return 1000; // 1 second mock
  }

  private calculateDualMountOverhead(): number {
    // Mock dual mount overhead - in real implementation would measure actual overhead
    return 50; // 50ms mock
  }

  public destroy(): void {
    this.cleanupIntervals();
    this.clearMetrics();
  }
}

const performanceMonitor = PerformanceMonitor.getInstance();

export { PerformanceMonitor };

export const usePerformanceMonitor = (): PerformanceMonitorHook => {
  return {
    recordComponentRender: performanceMonitor.recordComponentRender.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
    logMetrics: performanceMonitor.logMetrics.bind(performanceMonitor),
  };
};

export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  environment: 'legacy' | 'nextgen'
) => {
  return React.forwardRef<any, P>((props, ref) => {
    try {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      
      if (errorBoundary.isInFallbackMode()) {
        // Fallback to basic component rendering
        return React.createElement(WrappedComponent, { ...props, ref });
      }
      
      const { recordComponentRender } = usePerformanceMonitor();
      const recordRender = recordComponentRender(componentName, environment);

      React.useEffect(() => {
        try {
          recordRender();
        } catch (error) {
          errorBoundary.handleError(error as Error, `Performance monitoring for ${componentName}`);
        }
      });

      return React.createElement(WrappedComponent, { ...props, ref });
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, `HOC performance monitoring for ${componentName}`);
      // Fallback to basic component rendering
      return React.createElement(WrappedComponent, { ...props, ref });
    }
  });
};

// Performance baseline establishment
export const establishPerformanceBaseline = async (): Promise<PerformanceBaseline> => {
  try {
    const baseline = {
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      startupTime: 0,
      dualMountOverhead: 0,
      timestamp: Date.now(),
    };

    // Measure baseline metrics
    const startTime = performanceAPI.now();
    await new Promise(resolve => setTimeout(resolve, 100)); // Warm-up period
    const endTime = performanceAPI.now();
    
    baseline.renderTime = endTime - startTime;
    baseline.memoryUsage = PerformanceMonitor.getInstance().getCurrentMemoryUsage();
    baseline.bundleSize = PerformanceMonitor.getInstance().getBundleSize();
    baseline.startupTime = PerformanceMonitor.getInstance().getStartupTime();
    baseline.dualMountOverhead = PerformanceMonitor.getInstance().calculateDualMountOverhead();

    return baseline;
  } catch (error) {
    console.warn('Failed to establish performance baseline:', error);
    return {
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      startupTime: 0,
      dualMountOverhead: 0,
      timestamp: Date.now(),
    };
  }
};

// Performance regression detection
export const detectPerformanceRegression = (
  currentMetrics: PerformanceMetrics,
  baseline: PerformanceBaseline,
  threshold = 0.2 // 20% degradation threshold
): PerformanceRegressionReport => {
  try {
    const report: PerformanceRegressionReport = {
      hasRegression: false,
      regressions: [],
      timestamp: Date.now(),
    };

    // Check render time regression
    if (currentMetrics.renderTime > baseline.renderTime * (1 + threshold)) {
      report.hasRegression = true;
      report.regressions.push({
        metric: 'renderTime',
        baseline: baseline.renderTime,
        current: currentMetrics.renderTime,
        degradation: ((currentMetrics.renderTime - baseline.renderTime) / baseline.renderTime) * 100,
      });
    }

    // Check memory usage regression
    if (currentMetrics.memoryUsage > baseline.memoryUsage * (1 + threshold)) {
      report.hasRegression = true;
      report.regressions.push({
        metric: 'memoryUsage',
        baseline: baseline.memoryUsage,
        current: currentMetrics.memoryUsage,
        degradation: ((currentMetrics.memoryUsage - baseline.memoryUsage) / baseline.memoryUsage) * 100,
      });
    }

    return report;
  } catch (error) {
    console.warn('Performance regression detection failed:', error);
    return {
      hasRegression: false,
      regressions: [],
      timestamp: Date.now(),
    };
  }
};

// Memory threshold tracing
export const getMemoryThreshold = (): number => {
  const baseThreshold = 50 * 1024 * 1024; // 50MB base
  const platformMultiplier = Platform.OS === 'ios' ? 1.5 : 1.0;
  return baseThreshold * platformMultiplier;
};

export const checkMemoryThreshold = (currentUsage: number): { exceeded: boolean; threshold: number; percentage: number } => {
  const threshold = getMemoryThreshold();
  const percentage = (currentUsage / threshold) * 100;
  return {
    exceeded: currentUsage > threshold,
    threshold,
    percentage,
  };
};

export default performanceMonitor;
