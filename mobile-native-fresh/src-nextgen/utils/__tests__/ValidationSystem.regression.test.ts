import { ValidationSystem } from '../ValidationSystem';

describe('ValidationSystem Regression Tests', () => {
  let validationSystem: ValidationSystem;

  beforeEach(() => {
    validationSystem = new ValidationSystem();
  });

  test('setTimeout Promise typing should not cause TypeScript errors', async () => {
    const result = await validationSystem.validateWithTimeout(() => Promise.resolve(true), 100);
    expect(result).toBe(true);
  });

  test('private method access should be properly encapsulated', () => {
    expect(() => validationSystem['validateQueue']).toThrow();
  });

  test('validation queue should handle async operations correctly', async () => {
    const promises = [
      validationSystem.validateWithTimeout(() => Promise.resolve('test1'), 50),
      validationSystem.validateWithTimeout(() => Promise.resolve('test2'), 50),
      validationSystem.validateWithTimeout(() => Promise.resolve('test3'), 50),
    ];
    
    const results = await Promise.all(promises);
    expect(results).toEqual(['test1', 'test2', 'test3']);
  });
}); 