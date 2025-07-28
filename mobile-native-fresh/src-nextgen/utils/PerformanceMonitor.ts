// src-nextgen/utils/PerformanceMonitor.ts
// Comprehensive performance monitoring system for Phase 3 migration

import React from 'react';

// Global type declarations
declare const console: any;
declare const performance: any;
declare const requestAnimationFrame: any;
declare const setInterval: any;
declare const window: any;
declare const global: any;

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  startupTime: number;
  dualMountOverhead: number;
  timestamp: number;
  environment: 'legacy' | 'nextgen';
  componentName?: string;
  screenName?: string;
}

export interface PerformanceBaseline {
  legacy: PerformanceMetrics;
  nextgen: PerformanceMetrics;
}

export interface PerformanceTargets {
  renderTimeIncrease: number;
  memoryUsageIncrease: number;
  bundleSizeIncrease: number;
  startupTimeIncrease: number;
  dualMountOverhead: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private baseline: PerformanceBaseline | null = null;
  private targets: PerformanceTargets;
  private observers: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private isMonitoring = false;

  constructor() {
    this.targets = {
      renderTimeIncrease: 5, // 5%
      memoryUsageIncrease: 10, // 10%
      bundleSizeIncrease: 15, // 15%
      startupTimeIncrease: 10, // 10%
      dualMountOverhead: 3, // 3%
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Establish performance baseline
   */
  establishBaseline(legacyMetrics: PerformanceMetrics, nextgenMetrics: PerformanceMetrics): void {
    this.baseline = {
      legacy: legacyMetrics,
      nextgen: nextgenMetrics,
    };
    
    console.log('🔍 PerformanceMonitor: Baseline established', this.baseline);
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      console.warn('⚠️ PerformanceMonitor: Already monitoring');
      return;
    }

    this.isMonitoring = true;
    this.monitorRenderPerformance();
    this.monitorMemoryUsage();
    
    console.log('🔍 PerformanceMonitor: Monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('🔍 PerformanceMonitor: Monitoring stopped');
  }

  /**
   * Monitor render performance
   */
  private monitorRenderPerformance(): void {
    // Use requestAnimationFrame for performance monitoring
    const measureRenderTime = () => {
      const startTime = performance.now();
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        this.recordComponentMetrics('global', renderTime, 'nextgen');
      });
    };

    // Monitor render performance periodically
    setInterval(measureRenderTime, 1000);
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    // Monitor memory usage periodically
    setInterval(() => {
      const memoryUsage = this.getCurrentMemoryUsage();
      this.metrics.push({
        renderTime: 0,
        memoryUsage,
        bundleSize: this.getBundleSize(),
        startupTime: this.getStartupTime(),
        dualMountOverhead: this.calculateDualMountOverhead(),
        timestamp: Date.now(),
        environment: 'nextgen',
      });
    }, 5000);
  }

  /**
   * Record performance metrics for a component
   */
  recordComponentMetrics(
    componentName: string,
    renderTime: number,
    environment: 'legacy' | 'nextgen'
  ): void {
    const componentMetrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
      componentName,
    };

    this.metrics.push(componentMetrics);
    this.notifyObservers(componentMetrics);
    
