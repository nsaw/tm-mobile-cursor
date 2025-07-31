// @ts-nocheck
import { NavigationSystem } from './NavigationSystem';

describe('NavigationSystem', () => {
  let navigationSystem: NavigationSystem;

  beforeEach(() => {
    // Reset the singleton instance before each test
    (NavigationSystem as any).instance = undefined;
    navigationSystem = NavigationSystem.getInstance();
  });

  afterEach(() => {
    navigationSystem.destroy();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = NavigationSystem.getInstance();
      const instance2 = NavigationSystem.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = navigationSystem.getNavigationState();
      expect(state.currentRoute).toBe('Home');
      expect(state.params).toEqual({});
      expect(state.history).toEqual(['Home']);
      expect(state.isNavigating).toBe(false);
      expect(state.lastNavigationTime).toBeGreaterThan(0);
    });

    it('should have empty history initially', () => {
      expect(navigationSystem.getHistoryLength()).toBe(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to valid route', async () => {
      const result = await navigationSystem.navigate('Dashboard');
      
      expect(result.success).toBe(true);
      expect(result.route).toBe('Dashboard');
      expect(result.duration).toBeGreaterThan(0);
      
      const state = navigationSystem.getNavigationState();
      expect(state.currentRoute).toBe('Dashboard');
      expect(state.history).toContain('Dashboard');
    });

    it('should navigate with parameters', async () => {
      const params = { userId: '123', tab: 'profile' };
      const result = await navigationSystem.navigate('Profile', params);
      
      expect(result.success).toBe(true);
      expect(result.params).toEqual(params);
      
      const currentParams = navigationSystem.getCurrentParams();
      expect(currentParams).toEqual(params);
    });

    it('should reject invalid routes', async () => {
      const result = await navigationSystem.navigate('InvalidRoute');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid route');
      
      const state = navigationSystem.getNavigationState();
      expect(state.currentRoute).toBe('Home'); // Should remain unchanged
    });

    it('should track navigation history', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const history = navigationSystem.getNavigationHistory();
      expect(history).toEqual(['Home', 'Dashboard', 'Profile']);
    });
  });

  describe('Navigation History', () => {
    it('should add entries to history', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const history = navigationSystem.getHistory();
      expect(history.length).toBe(2);
      
      expect(history[0].route).toBe('Dashboard');
      expect(history[1].route).toBe('Profile');
      expect(history[0].timestamp).toBeGreaterThan(0);
      expect(history[1].timestamp).toBeGreaterThan(0);
    });

    it('should get specific history entry', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const entry = navigationSystem.getHistoryEntry(0);
      expect(entry).toBeDefined();
      expect(entry?.route).toBe('Dashboard');
    });

    it('should return null for invalid history index', () => {
      const entry = navigationSystem.getHistoryEntry(999);
      expect(entry).toBeNull();
    });

    it('should clear history', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      expect(navigationSystem.getHistoryLength()).toBe(2);
      
      navigationSystem.clearHistory();
      expect(navigationSystem.getHistoryLength()).toBe(0);
    });
  });

  describe('Navigation State', () => {
    it('should track navigation state during navigation', async () => {
      const navigatePromise = navigationSystem.navigate('Dashboard');
      
      // Check that navigation is in progress
      expect(navigationSystem.isNavigating()).toBe(true);
      
      await navigatePromise;
      
      // Check that navigation is complete
      expect(navigationSystem.isNavigating()).toBe(false);
    });

    it('should get current route', async () => {
      expect(navigationSystem.getCurrentRoute()).toBe('Home');
      
      await navigationSystem.navigate('Dashboard');
      expect(navigationSystem.getCurrentRoute()).toBe('Dashboard');
    });

    it('should get current parameters', async () => {
      const params = { userId: '123' };
      await navigationSystem.navigate('Profile', params);
      
      expect(navigationSystem.getCurrentParams()).toEqual(params);
    });
  });

  describe('Navigation Methods', () => {
    it('should go back', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const result = await navigationSystem.goBack();
      
      expect(result.success).toBe(true);
      expect(navigationSystem.getCurrentRoute()).toBe('Dashboard');
    });

    it('should push route', async () => {
      const result = await navigationSystem.push('Dashboard');
      expect(result.success).toBe(true);
      expect(navigationSystem.getCurrentRoute()).toBe('Dashboard');
    });

    it('should pop route', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const result = await navigationSystem.pop();
      expect(result.success).toBe(true);
      expect(navigationSystem.getCurrentRoute()).toBe('Dashboard');
    });

    it('should replace route', async () => {
      await navigationSystem.navigate('Dashboard');
      
      const result = await navigationSystem.replace('Profile');
      expect(result.success).toBe(true);
      expect(navigationSystem.getCurrentRoute()).toBe('Profile');
      
      // History should not include Dashboard since it was replaced
      const history = navigationSystem.getNavigationHistory();
      expect(history).toEqual(['Home', 'Profile']);
    });

    it('should reset navigation', async () => {
      await navigationSystem.navigate('Dashboard');
      await navigationSystem.navigate('Profile');
      
      const result = await navigationSystem.reset('Settings');
      expect(result.success).toBe(true);
      expect(navigationSystem.getCurrentRoute()).toBe('Settings');
      
      // History should be reset
      const history = navigationSystem.getNavigationHistory();
      expect(history).toEqual(['Settings']);
    });
  });

  describe('Event Listeners', () => {
    it('should add and remove listeners', () => {
      const listener = jest.fn();
      const removeListener = navigationSystem.addListener(listener);
      
      // Trigger navigation to test listener
      navigationSystem.navigate('Dashboard');
      
      expect(listener).toHaveBeenCalled();
      
      // Remove listener
      removeListener();
      listener.mockClear();
      
      // Trigger another navigation
      navigationSystem.navigate('Profile');
      
      expect(listener).not.toHaveBeenCalled();
    });

    it('should notify all listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      navigationSystem.addListener(listener1);
      navigationSystem.addListener(listener2);
      
      navigationSystem.navigate('Dashboard');
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('Navigation Queue', () => {
    it('should process navigation queue sequentially', async () => {
      const results: string[] = [];
      
      // Start multiple navigations simultaneously
      const promises = [
        navigationSystem.navigate('Dashboard').then(() => results.push('Dashboard')),
        navigationSystem.navigate('Profile').then(() => results.push('Profile')),
        navigationSystem.navigate('Settings').then(() => results.push('Settings')),
      ];
      
      await Promise.all(promises);
      
      // Should be processed in order
      expect(results).toEqual(['Dashboard', 'Profile', 'Settings']);
    });

    it('should handle navigation errors gracefully', async () => {
      const validResult = await navigationSystem.navigate('Dashboard');
      const invalidResult = await navigationSystem.navigate('InvalidRoute');
      
      expect(validResult.success).toBe(true);
      expect(invalidResult.success).toBe(false);
      
      // System should still be functional after error
      const state = navigationSystem.getNavigationState();
      expect(state.currentRoute).toBe('Dashboard');
    });
  });

  describe('Cleanup', () => {
    it('should destroy instance and clear state', () => {
      const listener = jest.fn();
      navigationSystem.addListener(listener);
      
      navigationSystem.destroy();
      
      // Should clear listeners
      navigationSystem.navigate('Dashboard');
      expect(listener).not.toHaveBeenCalled();
    });
  });
}); 