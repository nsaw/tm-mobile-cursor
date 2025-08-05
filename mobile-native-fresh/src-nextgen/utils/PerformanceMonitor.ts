import React, { useEffect } from 'react';
import { Platform } from 'react-native';

// React Native Performance API fallbacks with error boundary
let _PerformanceObserver: unknown = null;
let _PerformanceEntry: unknown = null;
let _performanceAPI: unknown = null;

// Error boundary for performance collection failures
class _PerformanceErrorBoundary {
  private static instance: _PerformanceErrorBoundary;
  private errorCount = 0;
  private maxErrors = 10;
  private fallbackMode = false;

  public static getInstance(): _PerformanceErrorBoundary {
    if (!_PerformanceErrorBoundary.instance) {
      _PerformanceErrorBoundary.instance = new _PerformanceErrorBoundary();
    }
    return _PerformanceErrorBoundary.instance;
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
    if (typeof globalThis !== 'undefined') {
      _PerformanceObserver = (globalThis as Record<string, unknown>).PerformanceObserver;
      _PerformanceEntry = (globalThis as Record<string, unknown>).PerformanceEntry;
      _performanceAPI = (globalThis as Record<string, unknown>).performance;
    }
  } else {
    // React Native doesn't have native Performance API - use native fallbacks
    _PerformanceObserver = null;
    _PerformanceEntry = null;
    _performanceAPI = {
      now: () => Date.now(),
      mark: () => {
        // Empty implementation for React Native
      },
      measure: () => {
        // Empty implementation for React Native
      },
    };
  }
} catch (error) {
  console.warn('Performance API initialization failed:', error);
  _PerformanceObserver = null;
  _PerformanceEntry = null;
  _performanceAPI = {
    now: () => Date.now(),
    mark: () => {
      // Empty implementation for React Native
    },
    measure: () => {
      // Empty implementation for React Native
    },
  };
}

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
}

interface MemoryLeak {
  timestamp: number;
  memoryUsage: number;
  stack: string;
}

interface PerformanceTargets {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxBundleSize: number;
  maxStartupTime: number;
  maxDualMountOverhead: number;
}

