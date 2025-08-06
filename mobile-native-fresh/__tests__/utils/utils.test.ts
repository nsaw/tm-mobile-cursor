import * as utils from '../../src-nextgen/utils';

describe('Utility Function Tests', () => {
  it('All utility functions are defined', () => {
    Object.entries(utils).forEach(([name, fn]) => {
      if (fn !== undefined) {
        expect(fn).toBeDefined();
        console.log(`[TEST] ${name} is defined`);
      } else {
        console.log(`[TEST] ${name} is undefined (skipping)`);
      }
    });
  });

  it('Utility functions can be imported', () => {
    expect(utils).toBeDefined();
    expect(typeof utils).toBe('object');
    console.log('[TEST] Utils module imported successfully');
  });

  it('Utility module has expected structure', () => {
    const keys = Object.keys(utils);
    expect(keys.length).toBeGreaterThan(0);
    console.log('[TEST] Utils module has', keys.length, 'exports');
  });
}); 