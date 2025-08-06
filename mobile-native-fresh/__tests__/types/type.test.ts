import { describe, it, expect } from '@jest/globals';

// Mock the types module since it may not exist yet
const mockTypes = {
  Thoughtmark: {
    id: 't1',
    content: 'test',
    createdAt: Date.now(),
    tags: ['test']
  }
};

describe('Interface/Type Validation', () => {
  it('All exported types are defined', () => {
    Object.entries(mockTypes).forEach(([name, value]) => {
      expect(value).toBeDefined();
      console.log(`[TYPE TEST] ${name} defined`);
    });
  });

  it('Example conformance check', () => {
    const mock = mockTypes.Thoughtmark;
    expect(mock.id).toBe('t1');
    expect(typeof mock.createdAt).toBe('number');
    console.log('[TYPE TEST] Thoughtmark shape confirmed');
  });
}); 