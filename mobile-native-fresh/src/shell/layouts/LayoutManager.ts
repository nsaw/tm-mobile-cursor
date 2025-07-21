// Layout Manager Implementation
// Manages layout contracts, z-index protection, and safe-frame shells

import { UILayoutRole } from '../../types/roles';

import { 
  ZIndexContract, 
  SafeFrameShell, 
  LayoutProtection, 
  LayoutValidationResult, 
  LayoutViolation,
  LayoutManager,
  defaultZIndexContracts,
  defaultSafeFrameShells,
  getLayerForZIndex,
  validateZIndex
} from './LayoutContract';

export class LayoutManagerImpl implements LayoutManager {
  public contracts: ZIndexContract[] = [];
  public safeFrames: SafeFrameShell[] = [];
  public protections: LayoutProtection[] = [];

  constructor() {
    // Initialize with default contracts
    this.contracts = [...defaultZIndexContracts];
    this.safeFrames = [...defaultSafeFrameShells];
  }

  // ============================================================================
  // LAYOUT VALIDATION - Core validation logic
  // ============================================================================

  validateLayout(layoutId: string, role: UILayoutRole, zIndex: number): LayoutValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const violations: LayoutViolation[] = [];

    // Get the contract for this layout
    const contract = this.getZIndexContract(layoutId);
    const protection = this.getLayoutProtection(layoutId);

    // Validate z-index
    if (contract) {
      const { validationRules } = contract;
      
      if (zIndex < validationRules.minZIndex || zIndex > validationRules.maxZIndex) {
        const violation: LayoutViolation = {
          type: 'z-index',
          severity: 'error',
          message: `Z-index ${zIndex} is outside allowed range [${validationRules.minZIndex}, ${validationRules.maxZIndex}]`,
          layoutId,
          expected: { min: validationRules.minZIndex, max: validationRules.maxZIndex },
          actual: zIndex
        };
        violations.push(violation);
        errors.push(violation.message);
      }

      // Validate layer consistency
      const expectedLayer = getLayerForZIndex(zIndex);
      if (contract.layer !== expectedLayer) {
        const violation: LayoutViolation = {
          type: 'layer',
          severity: 'warning',
          message: `Layer mismatch: expected ${expectedLayer}, got ${contract.layer}`,
          layoutId,
          expected: expectedLayer,
          actual: contract.layer
        };
        violations.push(violation);
        warnings.push(violation.message);
      }
    } else {
      // No contract found, use default validation
      const expectedLayer = getLayerForZIndex(zIndex);
      if (!validateZIndex(zIndex, expectedLayer)) {
        const violation: LayoutViolation = {
          type: 'z-index',
          severity: 'warning',
          message: `Z-index ${zIndex} may conflict with layer ${expectedLayer}`,
          layoutId,
          expected: expectedLayer,
          actual: zIndex
        };
        violations.push(violation);
        warnings.push(violation.message);
      }
    }

