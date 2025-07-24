// src-nextgen/utils/PerformanceMonitor.ts
// Comprehensive performance monitoring system for Phase 3 migration

import {  InteractionManager } from 'react-native';

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
  timestamp: number;
  version: string;
}

export interface PerformanceTargets {
  renderTimeIncrease: number; // percentage
  memoryUsageIncrease: number; // percentage
  bundleSizeIncrease: number; // percentage
  startupTimeIncrease: number; // percentage
  dualMountOverhead: number; // percentage
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
   * Start performance monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🔍 PerformanceMonitor: Started monitoring');
    
    // Monitor render performance
    this.monitorRenderPerformance();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor startup time
    this.monitorStartupTime();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('🔍 PerformanceMonitor: Stopped monitoring');
  }

  /**
   * Record performance metrics for a component
   */
  recordComponentMetrics(
    componentName: string,
    renderTime: number,
    environment: 'legacy' | 'nextgen'
  ): void {
    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
      componentName,
    };

    this.metrics.push(metrics);
    this.notifyObservers(metrics);
    
    console.log(`🔍 PerformanceMonitor: Recorded metrics for ${componentName}`, metrics);
  }

  /**
   * Record performance metrics for a screen
   */
  recordScreenMetrics(
    screenName: string,
    renderTime: number,
    environment: 'legacy' | 'nextgen'
  ): void {
    const metrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: this.getCurrentMemoryUsage(),
      bundleSize: this.getBundleSize(),
      startupTime: this.getStartupTime(),
      dualMountOverhead: this.calculateDualMountOverhead(),
      timestamp: Date.now(),
      environment,
      screenName,
    };

    this.metrics.push(metrics);
    this.notifyObservers(metrics);
    
    console.log(`🔍 PerformanceMonitor: Recorded metrics for screen ${screenName}`, metrics);
  }

  /**
   * Establish performance baseline
   */
  establishBaseline(): PerformanceBaseline {
    const legacyMetrics = this.getAverageMetrics('legacy');
    const nextgenMetrics = this.getAverageMetrics('nextgen');

    this.baseline = {
      legacy: legacyMetrics,
      nextgen: nextgenMetrics,
      timestamp: Date.now(),
      version: '1.4.1',
    };

    console.log('🔍 PerformanceMonitor: Baseline established', this.baseline);
    return this.baseline;
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

    // Check dual-mount overhead
    const dualMountOverhead = currentMetrics.dualMountOverhead;
    details.dualMountOverhead = {
      current: dualMountOverhead,
      target: this.targets.dualMountOverhead,
      percentage: dualMountOverhead,
    };
    if (dualMountOverhead > this.targets.dualMountOverhead) {
      violations.push(`Dual-mount overhead (${dualMountOverhead.toFixed(2)}%) exceeds target (${this.targets.dualMountOverhead}%)`);
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
    baseline: PerformanceBaseline | null;
    currentMetrics: PerformanceMetrics[];
    targets: PerformanceTargets;
    summary: {
      totalMeasurements: number;
      legacyMeasurements: number;
      nextgenMeasurements: number;
      averageRenderTime: { legacy: number; nextgen: number };
      averageMemoryUsage: { legacy: number; nextgen: number };
    };
  } {
    const legacyMetrics = this.metrics.filter(m => m.environment === 'legacy');
    const nextgenMetrics = this.metrics.filter(m => m.environment === 'nextgen');

    const averageRenderTime = {
      legacy: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.renderTime, 0) / legacyMetrics.length : 0,
      nextgen: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.renderTime, 0) / nextgenMetrics.length : 0,
    };

    const averageMemoryUsage = {
      legacy: legacyMetrics.length > 0 ? legacyMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / legacyMetrics.length : 0,
      nextgen: nextgenMetrics.length > 0 ? nextgenMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / nextgenMetrics.length : 0,
    };

    return {
      baseline: this.baseline,
      currentMetrics: this.metrics,
      targets: this.targets,
      summary: {
        totalMeasurements: this.metrics.length,
        legacyMeasurements: legacyMetrics.length,
        nextgenMeasurements: nextgenMetrics.length,
        averageRenderTime,
        averageMemoryUsage,
      },
    };
  }

  /**
   * Add performance observer
   */
  addObserver(observer: (metrics: PerformanceMetrics) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    console.log('🔍 PerformanceMonitor: Metrics cleared');
  }

  /**
   * Export metrics to JSON
   */
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      baseline: this.baseline,
      targets: this.targets,
      timestamp: Date.now(),
    }, null, 2);
  }

  // Private methods

  private monitorRenderPerformance(): void {
    // Monitor component render performance
    InteractionManager.runAfterInteractions(() => {
      // This will be called after interactions complete
      // We can use this to measure render performance
    });
  }

  private monitorMemoryUsage(): void {
    // Monitor memory usage periodically
    setInterval(() => {
      const memoryUsage = this.getCurrentMemoryUsage();
      console.log(`🔍 PerformanceMonitor: Current memory usage: ${memoryUsage}MB`);
    }, 5000); // Check every 5 seconds
  }

  private monitorStartupTime(): void {
    // Monitor startup time
    const startTime = Date.now();
    InteractionManager.runAfterInteractions(() => {
      const startupTime = Date.now() - startTime;
      console.log(`🔍 PerformanceMonitor: Startup time: ${startupTime}ms`);
    });
  }

  private getCurrentMemoryUsage(): number {
    // This is a placeholder - in a real implementation, you would use
    // React Native's performance APIs or native modules to get actual memory usage
    return Math.random() * 100 + 50; // Simulated memory usage between 50-150MB
  }

  private getBundleSize(): number {
    // This is a placeholder - in a real implementation, you would get the actual bundle size
    return 2.5; // Simulated bundle size in MB
  }

  private getStartupTime(): number {
    // This is a placeholder - in a real implementation, you would measure actual startup time
    return Math.random() * 1000 + 500; // Simulated startup time between 500-1500ms
  }

  private calculateDualMountOverhead(): number {
    // This is a placeholder - in a real implementation, you would measure the actual overhead
    return Math.random() * 2; // Simulated dual-mount overhead between 0-2%
  }

  private getAverageMetrics(environment: 'legacy' | 'nextgen'): PerformanceMetrics {
    const environmentMetrics = this.metrics.filter(m => m.environment === environment);
    
    if (environmentMetrics.length === 0) {
      return {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        startupTime: 0,
        dualMountOverhead: 0,
        timestamp: Date.now(),
        environment,
      };
    }

    const averageMetrics = environmentMetrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage,
        bundleSize: acc.bundleSize + metric.bundleSize,
        startupTime: acc.startupTime + metric.startupTime,
        dualMountOverhead: acc.dualMountOverhead + metric.dualMountOverhead,
        timestamp: Date.now(),
        environment,
      }),
      {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        startupTime: 0,
        dualMountOverhead: 0,
        timestamp: Date.now(),
        environment,
      }
    );

    const count = environmentMetrics.length;
    return {
      renderTime: averageMetrics.renderTime / count,
      memoryUsage: averageMetrics.memoryUsage / count,
      bundleSize: averageMetrics.bundleSize / count,
      startupTime: averageMetrics.startupTime / count,
      dualMountOverhead: averageMetrics.dualMountOverhead / count,
      timestamp: Date.now(),
      environment,
    };
  }

  private notifyObservers(metrics: PerformanceMetrics): void {
    this.observers.forEach(observer => {
      try {
        observer(metrics);
      } catch (error) {
        console.error('🔍 PerformanceMonitor: Observer error', error);
      }
    });
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

    return React.createElement(WrappedComponent, { ...props, ref });
  });
};

export default PerformanceMonitor; 