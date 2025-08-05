import { typeValidator } from './TypeValidation';
import { User, Thoughtmark } from './DataTypes';
import { ApiResponse } from './ApiTypes';

describe('TypeValidator', () => {
  beforeEach(() => {
    // Clear validation cache before each test
    typeValidator.clearCache();
  });

  describe('validateType', () => {
    it('should validate User type correctly', () => {
      const validUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const result = typeValidator.validateType('User', validUser);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid User type', () => {
      const invalidUser = {
        id: 'user-123',
        email: 'test@example.com',
        // Missing required fields
      };

      const result = typeValidator.validateType('User', invalidUser);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate Thoughtmark type correctly', () => {
      const validThoughtmark: Thoughtmark = {
        id: 'thought-123',
        title: 'Test Thoughtmark',
        content: 'Test content',
        tags: ['test'],
        binId: 'bin-123',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        isArchived: false,
        isPinned: false,
      };

      const result = typeValidator.validateType('Thoughtmark', validThoughtmark);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate ApiResponse type correctly', () => {
      const validResponse: ApiResponse<User> = {
        data: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          isPremium: false,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        status: 200,
        message: 'Success',
        success: true,
        timestamp: '2023-01-01T00:00:00.000Z',
      };

      const result = typeValidator.validateType('ApiResponse', validResponse);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateMultipleTypes', () => {
    it('should validate multiple types correctly', () => {
      const data = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          isPremium: false,
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        thoughtmark: {
          id: 'thought-123',
          title: 'Test Thoughtmark',
          content: 'Test content',
          tags: ['test'],
          binId: 'bin-123',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          isArchived: false,
          isPinned: false,
        },
      };

      const results = typeValidator.validateMultipleTypes({
        user: { type: 'User', data: data.user },
        thoughtmark: { type: 'Thoughtmark', data: data.thoughtmark },
      });

      expect(results.user.isValid).toBe(true);
      expect(results.thoughtmark.isValid).toBe(true);
    });
  });

  describe('cache functionality', () => {
    it('should cache validation results', () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      // First validation
      const result1 = typeValidator.validateType('User', user);
      
      // Second validation should use cache
      const result2 = typeValidator.validateType('User', user);
      
      expect(result1).toEqual(result2);
    });

    it('should clear cache correctly', () => {
      const user: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isPremium: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      typeValidator.validateType('User', user);
      typeValidator.clearCache();
      
      // Cache should be cleared, validation should run again
      const result = typeValidator.validateType('User', user);
      expect(result.isValid).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle unknown types gracefully', () => {
      const result = typeValidator.validateType('UnknownType', {});
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unknown type: UnknownType');
    });

    it('should handle null and undefined values', () => {
      const result1 = typeValidator.validateType('User', null);
      const result2 = typeValidator.validateType('User', undefined);
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });
}); 