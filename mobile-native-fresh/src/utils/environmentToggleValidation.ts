// src/utils/environmentToggleValidation.ts
// Comprehensive environment toggle validation system

import { 
  getCurrentEnvironment, 
  toggleEnvironment, 
  setEnvironment, 
  getDualMountConfig,
  getDualMountStatus,
  validateDualMountConfiguration,
  addEnvironmentChangeCallback,
  removeEnvironmentChangeCallback,
  getDebugState
} from './dualMountToggle';

export interface ValidationResult {
  success: boolean;
  testName: string;
  details: string;
  timestamp: number;
  environment?: 'legacy' | 'nextgen';
  error?: string;
}

export interface ValidationSuite {
  name: string;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    successRate: number;
  };
  timestamp: number;
}

export class EnvironmentToggleValidator {
  private callbacks: Array<() => void> = [];
  private validationHistory: ValidationSuite[] = [];

  /**
   * Run comprehensive environment toggle validation
   */
  async runFullValidation(): Promise<ValidationSuite> {
    const results: ValidationResult[] = [];
    const startTime = Date.now();

    // Test 1: Initial environment detection
    results.push(await this.testInitialEnvironmentDetection());

    // Test 2: Environment toggle functionality
    results.push(await this.testEnvironmentToggle());

    // Test 3: Environment setting
    results.push(await this.testEnvironmentSetting());

    // Test 4: Configuration validation
    results.push(await this.testConfigurationValidation());

    // Test 5: Status reporting
    results.push(await this.testStatusReporting());

    // Test 6: Callback system
    results.push(await this.testCallbackSystem());

    // Test 7: Debug state
    results.push(await this.testDebugState());

    // Test 8: Environment consistency
    results.push(await this.testEnvironmentConsistency());

    const passed = results.filter(r => r.success).length;
    const total = results.length;

    const suite: ValidationSuite = {
      name: 'Environment Toggle Validation Suite',
      results,
      summary: {
        total,
        passed,
        failed: total - passed,
        successRate: (passed / total) * 100,
      },
      timestamp: startTime,
    };

    this.validationHistory.push(suite);
    return suite;
  }

