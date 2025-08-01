import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ValidationResult {
  success: boolean;
  message: string;
  details?: any;
  duration: number;
}

export interface ValidationGate {
  name: string;
  description: string;
  validator: () => Promise<ValidationResult>;
  required: boolean;
}

/**
 * PatchValidator - Comprehensive patch validation system
 * 
 * This class provides validation for patches including TypeScript compilation,
 * ESLint checks, unit tests, and custom validation gates.
 */
export class PatchValidator {
  private validationGates: ValidationGate[] = [];

  constructor() {
    this.initializeValidationGates();
  }

  /**
   * Initialize default validation gates
   */
  private initializeValidationGates(): void {
    this.validationGates = [
      {
        name: 'typescript-compilation',
        description: 'TypeScript compilation check',
        validator: this.validateTypeScriptCompilation.bind(this),
        required: true,
      },
      {
        name: 'eslint-validation',
        description: 'ESLint validation check',
        validator: this.validateESLint.bind(this),
        required: true,
      },
      {
        name: 'unit-tests',
        description: 'Unit test execution',
        validator: this.validateUnitTests.bind(this),
        required: true,
      },
      {
        name: 'dual-mount-system',
        description: 'Dual-mount system validation',
        validator: this.validateDualMountSystem.bind(this),
        required: true,
      },
      {
        name: 'environment-specific',
        description: 'Environment-specific validation',
        validator: this.validateEnvironmentSpecific.bind(this),
        required: true,
      },
    ];
  }

  /**
   * Add a custom validation gate
   */
  addValidationGate(gate: ValidationGate): void {
    this.validationGates.push(gate);
  }

  /**
   * Remove a validation gate
   */
  removeValidationGate(gateName: string): void {
    this.validationGates = this.validationGates.filter(gate => gate.name !== gateName);
  }

  /**
   * Get all validation gates
   */
  getValidationGates(): ValidationGate[] {
    return this.validationGates;
  }

  /**
   * Run all validation gates
   */
  async runAllValidations(): Promise<Record<string, ValidationResult>> {
    const results: Record<string, ValidationResult> = {};

    console.log('🔍 Running all validation gates...');

    for (const gate of this.validationGates) {
      try {
        console.log(`  Running: ${gate.name} - ${gate.description}`);
        const startTime = Date.now();
        const result = await gate.validator();
        result.duration = Date.now() - startTime;
        results[gate.name] = result;

        if (result.success) {
          console.log(`  ✅ ${gate.name}: PASSED (${result.duration}ms)`);
        } else {
          console.log(`  ❌ ${gate.name}: FAILED (${result.duration}ms) - ${result.message}`);
        }
      } catch (error) {
        const result: ValidationResult = {
          success: false,
          message: `Validation gate execution failed: ${error}`,
          duration: 0,
        };
        results[gate.name] = result;
        console.log(`  ❌ ${gate.name}: ERROR - ${result.message}`);
      }
    }

    return results;
  }

  /**
   * Run required validation gates only
   */
  async runRequiredValidations(): Promise<Record<string, ValidationResult>> {
    const requiredGates = this.validationGates.filter(gate => gate.required);
    const results: Record<string, ValidationResult> = {};

    console.log('🔍 Running required validation gates...');

    for (const gate of requiredGates) {
      try {
        console.log(`  Running: ${gate.name} - ${gate.description}`);
        const startTime = Date.now();
        const result = await gate.validator();
        result.duration = Date.now() - startTime;
        results[gate.name] = result;

        if (result.success) {
          console.log(`  ✅ ${gate.name}: PASSED (${result.duration}ms)`);
        } else {
          console.log(`  ❌ ${gate.name}: FAILED (${result.duration}ms) - ${result.message}`);
        }
      } catch (error) {
        const result: ValidationResult = {
          success: false,
          message: `Validation gate execution failed: ${error}`,
          duration: 0,
        };
        results[gate.name] = result;
        console.log(`  ❌ ${gate.name}: ERROR - ${result.message}`);
      }
    }

    return results;
  }

  /**
   * Validate TypeScript compilation
   */
  private async validateTypeScriptCompilation(): Promise<ValidationResult> {
    try {
      const { stdout, stderr } = await execAsync('npx tsc --noEmit --skipLibCheck');
      
      if (stderr && stderr.trim()) {
        return {
          success: false,
          message: `TypeScript compilation errors: ${stderr}`,
          details: { stderr },
          duration: 0,
        };
      }

      return {
        success: true,
        message: 'TypeScript compilation successful',
        details: { stdout },
        duration: 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `TypeScript compilation failed: ${error}`,
        details: { error },
        duration: 0,
      };
    }
  }

  /**
   * Validate ESLint
   */
  private async validateESLint(): Promise<ValidationResult> {
    try {
      const { stdout, stderr } = await execAsync('npx eslint . --ext .ts,.tsx --max-warnings=0');
      
      if (stderr && stderr.trim()) {
        return {
          success: false,
          message: `ESLint errors: ${stderr}`,
          details: { stderr },
          duration: 0,
        };
      }

      return {
        success: true,
        message: 'ESLint validation successful',
        details: { stdout },
        duration: 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `ESLint validation failed: ${error}`,
        details: { error },
        duration: 0,
      };
    }
  }

  /**
   * Validate unit tests
   */
  private async validateUnitTests(): Promise<ValidationResult> {
    try {
      const { stdout, stderr } = await execAsync('yarn test:unit --watchAll=false');
      
      if (stderr && stderr.includes('FAIL')) {
        return {
          success: false,
          message: `Unit tests failed: ${stderr}`,
          details: { stderr },
          duration: 0,
        };
      }

      return {
        success: true,
        message: 'Unit tests passed',
        details: { stdout },
        duration: 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `Unit test execution failed: ${error}`,
        details: { error },
        duration: 0,
      };
    }
  }

  /**
   * Validate dual-mount system
   */
  private async validateDualMountSystem(): Promise<ValidationResult> {
    try {
      const { stdout, stderr } = await execAsync('node scripts/validate-dual-mount.js');
      
      if (stderr && stderr.trim()) {
        return {
          success: false,
          message: `Dual-mount validation errors: ${stderr}`,
          details: { stderr },
          duration: 0,
        };
      }

      return {
        success: true,
        message: 'Dual-mount system validation successful',
        details: { stdout },
        duration: 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `Dual-mount validation failed: ${error}`,
        details: { error },
        duration: 0,
      };
    }
  }

  /**
   * Validate environment-specific functionality
   */
  private async validateEnvironmentSpecific(): Promise<ValidationResult> {
    try {
      const { stdout, stderr } = await execAsync('node scripts/validate-environment-specific.js');
      
      if (stderr && stderr.trim()) {
        return {
          success: false,
          message: `Environment-specific validation errors: ${stderr}`,
          details: { stderr },
          duration: 0,
        };
      }

      return {
        success: true,
        message: 'Environment-specific validation successful',
        details: { stdout },
        duration: 0,
      };
    } catch (error) {
      return {
        success: false,
        message: `Environment-specific validation failed: ${error}`,
        details: { error },
        duration: 0,
      };
    }
  }

  /**
   * Check if all validations passed
   */
  allValidationsPassed(results: Record<string, ValidationResult>): boolean {
    return Object.values(results).every(result => result.success);
  }

  /**
   * Get failed validations
   */
  getFailedValidations(results: Record<string, ValidationResult>): string[] {
    return Object.entries(results)
      .filter(([_, result]) => !result.success)
      .map(([name, result]) => `${name}: ${result.message}`);
  }
}

// Export singleton instance
export const patchValidator = new PatchValidator();

export default patchValidator; 