    // Validate protection level
    if (protection) {
      if (protection.protectionLevel === 'critical' && violations.length > 0) {
        errors.push(`Critical layout ${layoutId} has validation violations`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      violations
    };
  }

  // ============================================================================
  // CONTRACT MANAGEMENT - Registration and retrieval
  // ============================================================================

  getZIndexContract(layoutId: string): ZIndexContract | null {
    return this.contracts.find(contract => contract.layoutId === layoutId) || null;
  }

  getSafeFrameShell(layoutId: string): SafeFrameShell | null {
    return this.safeFrames.find(shell => shell.layoutId === layoutId) || null;
  }

  getLayoutProtection(layoutId: string): LayoutProtection | null {
    return this.protections.find(protection => protection.layoutId === layoutId) || null;
  }

  registerLayout(layoutId: string, contract: ZIndexContract): boolean {
    // Check for conflicts
    const existingContract = this.getZIndexContract(layoutId);
    if (existingContract) {
      console.warn(`Layout ${layoutId} already registered, updating contract`);
      const index = this.contracts.findIndex(c => c.layoutId === layoutId);
      if (index !== -1) {
        this.contracts[index] = contract;
        return true;
      }
    }

    // Register new contract
    this.contracts.push(contract);
    console.log(`Registered layout contract: ${layoutId}`);
    return true;
  }

  unregisterLayout(layoutId: string): boolean {
    const contractIndex = this.contracts.findIndex(c => c.layoutId === layoutId);
    const shellIndex = this.safeFrames.findIndex(s => s.layoutId === layoutId);
    const protectionIndex = this.protections.findIndex(p => p.layoutId === layoutId);

    let unregistered = false;

    if (contractIndex !== -1) {
      this.contracts.splice(contractIndex, 1);
      unregistered = true;
    }

    if (shellIndex !== -1) {
      this.safeFrames.splice(shellIndex, 1);
      unregistered = true;
    }

    if (protectionIndex !== -1) {
      this.protections.splice(protectionIndex, 1);
      unregistered = true;
    }

    if (unregistered) {
      console.log(`Unregistered layout: ${layoutId}`);
    }

    return unregistered;
  }

  // ============================================================================
  // SAFE-FRAME MANAGEMENT - Shell operations
  // ============================================================================

  registerSafeFrame(shell: SafeFrameShell): boolean {
    const existingShell = this.getSafeFrameShell(shell.layoutId);
    if (existingShell) {
      console.warn(`Safe frame ${shell.layoutId} already registered, updating`);
      const index = this.safeFrames.findIndex(s => s.layoutId === shell.layoutId);
      if (index !== -1) {
        this.safeFrames[index] = shell;
        return true;
      }
    }

    this.safeFrames.push(shell);
    console.log(`Registered safe frame: ${shell.layoutId}`);
    return true;
  }

  // ============================================================================
  // PROTECTION MANAGEMENT - Sacred layout protection
  // ============================================================================

  registerProtection(protection: LayoutProtection): boolean {
    const existingProtection = this.getLayoutProtection(protection.layoutId);
    if (existingProtection) {
      console.warn(`Protection ${protection.layoutId} already registered, updating`);
      const index = this.protections.findIndex(p => p.layoutId === protection.layoutId);
      if (index !== -1) {
        this.protections[index] = protection;
        return true;
      }
    }

    this.protections.push(protection);
    console.log(`Registered layout protection: ${protection.layoutId} (${protection.protectionLevel})`);
    return true;
  }

  // ============================================================================
  // UTILITY METHODS - Helper functions
  // ============================================================================

  getContractsForEnvironment(environment: 'legacy' | 'nextgen'): ZIndexContract[] {
    return this.contracts.filter(contract => contract.environment === environment);
  }

  getSafeFramesForEnvironment(environment: 'legacy' | 'nextgen'): SafeFrameShell[] {
    return this.safeFrames.filter(shell => shell.environment === environment);
  }

  getProtectionsForLevel(level: 'critical' | 'high' | 'medium' | 'low'): LayoutProtection[] {
    return this.protections.filter(protection => protection.protectionLevel === level);
  }

  validateAllLayouts(): LayoutValidationResult[] {
    const results: LayoutValidationResult[] = [];
    
    this.contracts.forEach(contract => {
      const result = this.validateLayout(contract.layoutId, 'container' as UILayoutRole, contract.zIndex);
      results.push(result);
    });

    return results;
  }

  getLayoutSummary(): {
    totalContracts: number;
    totalSafeFrames: number;
    totalProtections: number;
    criticalProtections: number;
    validationErrors: number;
  } {
    const allValidations = this.validateAllLayouts();
    const totalErrors = allValidations.reduce((sum, result) => sum + result.errors.length, 0);
    const criticalProtections = this.getProtectionsForLevel('critical').length;

    return {
      totalContracts: this.contracts.length,
      totalSafeFrames: this.safeFrames.length,
      totalProtections: this.protections.length,
      criticalProtections,
      validationErrors: totalErrors
    };
  }
}

// Export singleton instance
export const layoutManager = new LayoutManagerImpl(); 