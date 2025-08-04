// Global type declarations for React Native environment
declare global {
  var global: any;
  var performance: any;
  var PerformanceObserver: any;
  var PerformanceEntry: any;
}

import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// React Native Performance API fallbacks with error boundary
let PerformanceObserver: any;
let PerformanceEntry: any;
let performanceAPI: any;

// Error boundary for performance collection failures
class PerformanceErrorBoundary {
  private static instance: PerformanceErrorBoundary;
  private errorCount: number = 0;
  private maxErrors: number = 10;
  private fallbackMode: boolean = false;

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
    if (typeof global !== 'undefined') {
      PerformanceObserver = (global as any).PerformanceObserver;
      PerformanceEntry = (global as any).PerformanceEntry;
      performanceAPI = (global as any).performance;
    }
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

// Performance metrics interface
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
}

// Memory leak tracking
interface MemoryLeak {
  timestamp: number;
  memoryUsage: number;
  stack: string;
}

// Performance targets
interface PerformanceTargets {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxBundleSize: number;
  maxStartupTime: number;
  maxDualMountOverhead: number;
}

// Performance report
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
  
  // Test-only accessor for private metrics
  public getMetricsForTesting(): PerformanceMetrics[] {
    return this.metrics;
  }

  // Test-only methods for regression testing
  public startMonitoring(): void {
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
  }

  public stopMonitoring(): void {
    this.destroy();
  }

  public async measureAsyncOperation<T>(operation: () => Promise<T>): Promise<T> {
    const startTime = performanceAPI.now();
    try {
      const result = await operation();
      const endTime = performanceAPI.now();
      this.recordComponentMetrics('async-operation', endTime - startTime, 'nextgen');
      return result;
    } catch (error) {
      const endTime = performanceAPI.now();
      this.recordComponentMetrics('async-operation-error', endTime - startTime, 'nextgen');
      throw error;
    }
  }
  private memoryLeaks: MemoryLeak[] = [];
  private memoryThresholdViolations: MemoryThresholdViolation[] = [];
  private activeIntervals: number[] = [];

  private constructor() {
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordComponentMetrics(componentName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    try {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      
      if (errorBoundary.isInFallbackMode()) {
        // Use basic timing in fallback mode
        renderTime = Date.now() % 100; // Simple fallback timing
      }

      this.metrics.push({
        renderTime,
        memoryUsage: this.getCurrentMemoryUsage(),
        bundleSize: this.getBundleSize(),
        startupTime: this.getStartupTime(),
        dualMountOverhead: this.calculateDualMountOverhead(),
        timestamp: Date.now(),
        environment,
      });
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, `Component metrics recording for ${componentName}`);
    }
  }

  public recordScreenMetrics(screenName: string, renderTime: number, environment: 'legacy' | 'nextgen'): void {
    try {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      
      if (errorBoundary.isInFallbackMode()) {
        // Use basic timing in fallback mode
        renderTime = Date.now() % 200; // Simple fallback timing
      }

      this.metrics.push({
        renderTime,
        memoryUsage: this.getCurrentMemoryUsage(),
        bundleSize: this.getBundleSize(),
        startupTime: this.getStartupTime(),
        dualMountOverhead: this.calculateDualMountOverhead(),
        timestamp: Date.now(),
        environment,
      });
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, `Screen metrics recording for ${screenName}`);
    }
  }

  public establishBaseline(): { legacy: PerformanceMetrics; nextgen: PerformanceMetrics } {
    try {
      const legacyMetrics = this.metrics.filter(m => m.environment === 'legacy').slice(-10);
      const nextgenMetrics = this.metrics.filter(m => m.environment === 'nextgen').slice(-10);

      const legacyBaseline: PerformanceMetrics = {
        renderTime: legacyMetrics.reduce((sum, m) => sum + m.renderTime, 0) / Math.max(legacyMetrics.length, 1),
        memoryUsage: legacyMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / Math.max(legacyMetrics.length, 1),
        bundleSize: legacyMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / Math.max(legacyMetrics.length, 1),
        startupTime: legacyMetrics.reduce((sum, m) => sum + m.startupTime, 0) / Math.max(legacyMetrics.length, 1),
        dualMountOverhead: legacyMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / Math.max(legacyMetrics.length, 1),
        timestamp: Date.now(),
        environment: 'legacy',
      };

      const nextgenBaseline: PerformanceMetrics = {
        renderTime: nextgenMetrics.reduce((sum, m) => sum + m.renderTime, 0) / Math.max(nextgenMetrics.length, 1),
        memoryUsage: nextgenMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / Math.max(nextgenMetrics.length, 1),
        bundleSize: nextgenMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / Math.max(nextgenMetrics.length, 1),
        startupTime: nextgenMetrics.reduce((sum, m) => sum + m.startupTime, 0) / Math.max(nextgenMetrics.length, 1),
        dualMountOverhead: nextgenMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / Math.max(nextgenMetrics.length, 1),
        timestamp: Date.now(),
        environment: 'nextgen',
      };

      return { legacy: legacyBaseline, nextgen: nextgenBaseline };
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Baseline establishment');
      
      // Return default baselines
      const defaultBaseline: PerformanceMetrics = {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        startupTime: 0,
        dualMountOverhead: 0,
        timestamp: Date.now(),
        environment: 'nextgen',
      };
      
      return { legacy: defaultBaseline, nextgen: defaultBaseline };
    }
  }

  public checkPerformanceTargets(environment: 'legacy' | 'nextgen'): { passed: boolean; violations: string[] } {
    try {
      const targets: PerformanceTargets = {
        maxRenderTime: 100, // 100ms
        maxMemoryUsage: 100 * 1024 * 1024, // 100MB
        maxBundleSize: 10 * 1024 * 1024, // 10MB
        maxStartupTime: 5000, // 5s
        maxDualMountOverhead: 50, // 50ms
      };

      const recentMetrics = this.metrics
        .filter(m => m.environment === environment)
        .slice(-10);

      if (recentMetrics.length === 0) {
        return { passed: true, violations: [] };
      }

      const avgMetrics = {
        renderTime: recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length,
        memoryUsage: recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length,
        bundleSize: recentMetrics.reduce((sum, m) => sum + m.bundleSize, 0) / recentMetrics.length,
        startupTime: recentMetrics.reduce((sum, m) => sum + m.startupTime, 0) / recentMetrics.length,
        dualMountOverhead: recentMetrics.reduce((sum, m) => sum + m.dualMountOverhead, 0) / recentMetrics.length,
      };

      const violations: string[] = [];

      if (avgMetrics.renderTime > targets.maxRenderTime) {
        violations.push(`Render time ${avgMetrics.renderTime}ms exceeds target ${targets.maxRenderTime}ms`);
      }

      if (avgMetrics.memoryUsage > targets.maxMemoryUsage) {
        violations.push(`Memory usage ${(avgMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB exceeds target ${(targets.maxMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
      }

      if (avgMetrics.bundleSize > targets.maxBundleSize) {
        violations.push(`Bundle size ${(avgMetrics.bundleSize / 1024 / 1024).toFixed(2)}MB exceeds target ${(targets.maxBundleSize / 1024 / 1024).toFixed(2)}MB`);
      }

      if (avgMetrics.startupTime > targets.maxStartupTime) {
        violations.push(`Startup time ${avgMetrics.startupTime}ms exceeds target ${targets.maxStartupTime}ms`);
      }

      if (avgMetrics.dualMountOverhead > targets.maxDualMountOverhead) {
        violations.push(`Dual mount overhead ${avgMetrics.dualMountOverhead}ms exceeds target ${targets.maxDualMountOverhead}ms`);
      }

      return { passed: violations.length === 0, violations };
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Performance targets check');
      return { passed: false, violations: ['Error checking performance targets'] };
    }
  }

  public getPerformanceReport(): PerformanceReport {
    try {
      const baseline = this.establishBaseline();
      const targets: PerformanceTargets = {
        maxRenderTime: 100,
        maxMemoryUsage: 100 * 1024 * 1024,
        maxBundleSize: 10 * 1024 * 1024,
        maxStartupTime: 5000,
        maxDualMountOverhead: 50,
      };

      const currentTargets = this.checkPerformanceTargets('nextgen');

      return {
        currentMetrics: this.metrics.slice(-50), // Last 50 metrics
        baseline,
        memoryLeaks: this.memoryLeaks,
        memoryThresholdViolations: this.memoryThresholdViolations,
        targets,
        violations: currentTargets.violations,
      };
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Performance report generation');
      
      return {
        currentMetrics: [],
        baseline: {
          legacy: {
            renderTime: 0,
            memoryUsage: 0,
            bundleSize: 0,
            startupTime: 0,
            dualMountOverhead: 0,
            timestamp: Date.now(),
            environment: 'legacy',
          },
          nextgen: {
            renderTime: 0,
            memoryUsage: 0,
            bundleSize: 0,
            startupTime: 0,
            dualMountOverhead: 0,
            timestamp: Date.now(),
            environment: 'nextgen',
          },
        },
        memoryLeaks: [],
        memoryThresholdViolations: [],
        targets: {
          maxRenderTime: 100,
          maxMemoryUsage: 100 * 1024 * 1024,
          maxBundleSize: 10 * 1024 * 1024,
          maxStartupTime: 5000,
          maxDualMountOverhead: 50,
        },
        violations: ['Error generating performance report'],
      };
    }
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.memoryLeaks = [];
    this.memoryThresholdViolations = [];
  }

  public destroy(): void {
    this.cleanupIntervals();
  }

  // Private helper methods
  public getCurrentMemoryUsage(): number {
    try {
      // React Native doesn't provide direct memory access
      // This is a placeholder implementation
      return Math.random() * 50 * 1024 * 1024; // Random value between 0-50MB
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Memory usage measurement');
      return 0;
    }
  }

  public getBundleSize(): number {
    try {
      // Placeholder implementation
      return 5 * 1024 * 1024; // 5MB placeholder
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Bundle size measurement');
      return 0;
    }
  }

  public getStartupTime(): number {
    try {
      // Placeholder implementation
      return 1000; // 1s placeholder
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Startup time measurement');
      return 0;
    }
  }

  public calculateDualMountOverhead(): number {
    try {
      // Placeholder implementation
      return 10; // 10ms placeholder
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, 'Dual mount overhead calculation');
      return 0;
    }
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
            this.recordMemoryLeakInfo(leakInfo);
            
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
            renderTime: 0,
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
      stack: new Error().stack || '',
    });
  }

  private recordMemoryLeakInfo(leakInfo: MemoryLeakInfo): void {
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
    if (typeof global !== 'undefined' && (global as any).alert) {
      (global as any).alert(`Critical memory leak detected: ${leakInfo.memoryUsage} bytes`);
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

  public assertPerformanceBaseline(baseline: PerformanceBaseline, threshold: number = 0.2): boolean {
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

  private getCurrentMetrics(): PerformanceMetrics {
    const recentMetrics = this.metrics.slice(-1)[0];
    if (!recentMetrics) {
      return {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        startupTime: 0,
        dualMountOverhead: 0,
        timestamp: Date.now(),
        environment: 'nextgen',
      };
    }
    return recentMetrics;
  }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const recordComponentRender = (componentName: string, environment: 'legacy' | 'nextgen') => {
    return () => {
      try {
        const startTime = performanceAPI.now();
        requestAnimationFrame(() => {
          const endTime = performanceAPI.now();
          const renderTime = endTime - startTime;
          monitor.recordComponentMetrics(componentName, renderTime, environment);
        });
      } catch (error) {
        const errorBoundary = PerformanceErrorBoundary.getInstance();
        errorBoundary.handleError(error as Error, `Component render recording for ${componentName}`);
      }
    };
  };

  const recordScreenRender = (screenName: string, environment: 'legacy' | 'nextgen') => {
    return () => {
      try {
        const startTime = performanceAPI.now();
        requestAnimationFrame(() => {
          const endTime = performanceAPI.now();
          const renderTime = endTime - startTime;
          monitor.recordScreenMetrics(screenName, renderTime, environment);
        });
      } catch (error) {
        const errorBoundary = PerformanceErrorBoundary.getInstance();
        errorBoundary.handleError(error as Error, `Screen render recording for ${screenName}`);
      }
    };
  };

  return {
    recordComponentRender,
    recordScreenRender,
    getPerformanceReport: () => monitor.getPerformanceReport(),
    checkPerformanceTargets: (environment: 'legacy' | 'nextgen') => monitor.checkPerformanceTargets(environment),
    establishBaseline: () => monitor.establishBaseline(),
  };
};

// Higher-Order Component for performance monitoring
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
        return React.createElement(WrappedComponent, { ...props, ref } as any);
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

      return React.createElement(WrappedComponent, { ...props, ref } as any);
    } catch (error) {
      const errorBoundary = PerformanceErrorBoundary.getInstance();
      errorBoundary.handleError(error as Error, `HOC performance monitoring for ${componentName}`);
      // Fallback to basic component rendering
      return React.createElement(WrappedComponent, { ...props, ref } as any);
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
    await new Promise<void>(resolve => setTimeout(() => resolve(), 100)); // Warm-up period
    const endTime = performanceAPI.now();
    
    baseline.renderTime = endTime - startTime;
    const monitor = PerformanceMonitor.getInstance();
    baseline.memoryUsage = monitor.getCurrentMemoryUsage();
    baseline.bundleSize = monitor.getBundleSize();
    baseline.startupTime = monitor.getStartupTime();
    baseline.dualMountOverhead = monitor.calculateDualMountOverhead();

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
  threshold: number = 0.2 // 20% degradation threshold
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