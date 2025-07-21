import { zIndexProtectionManager, ZIndexContract, SafeFrameShell } from '../ZIndexProtection';

describe('Layout Contracts and Z-Index Protection', () => {
  beforeEach(() => {
    // Clear manager state before each test
    (zIndexProtectionManager as any).zIndexContracts = [];
    (zIndexProtectionManager as any).safeFrameShells = [];
  });

  describe('ZIndexProtectionManager', () => {
    it('should add valid z-index contracts', () => {
      const contract: ZIndexContract = {
        id: 'test-contract',
        zIndex: 100,
        layer: 'content',
        environment: 'nextgen',
        conditions: [{ feature: 'test', version: '1.0', screen: 'main' }],
        validationRules: {
          minZIndex: 0,
          maxZIndex: 1000,
          conflicts: []
        }
      };

      expect(() => zIndexProtectionManager.addZIndexContract(contract)).not.toThrow();
      expect(zIndexProtectionManager.getZIndexContracts()).toHaveLength(1);
    });

    it('should reject invalid z-index contracts', () => {
      const contract: ZIndexContract = {
        id: 'test-contract',
        zIndex: 1500, // Out of range
        layer: 'content',
        environment: 'nextgen',
        conditions: [{ feature: 'test', version: '1.0', screen: 'main' }],
        validationRules: {
          minZIndex: 0,
          maxZIndex: 1000,
          conflicts: []
        }
      };

      expect(() => zIndexProtectionManager.addZIndexContract(contract)).toThrow();
    });

    it('should add valid safe frame shells', () => {
      const shell: SafeFrameShell = {
        id: 'test-shell',
        width: 300,
        height: 200,
        position: 'center',
        zIndex: 100,
        environment: 'nextgen',
        padding: { top: 10, bottom: 10, left: 10, right: 10 },
        constraints: {
          minWidth: 100,
          maxWidth: 500,
          minHeight: 100,
          maxHeight: 500
        },
        validationRules: {
          safeArea: true,
          responsive: true
        }
      };

      expect(() => zIndexProtectionManager.addSafeFrameShell(shell)).not.toThrow();
      expect(zIndexProtectionManager.getSafeFrameShells()).toHaveLength(1);
    });

    it('should validate layout correctly', () => {
      const contract: ZIndexContract = {
        id: 'test-layout',
        zIndex: 100,
        layer: 'content',
        environment: 'nextgen',
        conditions: [{ feature: 'test', version: '1.0', screen: 'main' }],
        validationRules: {
          minZIndex: 0,
          maxZIndex: 1000,
          conflicts: []
        }
      };

      zIndexProtectionManager.addZIndexContract(contract);
      
      expect(zIndexProtectionManager.validateLayout('test-layout', 100, 'content')).toBe(true);
      expect(zIndexProtectionManager.validateLayout('test-layout', 200, 'content')).toBe(false);
    });
  });
}); 