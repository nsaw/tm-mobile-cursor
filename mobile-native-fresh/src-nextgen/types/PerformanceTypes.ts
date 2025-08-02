export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

export interface PerformanceBaseline {
  metric: string;
  average: number;
  min: number;
  max: number;
  samples: number;
  lastUpdated: number;
}

export interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  baselines: PerformanceBaseline[];
  violations: PerformanceViolation[];
  timestamp: number;
}

export interface PerformanceViolation {
  metric: string;
  currentValue: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: number;
} 