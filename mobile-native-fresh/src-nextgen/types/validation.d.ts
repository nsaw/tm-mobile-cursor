/**
 * Type declarations for validation system
 * Comprehensive type definitions for role system validation
 */

declare module 'validation' {
  // Core validation types
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    duration?: number;
    timestamp?: number;
    metadata?: Record<string, unknown>;
  }

  export interface ValidationContext {
    componentId: string;
    environment: 'legacy' | 'nextgen';
    timestamp: string;
    validationLevel: 'basic' | 'comprehensive' | 'strict';
  }

  // Role validation types
  export interface RoleValidationContext extends ValidationContext {
    role: string;
    roleConfig?: Record<string, unknown>;
    componentProps?: Record<string, unknown>;
  }

  export interface RoleValidationResult extends ValidationResult {
    role: string;
    componentId: string;
    suggestions: string[];
    roleCompatibility: boolean;
    roleHierarchy: string[];
  }

  // Type validation types
  export interface TypeValidationContext extends ValidationContext {
    typeName: string;
    typeDefinition: string;
    typeUsage: string[];
  }

  export interface TypeValidationResult extends ValidationResult {
    typeName: string;
    typeCompatibility: boolean;
    typeConflicts: string[];
    typeSuggestions: string[];
  }

  // System validation types
  export interface SystemValidationContext extends ValidationContext {
    systemName: string;
    systemVersion: string;
    validationScope: 'local' | 'global' | 'comprehensive';
  }

  export interface SystemValidationResult extends ValidationResult {
    systemName: string;
    systemHealth: 'healthy' | 'warning' | 'critical';
    systemMetrics: Record<string, number>;
    systemRecommendations: string[];
  }

  // Validation function types
  export type ValidationFunction<T = unknown> = (input: T, context: ValidationContext) => Promise<ValidationResult>;
  export type RoleValidationFunction = (role: string, context: RoleValidationContext) => Promise<RoleValidationResult>;
  export type TypeValidationFunction = (typeName: string, context: TypeValidationContext) => Promise<TypeValidationResult>;
  export type SystemValidationFunction = (systemName: string, context: SystemValidationContext) => Promise<SystemValidationResult>;

  // Validation registry types
  export interface ValidationRegistry {
    registerValidation(name: string, validator: ValidationFunction): void;
    getValidation(name: string): ValidationFunction | undefined;
    listValidations(): string[];
    removeValidation(name: string): boolean;
  }

  // Validation pipeline types
  export interface ValidationPipeline {
    addStep(step: ValidationFunction): ValidationPipeline;
    execute(input: unknown, context: ValidationContext): Promise<ValidationResult[]>;
    clear(): void;
  }

  // Validation cache types
  export interface ValidationCache {
    set(key: string, result: ValidationResult, ttl?: number): void;
    get(key: string): ValidationResult | null;
    clear(): void;
    size(): number;
  }

  // Validation metrics types
  export interface ValidationMetrics {
    totalValidations: number;
    successfulValidations: number;
    failedValidations: number;
    averageDuration: number;
    lastValidationTime: number;
    validationHistory: ValidationResult[];
  }

  // Validation configuration types
  export interface ValidationConfig {
    enableCaching: boolean;
    cacheTTL: number;
    enableMetrics: boolean;
    validationLevel: 'basic' | 'comprehensive' | 'strict';
    maxConcurrentValidations: number;
    timeoutMs: number;
  }

  // Validation error types
  export interface ValidationError extends Error {
    code: string;
    context: ValidationContext;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recoverable: boolean;
  }

  // Validation warning types
  export interface ValidationWarning {
    message: string;
    context: ValidationContext;
    severity: 'low' | 'medium' | 'high';
    suggestion?: string;
  }

  // Validation suggestion types
  export interface ValidationSuggestion {
    message: string;
    context: ValidationContext;
    priority: 'low' | 'medium' | 'high';
    implementation?: string;
  }

  // Validation report types
  export interface ValidationReport {
    summary: {
      total: number;
      passed: number;
      failed: number;
      warnings: number;
      duration: number;
    };
    results: ValidationResult[];
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: ValidationSuggestion[];
    metadata: Record<string, unknown>;
  }

  // Validation event types
  export interface ValidationEvent {
    type: 'validation_started' | 'validation_completed' | 'validation_failed' | 'validation_warning';
    context: ValidationContext;
    result?: ValidationResult;
    error?: ValidationError;
    timestamp: number;
  }

  // Validation listener types
  export type ValidationListener = (event: ValidationEvent) => void;

  // Validation manager types
  export interface ValidationManager {
    validate(input: unknown, context: ValidationContext): Promise<ValidationResult>;
    validateRole(role: string, context: RoleValidationContext): Promise<RoleValidationResult>;
    validateType(typeName: string, context: TypeValidationContext): Promise<TypeValidationResult>;
    validateSystem(systemName: string, context: SystemValidationContext): Promise<SystemValidationResult>;
    getMetrics(): ValidationMetrics;
    getConfig(): ValidationConfig;
    setConfig(config: Partial<ValidationConfig>): void;
    addListener(listener: ValidationListener): void;
    removeListener(listener: ValidationListener): void;
    destroy(): void;
  }
}

// Global validation namespace
declare global {
  namespace Validation {
    export type Result = import('validation').ValidationResult;
    export type Context = import('validation').ValidationContext;
    export type Manager = import('validation').ValidationManager;
    export type Config = import('validation').ValidationConfig;
    export type Metrics = import('validation').ValidationMetrics;
    export type Report = import('validation').ValidationReport;
  }
} 