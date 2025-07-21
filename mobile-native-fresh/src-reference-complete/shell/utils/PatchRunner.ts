export interface PatchExecution {
  id: string;
  patchFile: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  error?: string;
  validationResults: ValidationResult[];
}

export interface ValidationResult {
  type: 'parse' | 'typecheck' | 'lint' | 'test' | 'custom';
  status: 'pass' | 'fail';
  message?: string;
  details?: any;
}

export interface PatchRunnerConfig {
  autoExecute: boolean;
  validateBeforeExecute: boolean;
  rollbackOnFailure: boolean;
  maxConcurrentPatches: number;
  timeoutSeconds: number;
}

export class PatchRunner {
  private executions: Map<string, PatchExecution> = new Map();
  private config: PatchRunnerConfig;
  private executionQueue: string[] = [];
  private isExecuting = false;

  constructor(config: Partial<PatchRunnerConfig> = {}) {
    this.config = {
      autoExecute: true,
      validateBeforeExecute: true,
      rollbackOnFailure: true,
      maxConcurrentPatches: 1,
      timeoutSeconds: 300,
      ...config
    };
  }

  async executePatch(patchFile: string): Promise<PatchExecution> {
    const executionId = `execution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: PatchExecution = {
      id: executionId,
      patchFile,
      status: 'pending',
      validationResults: []
    };

    this.executions.set(executionId, execution);
    this.executionQueue.push(executionId);

    if (this.config.autoExecute && !this.isExecuting) {
      await this.processQueue();
    }

    return execution;
  }

  private async processQueue(): Promise<void> {
    if (this.isExecuting || this.executionQueue.length === 0) return;

    this.isExecuting = true;

    try {
      while (this.executionQueue.length > 0) {
        const executionId = this.executionQueue.shift()!;
        await this.executeSinglePatch(executionId);
      }
    } finally {
      this.isExecuting = false;
    }
  }

  private async executeSinglePatch(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) return;

    execution.status = 'executing';
    execution.startTime = new Date();

    try {
      // Validate before execution if configured
      if (this.config.validateBeforeExecute) {
        const validationResult = await this.validatePatch(execution.patchFile);
        execution.validationResults.push(validationResult);
        
        if (validationResult.status === 'fail') {
          throw new Error(`Patch validation failed: ${validationResult.message}`);
        }
      }

      // Execute the patch
      await this.runPatchExecution(execution);

      execution.status = 'completed';
      execution.endTime = new Date();

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error instanceof Error ? error.message : String(error);

      if (this.config.rollbackOnFailure) {
        await this.rollbackPatch(execution);
      }
    }
  }

  private async validatePatch(patchFile: string): Promise<ValidationResult> {
    // Simulate patch validation
    return {
      type: 'custom',
      status: 'pass',
      message: 'Patch validation passed'
    };
  }

  private async runPatchExecution(execution: PatchExecution): Promise<void> {
    // Simulate patch execution
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async rollbackPatch(execution: PatchExecution): Promise<void> {
    // Simulate patch rollback
    console.log(`Rolling back patch: ${execution.patchFile}`);
  }

  getExecution(executionId: string): PatchExecution | undefined {
    return this.executions.get(executionId);
  }

  getAllExecutions(): PatchExecution[] {
    return Array.from(this.executions.values());
  }

  getPendingExecutions(): PatchExecution[] {
    return this.getAllExecutions().filter(e => e.status === 'pending');
  }

  getFailedExecutions(): PatchExecution[] {
    return this.getAllExecutions().filter(e => e.status === 'failed');
  }

  clearExecutions(): void {
    this.executions.clear();
    this.executionQueue = [];
  }

  updateConfig(newConfig: Partial<PatchRunnerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const patchRunner = new PatchRunner(); 