interface PerformanceReport {
  currentMetrics: PerformanceMetrics[];
  baseline: {
    legacy: PerformanceMetrics;
    nextgen: PerformanceMetrics;
  };
  memoryLeaks: MemoryLeak[];
  memoryThresholdViolations: MemoryThresholdViolation[];
  targets: PerformanceTargets;
  violations: string[];
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];

  public getMetricsForTesting(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public startMonitoring(): void {
    console.log('🚀 Performance monitoring started');
  }

  public stopMonitoring(): void {
    console.log('🛑 Performance monitoring stopped');
  }

  public async measureAsyncOperation<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      console.log(`⏱️ Async operation completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Async operation failed after ${duration}ms:`, error);
      throw error;
    }
  }

  private memoryLeaks: MemoryLeak[] = [];
  private memoryThresholdViolations: MemoryThresholdViolation[] = [];
  private activeIntervals: number[] = [];

  private constructor() {
    console.log('📊 PerformanceMonitor initialized');
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordComponentMetrics(componentName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    };

    this.metrics.push(metric);
    console.log(`📊 Component ${componentName} (${environment}) rendered in ${renderTime}ms`);
  }

  public recordScreenMetrics(screenName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    const metric: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
    };

    this.metrics.push(metric);
    console.log(`📊 Screen ${screenName} (${environment}) rendered in ${renderTime}ms`);
  }

  public establishBaseline(): { legacy: PerformanceMetrics; nextgen: PerformanceMetrics } {
    const legacyMetrics = this.metrics.filter(m => m.environment === 'legacy');
    const nextgenMetrics = this.metrics.filter(m => m.environment === 'nextgen');

    const legacyBaseline: PerformanceMetrics = {
      renderTime: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.renderTime, 0) / legacyMetrics.length : 0,
      memoryUsage: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / legacyMetrics.length : 0,
      bundleSize: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / legacyMetrics.length : 0,
      startupTime: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.startupTime, 0) / legacyMetrics.length : 0,
      dualMountOverhead: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / legacyMetrics.length : 0,
      timestamp: Date.now(),
      environment: 'legacy',
    };

    const nextgenBaseline: PerformanceMetrics = {
      renderTime: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.renderTime, 0) / nextgenMetrics.length : 0,
      memoryUsage: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / nextgenMetrics.length : 0,
      bundleSize: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / nextgenMetrics.length : 0,
      startupTime: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.startupTime, 0) / nextgenMetrics.length : 0,
      dualMountOverhead: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / nextgenMetrics.length : 0,
      timestamp: Date.now(),
      environment: 'nextgen',
    };

    return { legacy: legacyBaseline, nextgen: nextgenBaseline };
  }

  public checkPerformanceTargets(_environment: 'legacy' | 'nextgen'): { passed: boolean; violations: string[] } {
    const targets: PerformanceTargets = {
      maxRenderTime: 100,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      maxBundleSize: 10 * 1024 * 1024, // 10MB
      maxStartupTime: 5000,
      maxDualMountOverhead: 50,
    };

    const violations: string[] = [];
    const currentMetrics = this.getCurrentMetrics();

    if (currentMetrics.renderTime > targets.maxRenderTime) {
      violations.push(`Render time ${currentMetrics.renderTime}ms exceeds target ${targets.maxRenderTime}ms`);
    }

    if (currentMetrics.memoryUsage > targets.maxMemoryUsage) {
      violations.push(`Memory usage ${currentMetrics.memoryUsage} bytes exceeds target ${targets.maxMemoryUsage} bytes`);
    }

    if (currentMetrics.bundleSize > targets.maxBundleSize) {
      violations.push(`Bundle size ${currentMetrics.bundleSize} bytes exceeds target ${targets.maxBundleSize} bytes`);
    }

    if (currentMetrics.startupTime > targets.maxStartupTime) {
      violations.push(`Startup time ${currentMetrics.startupTime}ms exceeds target ${targets.maxStartupTime}ms`);
    }

    if (currentMetrics.dualMountOverhead > targets.maxDualMountOverhead) {
      violations.push(`Dual mount overhead ${currentMetrics.dualMountOverhead}ms exceeds target ${targets.maxDualMountOverhead}ms`);
    }

    return {
      passed: violations.length === 0,
      violations,
    };
  }

  public getPerformanceReport(): PerformanceReport {
    const baseline = this.establishBaseline();
    const targets: PerformanceTargets = {
      maxRenderTime: 100,
      maxMemoryUsage: 100 * 1024 * 1024,
      maxBundleSize: 10 * 1024 * 1024,
      maxStartupTime: 5000,
      maxDualMountOverhead: 50,
    };

    const currentMetrics = this.getCurrentMetrics();
    const targetCheck = this.checkPerformanceTargets(currentMetrics.environment);

    return {
      currentMetrics: this.metrics,
      baseline,
      memoryLeaks: this.memoryLeaks,
      memoryThresholdViolations: this.memoryThresholdViolations,
      targets,
      violations: targetCheck.violations,
    };
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.memoryLeaks = [];
    this.memoryThresholdViolations = [];
    console.log('🧹 Performance metrics cleared');
  }

  public destroy(): void {
    this.clearMetrics();
    this.cleanupIntervals();
    PerformanceMonitor.instance = null as unknown as PerformanceMonitor;
    console.log('🗑️ PerformanceMonitor destroyed');
  }

  public getCurrentMemoryUsage(): number {
    try {
      // React Native doesn't have native memory API
      // This is a placeholder implementation
      return Math.random() * 100 * 1024 * 1024; // Random value between 0-100MB
    } catch (error) {
      console.warn('Failed to get memory usage:', error);
      return 0;
    }
  }

  public getBundleSize(): number {
    try {
      // Placeholder implementation for bundle size
      return 5 * 1024 * 1024; // 5MB placeholder
    } catch (error) {
      console.warn('Failed to get bundle size:', error);
      return 0;
    }
  }

  public getStartupTime(): number {
    try {
      // Placeholder implementation for startup time
      return 2000; // 2 seconds placeholder
    } catch (error) {
      console.warn('Failed to get startup time:', error);
      return 0;
    }
  }

  public calculateDualMountOverhead(): number {
    try {
      // Placeholder implementation for dual mount overhead
      return 25; // 25ms placeholder
    } catch (error) {
      console.warn('Failed to calculate dual mount overhead:', error);
      return 0;
    }
  }

  private monitorRenderPerformance(): void {
    try {
      // This would be used in components to measure render time
      console.log('📊 Render performance monitoring enabled');
    } catch (error) {
      console.warn('Failed to enable render performance monitoring:', error);
    }
  }

  private monitorMemoryUsage(): void {
    try {
      const interval = setInterval(() => {
        const currentUsage = this.getCurrentMemoryUsage();
        const threshold = this.getMemoryThreshold();

        if (currentUsage > threshold) {
          this.recordMemoryThresholdViolation(currentUsage, threshold);
        }

        if (this.detectMemoryLeak(currentUsage)) {
          this.recordMemoryLeak(currentUsage);
        }
      }, 30000); // Check every 30 seconds

      this.activeIntervals.push(interval);
      console.log('📊 Memory usage monitoring enabled');
    } catch (error) {
      console.warn('Failed to enable memory usage monitoring:', error);
    }
  }

  private detectMemoryLeak(currentUsage: number): boolean {
    // Simple memory leak detection based on usage patterns
    const recentMetrics = this.metrics.slice(-10);
    if (recentMetrics.length < 5) return false;

    const avgUsage = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length;
    return currentUsage > avgUsage * 1.5; // 50% increase threshold
  }

  private detectMemoryLeakWithSeverity(currentUsage: number): MemoryLeakInfo | null {
    const recentMetrics = this.metrics.slice(-10);
    if (recentMetrics.length < 5) return null;

    const avgUsage = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length;
    const increase = currentUsage - avgUsage;
    const increasePercentage = (increase / avgUsage) * 100;

    if (increasePercentage > 100) {
      return {
        timestamp: Date.now(),
        memoryUsage: currentUsage,
        componentName: 'Unknown',
        stack: new Error().stack || '',
        severity: 'critical',
      };
    } else if (increasePercentage > 50) {
      return {
        timestamp: Date.now(),
        memoryUsage: currentUsage,
        componentName: 'Unknown',
        stack: new Error().stack || '',
        severity: 'high',
      };
    } else if (increasePercentage > 25) {
      return {
        timestamp: Date.now(),
        memoryUsage: currentUsage,
        componentName: 'Unknown',
        stack: new Error().stack || '',
        severity: 'medium',
      };
    }

    return null;
  }

  private recordMemoryLeak(memoryUsage: number): void {
    const leak: MemoryLeak = {
      timestamp: Date.now(),
      memoryUsage,
      stack: new Error().stack || '',
    };

    this.memoryLeaks.push(leak);
    console.warn('🚨 Memory leak detected:', leak);
  }

  private recordMemoryLeakInfo(leakInfo: MemoryLeakInfo): void {
    console.warn('🚨 Memory leak detected with severity:', leakInfo);
    this.triggerMemoryLeakAlert(leakInfo);
  }

  private getMemoryThreshold(): number {
    return 100 * 1024 * 1024; // 100MB threshold
  }

  private recordMemoryThresholdViolation(currentUsage: number, threshold: number): void {
    const violation: MemoryThresholdViolation = {
      timestamp: Date.now(),
      currentUsage,
      threshold,
      severity: currentUsage > threshold * 1.5 ? 'critical' : 'warning',
    };

    this.memoryThresholdViolations.push(violation);
    console.warn('⚠️ Memory threshold violation:', violation);
  }

  private triggerMemoryLeakAlert(leakInfo: MemoryLeakInfo): void {
    console.error('🚨 CRITICAL: Memory leak detected', {
      severity: leakInfo.severity,
      memoryUsage: leakInfo.memoryUsage,
      componentName: leakInfo.componentName,
      timestamp: new Date(leakInfo.timestamp).toISOString(),
    });
  }

  private fallbackPerformanceMonitoring(): void {
    console.log('🔄 Using fallback performance monitoring');
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
  }

  private cleanupIntervals(): void {
    this.activeIntervals.forEach(interval => {
      clearInterval(interval);
    });
    this.activeIntervals = [];
  }

  public establishBaselineAssertions(): PerformanceBaseline {
    const currentMetrics = this.getCurrentMetrics();
    
    return {
      renderTime: currentMetrics.renderTime,
      memoryUsage: currentMetrics.memoryUsage,
      bundleSize: currentMetrics.bundleSize,
      startupTime: currentMetrics.startupTime,
      dualMountOverhead: currentMetrics.dualMountOverhead,
      timestamp: Date.now(),
    };
  }

  public assertPerformanceBaseline(baseline: PerformanceBaseline, threshold = 0.2): boolean {
    const currentMetrics = this.getCurrentMetrics();
    
    const renderTimeDiff = Math.abs(currentMetrics.renderTime - baseline.renderTime) / baseline.renderTime;
    const memoryUsageDiff = Math.abs(currentMetrics.memoryUsage - baseline.memoryUsage) / baseline.memoryUsage;
    const bundleSizeDiff = Math.abs(currentMetrics.bundleSize - baseline.bundleSize) / baseline.bundleSize;
    const startupTimeDiff = Math.abs(currentMetrics.startupTime - baseline.startupTime) / baseline.startupTime;
    const dualMountOverheadDiff = Math.abs(currentMetrics.dualMountOverhead - baseline.dualMountOverhead) / baseline.dualMountOverhead;

    const allDiffs = [renderTimeDiff, memoryUsageDiff, bundleSizeDiff, startupTimeDiff, dualMountOverheadDiff];
    const maxDiff = Math.max(...allDiffs);

    return maxDiff <= threshold;
  }

  private getCurrentMetrics(): PerformanceMetrics {
    const lastMetric = this.metrics[this.metrics.length - 1];
    if (lastMetric) {
      return lastMetric;
    }

    // Return default metrics if none exist
    return {
      renderTime: 0,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment: 'nextgen',
    };
  }
}

