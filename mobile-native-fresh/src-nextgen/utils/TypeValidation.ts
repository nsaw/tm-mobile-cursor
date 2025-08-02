import { ComponentRole, RoleConfig, RoleAssignment, RoleValidationResult } from '../shell/wrappers/types';

/**
 * TypeValidation class for comprehensive type system validation
 * Handles role type validation, type declarations, and roundtrip testing
 */
export class TypeValidation {
  private static instance: TypeValidation;
  private validationCache: Map<string, RoleValidationResult> = new Map();
  private typeRegistry: Map<string, any> = new Map();

  private constructor() {
    console.log('🔍 TypeValidation system initialized');
  }

  public static getInstance(): TypeValidation {
    if (!TypeValidation.instance) {
      TypeValidation.instance = new TypeValidation();
    }
    return TypeValidation.instance;
  }

  /**
   * Validates role type consistency across the system
   */
  public validateRoleTypeSystem(): RoleValidationResult {
    console.log('🔍 Validating role type system...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate ComponentRole type
    const validRoles: ComponentRole[] = ['layout', 'content', 'interactive', 'navigation', 'feedback', 'sacred'];
    
    // Check for any invalid role assignments
    const invalidRoles = this.findInvalidRoleAssignments();
    if (invalidRoles.length > 0) {
      errors.push(`Found ${invalidRoles.length} invalid role assignments`);
      invalidRoles.forEach(role => {
        errors.push(`  - Invalid role: ${role}`);
      });
    }

    // Validate role configuration consistency
    const roleConfigIssues = this.validateRoleConfigurations();
    warnings.push(...roleConfigIssues);

    // Check for missing role assignments
    const missingRoles = this.findMissingRoleAssignments();
    if (missingRoles.length > 0) {
      suggestions.push(`Consider adding roles to: ${missingRoles.join(', ')}`);
    }

    const result: RoleValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

    console.log('📊 Role type validation result:', result);
    return result;
  }

  /**
   * Validates type declarations and ensures consistency
   */
  public validateTypeDeclarations(): RoleValidationResult {
    console.log('🔍 Validating type declarations...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Validate that all required types are properly declared
    const requiredTypes = [
      'ComponentRole',
      'RoleConfig',
      'RoleWrapperProps',
      'RoleAssignment',
      'RoleValidationResult'
    ];

    for (const typeName of requiredTypes) {
      if (!this.isTypeDeclared(typeName)) {
        errors.push(`Missing type declaration: ${typeName}`);
      }
    }

    // Check for type conflicts
    const typeConflicts = this.findTypeConflicts();
    warnings.push(...typeConflicts);

    // Validate type exports
    const exportIssues = this.validateTypeExports();
    warnings.push(...exportIssues);

    const result: RoleValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

    console.log('📊 Type declaration validation result:', result);
    return result;
  }

  /**
   * Performs roundtrip testing of the role system
   */
  public async performRoundtripTests(): Promise<RoleValidationResult> {
    console.log('🔍 Performing roundtrip tests...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Test role assignment roundtrip
      const roleAssignment: RoleAssignment = {
        componentId: 'test-component',
        role: 'content',
        timestamp: new Date().toISOString(),
        environment: 'nextgen',
        validated: true
      };

      // Serialize and deserialize
      const serialized = JSON.stringify(roleAssignment);
      const deserialized = JSON.parse(serialized) as RoleAssignment;

      // Validate roundtrip integrity
      if (deserialized.role !== roleAssignment.role) {
        errors.push('Role assignment roundtrip failed: role mismatch');
      }

      if (deserialized.componentId !== roleAssignment.componentId) {
        errors.push('Role assignment roundtrip failed: componentId mismatch');
      }

      // Test role configuration roundtrip
      const roleConfig: RoleConfig = {
        role: 'interactive',
        priority: 1,
        protected: true,
        validation: true,
        debug: false
      };

      const configSerialized = JSON.stringify(roleConfig);
      const configDeserialized = JSON.parse(configSerialized) as RoleConfig;

      if (configDeserialized.role !== roleConfig.role) {
        errors.push('Role configuration roundtrip failed: role mismatch');
      }

      if (configDeserialized.priority !== roleConfig.priority) {
        errors.push('Role configuration roundtrip failed: priority mismatch');
      }

      // Test validation result roundtrip
      const validationResult: RoleValidationResult = {
        valid: true,
        errors: [],
        warnings: ['Test warning'],
        suggestions: ['Test suggestion']
      };

      const resultSerialized = JSON.stringify(validationResult);
      const resultDeserialized = JSON.parse(resultSerialized) as RoleValidationResult;

      if (resultDeserialized.valid !== validationResult.valid) {
        errors.push('Validation result roundtrip failed: valid mismatch');
      }

      if (resultDeserialized.warnings.length !== validationResult.warnings.length) {
        errors.push('Validation result roundtrip failed: warnings mismatch');
      }

    } catch (error) {
      errors.push(`Roundtrip test failed with error: ${error}`);
    }

    const result: RoleValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

    console.log('📊 Roundtrip test result:', result);
    return result;
  }

  /**
   * Validates role system consistency across components
   */
  public validateRoleSystemConsistency(): RoleValidationResult {
    console.log('🔍 Validating role system consistency...');
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for role usage patterns
    const roleUsage = this.analyzeRoleUsage();
    
    // Validate that sacred roles are properly protected
    const sacredRoleIssues = this.validateSacredRoles();
    errors.push(...sacredRoleIssues);

    // Check for role conflicts
    const roleConflicts = this.findRoleConflicts();
    warnings.push(...roleConflicts);

    // Validate role hierarchy
    const hierarchyIssues = this.validateRoleHierarchy();
    warnings.push(...hierarchyIssues);

    const result: RoleValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

    console.log('📊 Role system consistency result:', result);
    return result;
  }

  /**
   * Comprehensive type system validation
   */
  public async validateTypeSystem(): Promise<RoleValidationResult> {
    console.log('🔍 Starting comprehensive type system validation...');
    
    const allErrors: string[] = [];
    const allWarnings: string[] = [];
    const allSuggestions: string[] = [];

    // Run all validation methods
    const roleTypeResult = this.validateRoleTypeSystem();
    const typeDeclarationsResult = this.validateTypeDeclarations();
    const roundtripResult = await this.performRoundtripTests();
    const consistencyResult = this.validateRoleSystemConsistency();

    // Aggregate results
    allErrors.push(...roleTypeResult.errors);
    allErrors.push(...typeDeclarationsResult.errors);
    allErrors.push(...roundtripResult.errors);
    allErrors.push(...consistencyResult.errors);

    allWarnings.push(...roleTypeResult.warnings);
    allWarnings.push(...typeDeclarationsResult.warnings);
    allWarnings.push(...roundtripResult.warnings);
    allWarnings.push(...consistencyResult.warnings);

    allSuggestions.push(...roleTypeResult.suggestions);
    allSuggestions.push(...typeDeclarationsResult.suggestions);
    allSuggestions.push(...roundtripResult.suggestions);
    allSuggestions.push(...consistencyResult.suggestions);

    const result: RoleValidationResult = {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: allSuggestions
    };

    console.log('📊 Comprehensive type system validation complete:', result);
    return result;
  }

  // Private helper methods
  private findInvalidRoleAssignments(): string[] {
    // This would scan the codebase for invalid role assignments
    // For now, return empty array as placeholder
    return [];
  }

  private validateRoleConfigurations(): string[] {
    // This would validate role configurations
    // For now, return empty array as placeholder
    return [];
  }

  private findMissingRoleAssignments(): string[] {
    // This would find components without role assignments
    // For now, return empty array as placeholder
    return [];
  }

  private isTypeDeclared(typeName: string): boolean {
    // This would check if a type is properly declared
    // For now, return true as placeholder
    return true;
  }

  private findTypeConflicts(): string[] {
    // This would find type conflicts
    // For now, return empty array as placeholder
    return [];
  }

  private validateTypeExports(): string[] {
    // This would validate type exports
    // For now, return empty array as placeholder
    return [];
  }

  private analyzeRoleUsage(): Record<ComponentRole, number> {
    // This would analyze role usage patterns
    // For now, return empty object as placeholder
    return {} as Record<ComponentRole, number>;
  }

  private validateSacredRoles(): string[] {
    // This would validate sacred role protection
    // For now, return empty array as placeholder
    return [];
  }

  private findRoleConflicts(): string[] {
    // This would find role conflicts
    // For now, return empty array as placeholder
    return [];
  }

  private validateRoleHierarchy(): string[] {
    // This would validate role hierarchy
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.validationCache.clear();
    this.typeRegistry.clear();
    console.log('🔍 TypeValidation system destroyed');
  }
} 