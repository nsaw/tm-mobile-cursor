export interface ValidationResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  timestamp: Date;
}

export interface ValidationSuite {
  id: string;
  name: string;
  description: string;
  tests: ValidationTest[];
}

export interface ValidationTest {
  id: string;
  name: string;
  description: string;
  category: 'type' | 'lint' | 'test' | 'runtime' | 'performance' | 'security';
  run: () => Promise<ValidationResult>;
}

export interface ValidationReport {
  id: string;
  timestamp: Date;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  results: ValidationResult[];
  summary: string;
}