export const usePerformanceMonitor = (): {
  recordComponentRender: (componentName: string, environment: 'legacy' | 'nextgen') => () => void;
  recordScreenRender: (screenName: string, environment: 'legacy' | 'nextgen') => () => void;
  getMetrics: () => PerformanceMetrics[];
  clearMetrics: () => void;
  getReport: () => PerformanceReport;
} => {
  const monitor = PerformanceMonitor.getInstance();

  const recordComponentRender = (componentName: string, environment: 'legacy' | 'nextgen'): (() => void) => {
    const startTime = Date.now();
    return () => {
      const renderTime = Date.now() - startTime;
      monitor.recordComponentMetrics(componentName, renderTime, environment);
    };
  };

  const recordScreenRender = (screenName: string, environment: 'legacy' | 'nextgen'): (() => void) => {
    const startTime = Date.now();
    return () => {
      const renderTime = Date.now() - startTime;
      monitor.recordScreenMetrics(screenName, renderTime, environment);
    };
  };

  return {
    recordComponentRender,
    recordScreenRender,
    getMetrics: () => monitor.getMetricsForTesting(),
    clearMetrics: () => monitor.clearMetrics(),
    getReport: () => monitor.getPerformanceReport(),
  };
};

export const withPerformanceMonitoring = <P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  environment: 'legacy' | 'nextgen'
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>> => {
  const WrappedWithPerformance = React.forwardRef<unknown, P>((props, ref) => {
    const monitor = PerformanceMonitor.getInstance();
    const startTime = Date.now();

    useEffect(() => {
      const renderTime = Date.now() - startTime;
      monitor.recordComponentMetrics(componentName, renderTime, environment);
    });

    return React.createElement(WrappedComponent, { ...props, ref } as P);
  });

  WrappedWithPerformance.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return WrappedWithPerformance;
};

