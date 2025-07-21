export interface ZIndexContract {
  id: string;
  zIndex: number;
  layer: 'background' | 'content' | 'overlay' | 'modal' | 'floating' | 'notification';
  environment: 'legacy' | 'nextgen';
  conditions: {
    feature: string;
    version: string;
    screen: string;
  }[];
  validationRules: {
    minZIndex: number;
    maxZIndex: number;
    conflicts: string[];
  };
}

export interface SafeFrameShell {
  id: string;
  width: number;
  height: number;
  position: 'center' | 'bottom' | 'top' | 'full';
  zIndex: number;
  environment: 'legacy' | 'nextgen';
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  constraints: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
  validationRules: {
    aspectRatio?: number;
    safeArea: boolean;
    responsive: boolean;
  };
}

export class ZIndexProtectionManager {
  private zIndexContracts: ZIndexContract[] = [];
  private safeFrameShells: SafeFrameShell[] = [];

  addZIndexContract(contract: ZIndexContract): void {
    // Validate z-index range
    if (contract.zIndex < contract.validationRules.minZIndex || 
        contract.zIndex > contract.validationRules.maxZIndex) {
      throw new Error(`Z-index ${contract.zIndex} out of range for contract ${contract.id}`);
    }

    // Check for conflicts
    const conflicts = this.zIndexContracts.filter(c => 
      c.zIndex === contract.zIndex && 
      c.layer === contract.layer &&
      c.environment === contract.environment
    );

    if (conflicts.length > 0) {
      throw new Error(`Z-index conflict detected for contract ${contract.id}`);
    }

    this.zIndexContracts.push(contract);
  }

  addSafeFrameShell(shell: SafeFrameShell): void {
    // Validate dimensions
    if (shell.width < shell.constraints.minWidth || 
        shell.width > shell.constraints.maxWidth) {
      throw new Error(`Width ${shell.width} out of range for shell ${shell.id}`);
    }

    if (shell.height < shell.constraints.minHeight || 
        shell.height > shell.constraints.maxHeight) {
      throw new Error(`Height ${shell.height} out of range for shell ${shell.id}`);
    }

    this.safeFrameShells.push(shell);
  }

  getZIndexContracts(): ZIndexContract[] {
    return [...this.zIndexContracts];
  }

  getSafeFrameShells(): SafeFrameShell[] {
    return [...this.safeFrameShells];
  }

  validateLayout(layoutId: string, zIndex: number, layer: string): boolean {
    const contract = this.zIndexContracts.find(c => c.id === layoutId);
    if (!contract) return false;

    return contract.zIndex === zIndex && 
           contract.layer === layer &&
           zIndex >= contract.validationRules.minZIndex &&
           zIndex <= contract.validationRules.maxZIndex;
  }

  getSafeFrameForLayout(layoutId: string): SafeFrameShell | undefined {
    return this.safeFrameShells.find(s => s.id === layoutId);
  }
}

export const zIndexProtectionManager = new ZIndexProtectionManager(); 