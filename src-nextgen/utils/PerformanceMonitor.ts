export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  phase: string;
  timestamp: number;
  memoryUsage?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public recordComponentMetrics(componentName: string, renderTime: number, phase: string): () => void {
    if (!this.isEnabled) {
      return () => {};
    }

    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      phase,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    return () => {
      // Cleanup function
      const index = this.metrics.findIndex(m => m === metric);
      if (index > -1) {
        this.metrics.splice(index, 1);
      }
    };
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    recordComponentRender: (componentName: string, phase: string) => 
      (renderTime: number) => monitor.recordComponentMetrics(componentName, renderTime, phase),
    getMetrics: () => monitor.getMetrics(),
    clearMetrics: () => monitor.clearMetrics(),
    setEnabled: (enabled: boolean) => monitor.setEnabled(enabled),
    isEnabled: () => monitor.isMonitoringEnabled(),
  };
}; 