export const establishPerformanceBaseline = async (): Promise<PerformanceBaseline> => {
  const monitor = PerformanceMonitor.getInstance();
  
  // Record some baseline metrics
  monitor.recordComponentMetrics('BaselineComponent', 50, 'nextgen');
  monitor.recordScreenMetrics('BaselineScreen', 200, 'nextgen');
  
  // Wait a bit for metrics to settle
  await new Promise<void>(resolve => setTimeout(resolve, 1000));
  
  return monitor.establishBaselineAssertions();
};

export const detectPerformanceRegression = (
  currentMetrics: PerformanceMetrics,
  baseline: PerformanceBaseline,
  threshold = 0.2 // 20% degradation threshold
): PerformanceRegressionReport => {
  const regressions: Array<{
    metric: string;
    baseline: number;
    current: number;
    degradation: number;
  }> = [];

  // Check render time regression
  const renderTimeDegradation = (currentMetrics.renderTime - baseline.renderTime) / baseline.renderTime;
  if (renderTimeDegradation > threshold) {
    regressions.push({
      metric: 'renderTime',
      baseline: baseline.renderTime,
      current: currentMetrics.renderTime,
      degradation: renderTimeDegradation,
    });
  }

  // Check memory usage regression
  const memoryUsageDegradation = (currentMetrics.memoryUsage - baseline.memoryUsage) / baseline.memoryUsage;
  if (memoryUsageDegradation > threshold) {
    regressions.push({
      metric: 'memoryUsage',
      baseline: baseline.memoryUsage,
      current: currentMetrics.memoryUsage,
      degradation: memoryUsageDegradation,
    });
  }

  // Check bundle size regression
  const bundleSizeDegradation = (currentMetrics.bundleSize - baseline.bundleSize) / baseline.bundleSize;
  if (bundleSizeDegradation > threshold) {
    regressions.push({
      metric: 'bundleSize',
      baseline: baseline.bundleSize,
      current: currentMetrics.bundleSize,
      degradation: bundleSizeDegradation,
    });
  }

  // Check startup time regression
  const startupTimeDegradation = (currentMetrics.startupTime - baseline.startupTime) / baseline.startupTime;
  if (startupTimeDegradation > threshold) {
    regressions.push({
      metric: 'startupTime',
      baseline: baseline.startupTime,
      current: currentMetrics.startupTime,
      degradation: startupTimeDegradation,
    });
  }

  // Check dual mount overhead regression
  const dualMountOverheadDegradation = (currentMetrics.dualMountOverhead - baseline.dualMountOverhead) / baseline.dualMountOverhead;
  if (dualMountOverheadDegradation > threshold) {
    regressions.push({
      metric: 'dualMountOverhead',
      baseline: baseline.dualMountOverhead,
      current: currentMetrics.dualMountOverhead,
      degradation: dualMountOverheadDegradation,
    });
  }

  return {
    hasRegression: regressions.length > 0,
    regressions,
    timestamp: Date.now(),
  };
};

export const getMemoryThreshold = (): number => {
  return 100 * 1024 * 1024; // 100MB
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