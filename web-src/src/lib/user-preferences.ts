/**
 * User Preferences Management System
 * Handles persistent user settings including PIN authentication preferences
 */

export interface UserPreferences {
  pinAuthEnabled: boolean;
  rememberMe: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  quickAccess: boolean;
  lastLoginMethod: 'email' | 'pin' | 'google' | 'apple';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  pinAuthEnabled: false,
  rememberMe: true,
  theme: 'auto',
  notifications: true,
  autoSave: true,
  quickAccess: true,
  lastLoginMethod: 'email'
};

class UserPreferencesManager {
  private storageKey = 'thoughtmarks_user_preferences';
  private userKey = 'thoughtmarks_user_preferences_';

  /**
   * Get user-specific storage key
   */
  private getUserKey(userId?: string): string {
    if (!userId) {
      // Try to get current user ID from localStorage
      const userData = localStorage.getItem('thoughtmarks-user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id?.toString() || user.uid;
        } catch {
          return this.storageKey;
        }
      }
    }
    return userId ? `${this.userKey}${userId}` : this.storageKey;
  }

  /**
   * Get user preferences with fallback to defaults
   */
  getPreferences(userId?: string): UserPreferences {
    try {
      const key = this.getUserKey(userId);
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return { ...DEFAULT_PREFERENCES };
      }

      const preferences = JSON.parse(stored);
      
      // Merge with defaults to ensure all properties exist
      return {
        ...DEFAULT_PREFERENCES,
        ...preferences
      };
    } catch (error) {
      console.warn('Failed to load user preferences, using defaults:', error);
      return { ...DEFAULT_PREFERENCES };
    }
  }

  /**
   * Update user preferences
   */
  updatePreferences(updates: Partial<UserPreferences>, userId?: string): boolean {
    try {
      const key = this.getUserKey(userId);
      const current = this.getPreferences(userId);
      const updated = { ...current, ...updates };
      
      localStorage.setItem(key, JSON.stringify(updated));
      
      // Emit custom event for preference changes
      window.dispatchEvent(new CustomEvent('userPreferencesChanged', {
        detail: { preferences: updated, changes: updates }
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to update user preferences:', error);
      return false;
    }
  }

  /**
   * Toggle PIN authentication preference
   */
  togglePinAuth(enabled: boolean, userId?: string): boolean {
    return this.updatePreferences({ pinAuthEnabled: enabled }, userId);
  }

  /**
   * Check if PIN authentication is enabled
   */
  isPinAuthEnabled(userId?: string): boolean {
    return this.getPreferences(userId).pinAuthEnabled;
  }

  /**
   * Set last used login method
   */
  setLastLoginMethod(method: UserPreferences['lastLoginMethod'], userId?: string): boolean {
    return this.updatePreferences({ lastLoginMethod: method }, userId);
  }

  /**
   * Get last used login method
   */
  getLastLoginMethod(userId?: string): UserPreferences['lastLoginMethod'] {
    return this.getPreferences(userId).lastLoginMethod;
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences(userId?: string): boolean {
    try {
      const key = this.getUserKey(userId);
      localStorage.setItem(key, JSON.stringify(DEFAULT_PREFERENCES));
      
      window.dispatchEvent(new CustomEvent('userPreferencesChanged', {
        detail: { preferences: DEFAULT_PREFERENCES, changes: DEFAULT_PREFERENCES }
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to reset user preferences:', error);
      return false;
    }
  }

  /**
   * Clear all user preferences
   */
  clearPreferences(userId?: string): boolean {
    try {
      const key = this.getUserKey(userId);
      localStorage.removeItem(key);
      
      window.dispatchEvent(new CustomEvent('userPreferencesCleared'));
      
      return true;
    } catch (error) {
      console.error('Failed to clear user preferences:', error);
      return false;
    }
  }

  /**
   * Export preferences for backup
   */
  exportPreferences(userId?: string): string | null {
    try {
      const preferences = this.getPreferences(userId);
      return JSON.stringify(preferences, null, 2);
    } catch (error) {
      console.error('Failed to export preferences:', error);
      return null;
    }
  }

  /**
   * Import preferences from backup
   */
  importPreferences(preferencesJson: string, userId?: string): boolean {
    try {
      const preferences = JSON.parse(preferencesJson);
      
      // Validate structure
      if (typeof preferences !== 'object' || preferences === null) {
        throw new Error('Invalid preferences format');
      }

      // Merge with defaults to ensure all required properties
      const validPreferences = {
        ...DEFAULT_PREFERENCES,
        ...preferences
      };

      const key = this.getUserKey(userId);
      localStorage.setItem(key, JSON.stringify(validPreferences));
      
      window.dispatchEvent(new CustomEvent('userPreferencesChanged', {
        detail: { preferences: validPreferences, changes: validPreferences }
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  }
}

export const userPreferences = new UserPreferencesManager();