  /**
   * Test initial environment detection
   */
  private async testInitialEnvironmentDetection(): Promise<ValidationResult> {
    try {
      const environment = getCurrentEnvironment();
      const isValid = environment === 'legacy' || environment === 'nextgen';
      
      return {
        success: isValid,
        testName: 'Initial Environment Detection',
        details: `Detected environment: ${environment}`,
        timestamp: Date.now(),
        environment,
        error: isValid ? undefined : 'Invalid environment detected',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Initial Environment Detection',
        details: 'Failed to detect initial environment',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test environment toggle functionality
   */
  private async testEnvironmentToggle(): Promise<ValidationResult> {
    try {
      const initialEnv = getCurrentEnvironment();
      const toggleResult = toggleEnvironment();
      const newEnv = getCurrentEnvironment();
      
      const success = toggleResult.success && 
                     newEnv !== initialEnv &&
                     toggleResult.currentEnvironment === newEnv;

      return {
        success,
        testName: 'Environment Toggle',
        details: `Toggled from ${initialEnv} to ${newEnv}`,
        timestamp: Date.now(),
        environment: newEnv,
        error: success ? undefined : 'Toggle operation failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Environment Toggle',
        details: 'Toggle operation threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test environment setting
   */
  private async testEnvironmentSetting(): Promise<ValidationResult> {
    try {
      const targetEnv: 'legacy' | 'nextgen' = 'legacy';
      const setResult = setEnvironment(targetEnv);
      const currentEnv = getCurrentEnvironment();
      
      const success = setResult.success && currentEnv === targetEnv;

      return {
        success,
        testName: 'Environment Setting',
        details: `Set environment to ${targetEnv}, current: ${currentEnv}`,
        timestamp: Date.now(),
        environment: currentEnv,
        error: success ? undefined : 'Environment setting failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Environment Setting',
        details: 'Environment setting threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test configuration validation
   */
  private async testConfigurationValidation(): Promise<ValidationResult> {
    try {
      const isValid = validateDualMountConfiguration();
      const config = getDualMountConfig();
      
      const success = isValid && 
                     config.environment === 'legacy' || config.environment === 'nextgen';

      return {
        success,
        testName: 'Configuration Validation',
        details: `Configuration valid: ${isValid}, environment: ${config.environment}`,
        timestamp: Date.now(),
        environment: config.environment,
        error: success ? undefined : 'Configuration validation failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Configuration Validation',
        details: 'Configuration validation threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test status reporting
   */
  private async testStatusReporting(): Promise<ValidationResult> {
    try {
      const status = getDualMountStatus();
      
      const success = status.isInitialized &&
                     (status.currentEnvironment === 'legacy' || status.currentEnvironment === 'nextgen');

      return {
        success,
        testName: 'Status Reporting',
        details: `Status: initialized=${status.isInitialized}, environment=${status.currentEnvironment}`,
        timestamp: Date.now(),
        environment: status.currentEnvironment,
        error: success ? undefined : 'Status reporting failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Status Reporting',
        details: 'Status reporting threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test callback system
   */
  private async testCallbackSystem(): Promise<ValidationResult> {
    try {
      let callbackCalled = false;
      let callbackEnvironment: 'legacy' | 'nextgen' | undefined;

      const callback = (environment: 'legacy' | 'nextgen') => {
        callbackCalled = true;
        callbackEnvironment = environment;
      };

      addEnvironmentChangeCallback(callback);
      
      // Trigger environment change
      const currentEnv = getCurrentEnvironment();
      const targetEnv = currentEnv === 'legacy' ? 'nextgen' : 'legacy';
      setEnvironment(targetEnv);

      // Clean up
      removeEnvironmentChangeCallback(callback);

      const success = callbackCalled && callbackEnvironment === targetEnv;

      return {
        success,
        testName: 'Callback System',
        details: `Callback called: ${callbackCalled}, environment: ${callbackEnvironment}`,
        timestamp: Date.now(),
        environment: callbackEnvironment,
        error: success ? undefined : 'Callback system failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Callback System',
        details: 'Callback system threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test debug state
   */
  private async testDebugState(): Promise<ValidationResult> {
    try {
      const debugState = getDebugState();
      
      const success = debugState.config &&
                     debugState.envVars &&
                     debugState.timestamp;

      return {
        success,
        testName: 'Debug State',
        details: `Debug state available: ${success}`,
        timestamp: Date.now(),
        environment: debugState.config?.environment,
        error: success ? undefined : 'Debug state failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Debug State',
        details: 'Debug state threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Test environment consistency
   */
  private async testEnvironmentConsistency(): Promise<ValidationResult> {
    try {
      const currentEnv = getCurrentEnvironment();
      const config = getDualMountConfig();
      const status = getDualMountStatus();
      
      const success = currentEnv === config.environment &&
                     currentEnv === status.currentEnvironment &&
                     (currentEnv === 'legacy' || currentEnv === 'nextgen');

      return {
        success,
        testName: 'Environment Consistency',
        details: `All sources report: ${currentEnv}`,
        timestamp: Date.now(),
        environment: currentEnv,
        error: success ? undefined : 'Environment consistency check failed',
      };
    } catch (error) {
      return {
        success: false,
        testName: 'Environment Consistency',
        details: 'Environment consistency check threw an error',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get validation history
   */
  getValidationHistory(): ValidationSuite[] {
    return [...this.validationHistory];
  }

  /**
   * Clear validation history
   */
  clearValidationHistory(): void {
    this.validationHistory = [];
  }

  /**
   * Get latest validation result
   */
  getLatestValidation(): ValidationSuite | null {
    return this.validationHistory.length > 0 
      ? this.validationHistory[this.validationHistory.length - 1] 
      : null;
  }
}

// Export singleton instance
export const environmentToggleValidator = new EnvironmentToggleValidator();

// Export convenience functions
export async function runEnvironmentToggleValidation(): Promise<ValidationSuite> {
  return environmentToggleValidator.runFullValidation();
}

export function getEnvironmentToggleValidationHistory(): ValidationSuite[] {
  return environmentToggleValidator.getValidationHistory();
}

export function getLatestEnvironmentToggleValidation(): ValidationSuite | null {
  return environmentToggleValidator.getLatestValidation();
} 