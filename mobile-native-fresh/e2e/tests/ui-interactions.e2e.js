const detox = require('detox');
const { by, element, device, expect } = require('detox');

describe('UI Interactions', () => {
  beforeAll(async () => {
    await detox.installWorker();
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  it('should navigate through bottom tabs', async () => {
    // Test bottom tab navigation
    await element(by.id('tab-home')).tap();
    await expect(element(by.text('Home Screen'))).toBeVisible();
    
    await element(by.id('tab-profile')).tap();
    await expect(element(by.text('Profile Screen'))).toBeVisible();
    
    await element(by.id('tab-settings')).tap();
    await expect(element(by.text('Settings Screen'))).toBeVisible();
  });

  it('should interact with buttons and FAB', async () => {
    // Test button interactions
    await element(by.id('primary-button')).tap();
    await expect(element(by.text('Button Pressed'))).toBeVisible();
    
    // Test FAB interaction
    await element(by.id('fab-button')).tap();
    await expect(element(by.text('FAB Action'))).toBeVisible();
  });

  it('should handle form interactions', async () => {
    // Test text input
    await element(by.id('email-input')).typeText('test@example.com');
    await expect(element(by.id('email-input'))).toHaveText('test@example.com');
    
    // Test form submission
    await element(by.id('submit-button')).tap();
    await expect(element(by.text('Form Submitted'))).toBeVisible();
  });

  it('should test dropdown menu functionality', async () => {
    // Test dropdown opening
    await element(by.id('dropdown-trigger')).tap();
    await expect(element(by.text('Dropdown Menu'))).toBeVisible();
    
    // Test dropdown item selection
    await element(by.text('Option 1')).tap();
    await expect(element(by.text('Selected: Option 1'))).toBeVisible();
  });

  it('should capture screenshots for visual regression', async () => {
    // Navigate to main screen
    await element(by.id('tab-home')).tap();
    await device.takeScreenshot('home-screen');
    
    // Navigate to profile
    await element(by.id('tab-profile')).tap();
    await device.takeScreenshot('profile-screen');
    
    // Navigate to settings
    await element(by.id('tab-settings')).tap();
    await device.takeScreenshot('settings-screen');
  });
}); 