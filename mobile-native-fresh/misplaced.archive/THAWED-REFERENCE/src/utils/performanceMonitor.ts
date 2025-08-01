// src/utils/performanceMonitor.ts
// Performance monitoring and benchmarking system for dual-mount architecture

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  environment: 'legacy' | 'nextgen';
  timestamp: number;
  sessionId: string;
}

export interface PerformanceBaseline {
  legacy: {
    averageRenderTime: number;
    averageMemoryUsage: number;
    sampleCount: number;
  };
  nextgen: {
    averageRenderTime: number;
    averageMemoryUsage: number;
    sampleCount: number;
  };
}

export interface PerformanceAlert {
  type: 'render_time' | 'memory_usage' | 'component_count';
  threshold: number;
  currentValue: number;
  environment: 'legacy' | 'nextgen';
  timestamp: number;
  severity: 'warning' | 'error' | 'critical';
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private baseline: PerformanceBaseline | null = null;
  private alerts: PerformanceAlert[] = [];
  private sessionId: string;
  private isMonitoring: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    this.isMonitoring = true;
    console.log('🔍 Performance monitoring started');
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('🔍 Performance monitoring stopped');
  }

  /**
   * Record performance metrics
   */
  recordMetrics(metrics: Omit<PerformanceMetrics, 'timestamp' | 'sessionId'>): void {
    if (!this.isMonitoring) return;

    const fullMetrics: PerformanceMetrics = {
      ...metrics,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    this.metrics.push(fullMetrics);
    this.checkAlerts(fullMetrics);
    this.logMetrics(fullMetrics);
  }

  /**
   * Measure render time for a component
   */
  measureRenderTime(componentName: string, environment: 'legacy' | 'nextgen'): () => void {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    return () => {
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      const renderTime = endTime - startTime;
      const memoryUsage = endMemory - startMemory;

      this.recordMetrics({
        renderTime,
        memoryUsage,
        componentCount: 1,
        environment,
      });
    };
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Check for performance alerts
   */
  private checkAlerts(metrics: PerformanceMetrics): void {
    const thresholds = {
      renderTime: { warning: 100, error: 500, critical: 1000 },
      memoryUsage: { warning: 50 * 1024 * 1024, error: 100 * 1024 * 1024, critical: 200 * 1024 * 1024 },
      componentCount: { warning: 100, error: 500, critical: 1000 },
    };

    // Check render time
    if (metrics.renderTime > thresholds.renderTime.critical) {
      this.addAlert('render_time', thresholds.renderTime.critical, metrics.renderTime, metrics.environment, 'critical');
    } else if (metrics.renderTime > thresholds.renderTime.error) {
      this.addAlert('render_time', thresholds.renderTime.error, metrics.renderTime, metrics.environment, 'error');
    } else if (metrics.renderTime > thresholds.renderTime.warning) {
      this.addAlert('render_time', thresholds.renderTime.warning, metrics.renderTime, metrics.environment, 'warning');
    }

    // Check memory usage
    if (metrics.memoryUsage > thresholds.memoryUsage.critical) {
      this.addAlert('memory_usage', thresholds.memoryUsage.critical, metrics.memoryUsage, metrics.environment, 'critical');
    } else if (metrics.memoryUsage > thresholds.memoryUsage.error) {
      this.addAlert('memory_usage', thresholds.memoryUsage.error, metrics.memoryUsage, metrics.environment, 'error');
    } else if (metrics.memoryUsage > thresholds.memoryUsage.warning) {
      this.addAlert('memory_usage', thresholds.memoryUsage.warning, metrics.memoryUsage, metrics.environment, 'warning');
    }

    // Check component count
    if (metrics.componentCount > thresholds.componentCount.critical) {
      this.addAlert('component_count', thresholds.componentCount.critical, metrics.componentCount, metrics.environment, 'critical');
    } else if (metrics.componentCount > thresholds.componentCount.error) {
      this.addAlert('component_count', thresholds.componentCount.error, metrics.componentCount, metrics.environment, 'error');
    } else if (metrics.componentCount > thresholds.componentCount.warning) {
      this.addAlert('component_count', thresholds.componentCount.warning, metrics.componentCount, metrics.environment, 'warning');
    }
  }

  /**
   * Add performance alert
   */
  private addAlert(
    type: PerformanceAlert['type'],
    threshold: number,
    currentValue: number,
    environment: 'legacy' | 'nextgen',
    severity: PerformanceAlert['severity']
  ): void {
    const alert: PerformanceAlert = {
      type,
      threshold,
      currentValue,
      environment,
      timestamp: Date.now(),
      severity,
    };

    this.alerts.push(alert);
    this.logAlert(alert);
  }

  /**
   * Log performance metrics
   */
  private logMetrics(metrics: PerformanceMetrics): void {
    if (__DEV__) {
      console.log(`📊 Performance Metrics [${metrics.environment}]:`, {
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        memoryUsage: `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        componentCount: metrics.componentCount,
        timestamp: new Date(metrics.timestamp).toISOString(),
      });
    }
  }

  /**
   * Log performance alert
   */
  private logAlert(alert: PerformanceAlert): void {
    const emoji = {
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
    }[alert.severity];

    console.warn(`${emoji} Performance Alert [${alert.environment}]:`, {
      type: alert.type,
      threshold: alert.threshold,
      currentValue: alert.currentValue,
      severity: alert.severity,
      timestamp: new Date(alert.timestamp).toISOString(),
    });
  }

  /**
   * Establish performance baseline
   */
  establishBaseline(): PerformanceBaseline {
    const legacyMetrics = this.metrics.filter(m => m.environment === 'legacy');
    const nextgenMetrics = this.metrics.filter(m => m.environment === 'nextgen');

    const calculateBaseline = (metrics: PerformanceMetrics[]) => {
      if (metrics.length === 0) {
        return { averageRenderTime: 0, averageMemoryUsage: 0, sampleCount: 0 };
      }

      const avgRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length;
      const avgMemoryUsage = metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length;

      return {
        averageRenderTime: avgRenderTime,
        averageMemoryUsage: avgMemoryUsage,
        sampleCount: metrics.length,
      };
    };

    this.baseline = {
      legacy: calculateBaseline(legacyMetrics),
      nextgen: calculateBaseline(nextgenMetrics),
    };

    console.log('📊 Performance baseline established:', this.baseline);
    return this.baseline;
  }

  /**
   * Get performance baseline
   */
  getBaseline(): PerformanceBaseline | null {
    return this.baseline;
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get alerts
   */
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.alerts = [];
    console.log('📊 Performance metrics cleared');
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const baseline = this.getBaseline();
    const metrics = this.getMetrics();
    const alerts = this.getAlerts();

    const legacyMetrics = metrics.filter(m => m.environment === 'legacy');
    const nextgenMetrics = metrics.filter(m => m.environment === 'nextgen');

    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      baseline,
      summary: {
        totalMetrics: metrics.length,
        legacyMetrics: legacyMetrics.length,
        nextgenMetrics: nextgenMetrics.length,
        alerts: alerts.length,
      },
      alerts: alerts.map(alert => ({
        type: alert.type,
        severity: alert.severity,
        environment: alert.environment,
        threshold: alert.threshold,
        currentValue: alert.currentValue,
        timestamp: new Date(alert.timestamp).toISOString(),
      })),
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Compare environments
   */
  compareEnvironments(): {
    renderTimeDiff: number;
    memoryUsageDiff: number;
    recommendation: string;
  } {
    const baseline = this.getBaseline();
    if (!baseline) {
      return {
        renderTimeDiff: 0,
        memoryUsageDiff: 0,
        recommendation: 'No baseline established',
      };
    }

    const renderTimeDiff = baseline.nextgen.averageRenderTime - baseline.legacy.averageRenderTime;
    const memoryUsageDiff = baseline.nextgen.averageMemoryUsage - baseline.legacy.averageMemoryUsage;

    let recommendation = 'Performance is comparable';
    if (renderTimeDiff > 100) {
      recommendation = 'NextGen environment has significantly higher render times';
    } else if (renderTimeDiff < -100) {
      recommendation = 'NextGen environment has significantly lower render times';
    }

    if (memoryUsageDiff > 50 * 1024 * 1024) {
      recommendation += ' - NextGen uses significantly more memory';
    } else if (memoryUsageDiff < -50 * 1024 * 1024) {
      recommendation += ' - NextGen uses significantly less memory';
    }

    return {
      renderTimeDiff,
      memoryUsageDiff,
      recommendation,
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export utility functions
export function startPerformanceMonitoring(): void {
  performanceMonitor.startMonitoring();
}

export function stopPerformanceMonitoring(): void {
  performanceMonitor.stopMonitoring();
}

export function measureRenderTime(componentName: string, environment: 'legacy' | 'nextgen'): () => void {
  return performanceMonitor.measureRenderTime(componentName, environment);
}

export function establishPerformanceBaseline(): PerformanceBaseline {
  return performanceMonitor.establishBaseline();
}

export function getPerformanceReport(): string {
  return performanceMonitor.generateReport();
}

export function compareEnvironments(): ReturnType<PerformanceMonitor['compareEnvironments']> {
  return performanceMonitor.compareEnvironments();
} 