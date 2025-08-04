const { device, expect } = require('detox');

describe('Minimal Detox Test', () => {
  beforeAll(async () => {
    console.log('Starting minimal test...');
    await device.launchApp({ newInstance: true });
  });

  it('should launch the app', async () => {
    console.log('App launched successfully');
    expect(true).toBe(true);
  });
}); 