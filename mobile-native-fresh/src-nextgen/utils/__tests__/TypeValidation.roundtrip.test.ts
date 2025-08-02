import { TypeValidation } from '../TypeValidation';
import { ComponentRole, RoleConfig, RoleAssignment, RoleValidationResult } from '../../shell/wrappers/types';

describe('TypeValidation Roundtrip Tests', () => {
  let typeValidation: TypeValidation;

  beforeEach(() => {
    typeValidation = TypeValidation.getInstance();
  });

  afterEach(() => {
    typeValidation.destroy();
  });

  describe('Role Assignment Roundtrip Tests', () => {
    test('should maintain role assignment integrity through serialization', async () => {
      const originalAssignment: RoleAssignment = {
        componentId: 'test-component-123',
        role: 'content',
        timestamp: new Date().toISOString(),
        environment: 'nextgen',
        validated: true
      };

      // Serialize and deserialize
      const serialized = JSON.stringify(originalAssignment);
      const deserialized = JSON.parse(serialized) as RoleAssignment;

      // Validate all properties
      expect(deserialized.componentId).toBe(originalAssignment.componentId);
      expect(deserialized.role).toBe(originalAssignment.role);
      expect(deserialized.timestamp).toBe(originalAssignment.timestamp);
      expect(deserialized.environment).toBe(originalAssignment.environment);
      expect(deserialized.validated).toBe(originalAssignment.validated);
    });

    test('should handle all role types correctly', async () => {
      const validRoles: ComponentRole[] = ['layout', 'content', 'interactive', 'navigation', 'feedback', 'sacred'];

      for (const role of validRoles) {
        const assignment: RoleAssignment = {
          componentId: `test-${role}`,
          role,
          timestamp: new Date().toISOString(),
          environment: 'nextgen',
          validated: true
        };

        const serialized = JSON.stringify(assignment);
        const deserialized = JSON.parse(serialized) as RoleAssignment;

        expect(deserialized.role).toBe(role);
        expect(deserialized.componentId).toBe(`test-${role}`);
      }
    });

    test('should handle both legacy and nextgen environments', async () => {
      const environments: ('legacy' | 'nextgen')[] = ['legacy', 'nextgen'];

      for (const environment of environments) {
        const assignment: RoleAssignment = {
          componentId: `test-${environment}`,
          role: 'content',
          timestamp: new Date().toISOString(),
          environment,
          validated: true
        };

        const serialized = JSON.stringify(assignment);
        const deserialized = JSON.parse(serialized) as RoleAssignment;

        expect(deserialized.environment).toBe(environment);
      }
    });
  });

  describe('Role Configuration Roundtrip Tests', () => {
    test('should maintain role configuration integrity through serialization', async () => {
      const originalConfig: RoleConfig = {
        role: 'interactive',
        priority: 1,
        protected: true,
        validation: true,
        debug: false
      };

      // Serialize and deserialize
      const serialized = JSON.stringify(originalConfig);
      const deserialized = JSON.parse(serialized) as RoleConfig;

      // Validate all properties
      expect(deserialized.role).toBe(originalConfig.role);
      expect(deserialized.priority).toBe(originalConfig.priority);
      expect(deserialized.protected).toBe(originalConfig.protected);
      expect(deserialized.validation).toBe(originalConfig.validation);
      expect(deserialized.debug).toBe(originalConfig.debug);
    });

    test('should handle optional properties correctly', async () => {
      const minimalConfig: RoleConfig = {
        role: 'content',
        priority: 0
      };

      const fullConfig: RoleConfig = {
        role: 'sacred',
        priority: 10,
        protected: true,
        validation: true,
        debug: true
      };

      // Test minimal config
      const minimalSerialized = JSON.stringify(minimalConfig);
      const minimalDeserialized = JSON.parse(minimalSerialized) as RoleConfig;
      expect(minimalDeserialized.role).toBe('content');
      expect(minimalDeserialized.priority).toBe(0);
      expect(minimalDeserialized.protected).toBeUndefined();

      // Test full config
      const fullSerialized = JSON.stringify(fullConfig);
      const fullDeserialized = JSON.parse(fullSerialized) as RoleConfig;
      expect(fullDeserialized.role).toBe('sacred');
      expect(fullDeserialized.priority).toBe(10);
      expect(fullDeserialized.protected).toBe(true);
      expect(fullDeserialized.validation).toBe(true);
      expect(fullDeserialized.debug).toBe(true);
    });
  });

  describe('Validation Result Roundtrip Tests', () => {
    test('should maintain validation result integrity through serialization', async () => {
      const originalResult: RoleValidationResult = {
        valid: true,
        errors: ['Error 1', 'Error 2'],
        warnings: ['Warning 1'],
        suggestions: ['Suggestion 1', 'Suggestion 2']
      };

      // Serialize and deserialize
      const serialized = JSON.stringify(originalResult);
      const deserialized = JSON.parse(serialized) as RoleValidationResult;

      // Validate all properties
      expect(deserialized.valid).toBe(originalResult.valid);
      expect(deserialized.errors).toEqual(originalResult.errors);
      expect(deserialized.warnings).toEqual(originalResult.warnings);
      expect(deserialized.suggestions).toEqual(originalResult.suggestions);
    });

    test('should handle empty arrays correctly', async () => {
      const emptyResult: RoleValidationResult = {
        valid: false,
        errors: [],
        warnings: [],
        suggestions: []
      };

      const serialized = JSON.stringify(emptyResult);
      const deserialized = JSON.parse(serialized) as RoleValidationResult;

      expect(deserialized.valid).toBe(false);
      expect(deserialized.errors).toEqual([]);
      expect(deserialized.warnings).toEqual([]);
      expect(deserialized.suggestions).toEqual([]);
    });

    test('should handle complex validation results', async () => {
      const complexResult: RoleValidationResult = {
        valid: true,
        errors: [],
        warnings: ['Complex warning with special chars: !@#$%^&*()'],
        suggestions: [
          'Suggestion with numbers: 123',
          'Suggestion with unicode: 🎨🎭🎪',
          'Suggestion with newlines:\nLine 1\nLine 2'
        ]
      };

      const serialized = JSON.stringify(complexResult);
      const deserialized = JSON.parse(serialized) as RoleValidationResult;

      expect(deserialized.valid).toBe(true);
      expect(deserialized.errors).toEqual([]);
      expect(deserialized.warnings).toEqual(complexResult.warnings);
      expect(deserialized.suggestions).toEqual(complexResult.suggestions);
    });
  });

  describe('TypeValidation Method Roundtrip Tests', () => {
    test('should perform role type system validation roundtrip', async () => {
      const result = typeValidation.validateRoleTypeSystem();
      
      // Validate result structure
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
      
      // Validate types
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    test('should perform type declarations validation roundtrip', async () => {
      const result = typeValidation.validateTypeDeclarations();
      
      // Validate result structure
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
      
      // Validate types
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    test('should perform role system consistency validation roundtrip', async () => {
      const result = typeValidation.validateRoleSystemConsistency();
      
      // Validate result structure
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
      
      // Validate types
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    test('should perform comprehensive type system validation roundtrip', async () => {
      const result = await typeValidation.validateTypeSystem();
      
      // Validate result structure
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('suggestions');
      
      // Validate types
      expect(typeof result.valid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('Error Handling Roundtrip Tests', () => {
    test('should handle malformed JSON gracefully', async () => {
      const malformedJSON = '{"valid": true, "errors": [}'; // Missing closing bracket
      
      expect(() => {
        JSON.parse(malformedJSON);
      }).toThrow();
    });

    test('should handle missing properties gracefully', async () => {
      const incompleteResult = {
        valid: true
        // Missing errors, warnings, suggestions
      };

      const serialized = JSON.stringify(incompleteResult);
      const deserialized = JSON.parse(serialized);

      // Should not throw, but should handle missing properties
      expect(deserialized.valid).toBe(true);
      expect(deserialized.errors).toBeUndefined();
    });

    test('should handle null values correctly', async () => {
      const resultWithNulls = {
        valid: true,
        errors: null,
        warnings: null,
        suggestions: null
      };

      const serialized = JSON.stringify(resultWithNulls);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.valid).toBe(true);
      expect(deserialized.errors).toBeNull();
      expect(deserialized.warnings).toBeNull();
      expect(deserialized.suggestions).toBeNull();
    });
  });

  describe('Performance Roundtrip Tests', () => {
    test('should handle large validation results efficiently', async () => {
      const largeResult: RoleValidationResult = {
        valid: true,
        errors: Array.from({ length: 1000 }, (_, i) => `Error ${i}`),
        warnings: Array.from({ length: 500 }, (_, i) => `Warning ${i}`),
        suggestions: Array.from({ length: 200 }, (_, i) => `Suggestion ${i}`)
      };

      const startTime = Date.now();
      const serialized = JSON.stringify(largeResult);
      const deserialized = JSON.parse(serialized) as RoleValidationResult;
      const endTime = Date.now();

      // Should complete within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);

      // Validate all data is preserved
      expect(deserialized.valid).toBe(true);
      expect(deserialized.errors).toHaveLength(1000);
      expect(deserialized.warnings).toHaveLength(500);
      expect(deserialized.suggestions).toHaveLength(200);
    });
  });
}); 