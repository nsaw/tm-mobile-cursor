import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrganizationPreferences, DashboardLayout, ThemePreferences, NotificationSettings, PrivacySettings, AccessibilitySettings } from '../types/organization-preferences';

const PREFERENCES_STORAGE_KEY = '@thoughtmarks_organization_preferences';

class OrganizationPreferencesService {
  private defaultPreferences: OrganizationPreferences = {
    id: 'default',
    userId: 'guest',
    dashboardLayout: {
      showRecentThoughtmarks: true,
      showTasks: true,
      showBins: true,
      showTags: true,
      showStats: false,
      sectionOrder: ['recent-thoughtmarks', 'tasks', 'bins', 'tags'],
      compactMode: false,
    },
    themePreferences: {
      theme: 'system',
      accentColor: '#007AFF',
      fontSize: 'medium',
      showAnimations: true,
      highContrast: false,
    },
    notificationSettings: {
      pushNotifications: true,
      emailNotifications: true,
      taskReminders: true,
      aiInsights: true,
      marketingEmails: false,
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
    },
    privacySettings: {
      dataSharing: false,
      analyticsEnabled: true,
      crashReporting: true,
      locationServices: false,
    },
    accessibilitySettings: {
      screenReader: false,
      largeText: false,
      reduceMotion: false,
      highContrast: false,
      voiceControl: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  async getPreferences(userId?: string): Promise<OrganizationPreferences> {
    try {
      const key = userId ? `${PREFERENCES_STORAGE_KEY}_${userId}` : PREFERENCES_STORAGE_KEY;
      const stored = await AsyncStorage.getItem(key);
      
      if (stored) {
        const preferences = JSON.parse(stored);
        return { ...this.defaultPreferences, ...preferences };
      }
      
      return this.defaultPreferences;
    } catch (error) {
      console.error('Error loading organization preferences:', error);
      return this.defaultPreferences;
    }
  }

  async updatePreferences(updates: Partial<OrganizationPreferences>, userId?: string): Promise<OrganizationPreferences> {
    try {
      const currentPreferences = await this.getPreferences(userId);
      const updatedPreferences: OrganizationPreferences = {
        ...currentPreferences,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const key = userId ? `${PREFERENCES_STORAGE_KEY}_${userId}` : PREFERENCES_STORAGE_KEY;
      await AsyncStorage.setItem(key, JSON.stringify(updatedPreferences));

      return updatedPreferences;
    } catch (error) {
      console.error('Error updating organization preferences:', error);
      throw new Error('Failed to update preferences');
    }
  }

  async updateDashboardLayout(layout: Partial<DashboardLayout>, userId?: string): Promise<OrganizationPreferences> {
    const currentPreferences = await this.getPreferences(userId);
    return this.updatePreferences({
      dashboardLayout: { ...currentPreferences.dashboardLayout, ...layout }
    }, userId);
  }

  async updateThemePreferences(theme: Partial<ThemePreferences>, userId?: string): Promise<OrganizationPreferences> {
    const currentPreferences = await this.getPreferences(userId);
    return this.updatePreferences({
      themePreferences: { ...currentPreferences.themePreferences, ...theme }
    }, userId);
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>, userId?: string): Promise<OrganizationPreferences> {
    const currentPreferences = await this.getPreferences(userId);
    return this.updatePreferences({
      notificationSettings: { ...currentPreferences.notificationSettings, ...settings }
    }, userId);
  }

  async updatePrivacySettings(settings: Partial<PrivacySettings>, userId?: string): Promise<OrganizationPreferences> {
    const currentPreferences = await this.getPreferences(userId);
    return this.updatePreferences({
      privacySettings: { ...currentPreferences.privacySettings, ...settings }
    }, userId);
  }

  async updateAccessibilitySettings(settings: Partial<AccessibilitySettings>, userId?: string): Promise<OrganizationPreferences> {
    const currentPreferences = await this.getPreferences(userId);
    return this.updatePreferences({
      accessibilitySettings: { ...currentPreferences.accessibilitySettings, ...settings }
    }, userId);
  }

  async resetToDefaults(userId?: string): Promise<OrganizationPreferences> {
    try {
      const key = userId ? `${PREFERENCES_STORAGE_KEY}_${userId}` : PREFERENCES_STORAGE_KEY;
      await AsyncStorage.removeItem(key);
      return this.defaultPreferences;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw new Error('Failed to reset preferences');
    }
  }
}

export const organizationPreferencesService = new OrganizationPreferencesService();