    console.log(`🔍 PerformanceMonitor: Recorded metrics for ${componentName}`, componentMetrics);
  }

  /**
   * Record performance metrics for a screen
   */
  recordScreenMetrics(
    screenName: string,
    renderTime: number,
    environment: 'legacy' | 'nextgen'
  ): void {
    const screenMetrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
      screenName,
    };

    this.metrics.push(screenMetrics);
    this.notifyObservers(screenMetrics);
    
    console.log(`🔍 PerformanceMonitor: Recorded metrics for screen ${screenName}`, screenMetrics);
  }

  /**
   * Get current memory usage
   */
  private getCurrentMemoryUsage(): number {
    try {
      if (typeof window !== 'undefined' && window.performance?.memory) {
        return window.performance.memory.usedJSHeapSize;
      }
      return 0;
    } catch (error) {
      console.error('PerformanceMonitor: Failed to get memory usage:', error);
      return 0;
    }
  }

  /**
   * Get bundle size (estimated)
   */
  private getBundleSize(): number {
    // This is a placeholder - in a real implementation, you'd get this from your bundler
    return 1024 * 1024; // 1MB placeholder
  }

  /**
   * Get startup time
   */
  private getStartupTime(): number {
    // This is a placeholder - in a real implementation, you'd measure actual startup time
    return Date.now() - (global as any).__STARTUP_TIME__ || 0;
  }

  /**
   * Calculate dual mount overhead
   */
  private calculateDualMountOverhead(): number {
    // This is a placeholder - in a real implementation, you'd measure actual overhead
    return 0;
  }

  /**
   * Get average metrics for an environment
   */
  private getAverageMetrics(environment: 'legacy' | 'nextgen'): PerformanceMetrics {
    const environmentMetrics = this.metrics.filter(m => m.environment === environment);
    
    if (environmentMetrics.length === 0) {
      throw new Error(`No metrics found for environment: ${environment}`);
    }

    const sum = environmentMetrics.reduce((acc, metric) => ({
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      bundleSize: acc.bundleSize + metric.bundleSize,
      startupTime: acc.startupTime + metric.startupTime,
      dualMountOverhead: acc.dualMountOverhead + metric.dualMountOverhead,
      timestamp: acc.timestamp + metric.timestamp,
      environment: acc.environment,
    }), {
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      startupTime: 0,
      dualMountOverhead: 0,
      timestamp: 0,
      environment,
    });

    const count = environmentMetrics.length;
    
    return {
      renderTime: sum.renderTime / count,
      memoryUsage: sum.memoryUsage / count,
      bundleSize: sum.bundleSize / count,
      startupTime: sum.startupTime / count,
      dualMountOverhead: sum.dualMountOverhead / count,
      timestamp: sum.timestamp / count,
      environment,
    };
  }

  /**
   * Check if performance targets are met
   */
  checkPerformanceTargets(environment: 'legacy' | 'nextgen'): {
    passed: boolean;
    violations: string[];
    details: Record<string, { current: number; target: number; percentage: number }>;
  } {
    if (!this.baseline) {
      throw new Error('Performance baseline not established');
    }

    const currentMetrics = this.getAverageMetrics(environment);
    const baselineMetrics = this.baseline[environment];
    const violations: string[] = [];
    const details: Record<string, { current: number; target: number; percentage: number }> = {};

    // Check render time
    const renderTimeIncrease = ((currentMetrics.renderTime - baselineMetrics.renderTime) / baselineMetrics.renderTime) * 100;
    details.renderTime = {
      current: renderTimeIncrease,
      target: this.targets.renderTimeIncrease,
      percentage: renderTimeIncrease,
    };
    if (renderTimeIncrease > this.targets.renderTimeIncrease) {
      violations.push(`Render time increase (${renderTimeIncrease.toFixed(2)}%) exceeds target (${this.targets.renderTimeIncrease}%)`);
    }

    // Check memory usage
    const memoryUsageIncrease = ((currentMetrics.memoryUsage - baselineMetrics.memoryUsage) / baselineMetrics.memoryUsage) * 100;
    details.memoryUsage = {
      current: memoryUsageIncrease,
      target: this.targets.memoryUsageIncrease,
      percentage: memoryUsageIncrease,
    };
    if (memoryUsageIncrease > this.targets.memoryUsageIncrease) {
      violations.push(`Memory usage increase (${memoryUsageIncrease.toFixed(2)}%) exceeds target (${this.targets.memoryUsageIncrease}%)`);
    }

    // Check bundle size
    const bundleSizeIncrease = ((currentMetrics.bundleSize - baselineMetrics.bundleSize) / baselineMetrics.bundleSize) * 100;
    details.bundleSize = {
      current: bundleSizeIncrease,
      target: this.targets.bundleSizeIncrease,
      percentage: bundleSizeIncrease,
    };
    if (bundleSizeIncrease > this.targets.bundleSizeIncrease) {
      violations.push(`Bundle size increase (${bundleSizeIncrease.toFixed(2)}%) exceeds target (${this.targets.bundleSizeIncrease}%)`);
    }

    // Check startup time
    const startupTimeIncrease = ((currentMetrics.startupTime - baselineMetrics.startupTime) / baselineMetrics.startupTime) * 100;
    details.startupTime = {
      current: startupTimeIncrease,
      target: this.targets.startupTimeIncrease,
      percentage: startupTimeIncrease,
    };
    if (startupTimeIncrease > this.targets.startupTimeIncrease) {
      violations.push(`Startup time increase (${startupTimeIncrease.toFixed(2)}%) exceeds target (${this.targets.startupTimeIncrease}%)`);
    }

    // Check dual mount overhead
    const dualMountOverhead = currentMetrics.dualMountOverhead;
    details.dualMountOverhead = {
      current: dualMountOverhead,
      target: this.targets.dualMountOverhead,
      percentage: dualMountOverhead,
    };
    if (dualMountOverhead > this.targets.dualMountOverhead) {
      violations.push(`Dual mount overhead (${dualMountOverhead.toFixed(2)}%) exceeds target (${this.targets.dualMountOverhead}%)`);
    }

    return {
      passed: violations.length === 0,
      violations,
      details,
    };
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    totalMetrics: number;
    averageRenderTime: number;
    averageMemoryUsage: number;
    environmentBreakdown: Record<string, number>;
    recentMetrics: PerformanceMetrics[];
  } {
    const totalMetrics = this.metrics.length;
    const averageRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / totalMetrics || 0;
    const averageMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / totalMetrics || 0;
    
    const environmentBreakdown = this.metrics.reduce((acc, m) => {
      acc[m.environment] = (acc[m.environment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentMetrics = this.metrics.slice(-10);

    return {
      totalMetrics,
      averageRenderTime,
      averageMemoryUsage,
      environmentBreakdown,
      recentMetrics,
    };
  }

  /**
   * Add observer for performance metrics
   */
  addObserver(observer: (metrics: PerformanceMetrics) => void): void {
    this.observers.add(observer);
  }

  /**
   * Remove observer
   */
  removeObserver(observer: (metrics: PerformanceMetrics) => void): void {
    this.observers.delete(observer);
  }

  /**
   * Notify all observers
   */
  private notifyObservers(metrics: PerformanceMetrics): void {
    this.observers.forEach(observer => {
      try {
        observer(metrics);
      } catch (error) {
        console.error('PerformanceMonitor: Observer error:', error);
      }
    });
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    console.log('🔍 PerformanceMonitor: Metrics cleared');
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

// Performance monitoring hooks for React components

export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  const recordComponentRender = (componentName: string, environment: 'legacy' | 'nextgen') => {
    const startTime = Date.now();
    
    return () => {
      const renderTime = Date.now() - startTime;
      monitor.recordComponentMetrics(componentName, renderTime, environment);
    };
  };

  const recordScreenRender = (screenName: string, environment: 'legacy' | 'nextgen') => {
    const startTime = Date.now();
    
    return () => {
      const renderTime = Date.now() - startTime;
      monitor.recordScreenMetrics(screenName, renderTime, environment);
    };
  };

  return {
    recordComponentRender,
    recordScreenRender,
    monitor,
  };
};

// Performance monitoring HOC for components

export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  environment: 'legacy' | 'nextgen'
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { recordComponentRender } = usePerformanceMonitor();
    const recordRender = recordComponentRender(componentName, environment);

    React.useEffect(() => {
      recordRender();
    });

    return React.createElement(WrappedComponent, { ...props, ref } as any);
  });
}; 