import { UserSettings, NotificationSettings, PrivacySettings, SecuritySettings, AccessibilitySettings, DataSettings } from '../types/settings';
import { apiClient } from '../../../services/api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SettingsService {
  private readonly baseUrl = '/settings';
  private readonly storageKey = '@thoughtmarks_settings';

  async getUserSettings(): Promise<UserSettings> {
    try {
      // Try to get from API first
      const response = await apiClient.get(`${this.baseUrl}/user`);
      const settings = response.data;
      await this.cacheSettings(settings);
      return settings;
    } catch (error) {
      console.warn('Failed to fetch settings from API, using cached version');
      return this.getCachedSettings();
    }
  }

  async updateUserSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/user`, updates);
      const updatedSettings = response.data;
      await this.cacheSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  async resetToDefaults(): Promise<UserSettings> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/reset`);
      const defaultSettings = response.data;
      await this.cacheSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  async exportSettings(): Promise<{ success: boolean; data?: any; error?: any }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/export`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error exporting settings:', error);
      return { success: false, error };
    }
  }

  async importSettings(settingsData: any): Promise<UserSettings> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/import`, settingsData);
      const importedSettings = response.data;
      await this.cacheSettings(importedSettings);
      return importedSettings;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }

  private async cacheSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error caching settings:', error);
    }
  }

  private async getCachedSettings(): Promise<UserSettings> {
    try {
      const cached = await AsyncStorage.getItem(this.storageKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error getting cached settings:', error);
    }
    return this.getDefaultSettings();
  }

  private getDefaultSettings(): UserSettings {
    return {
      theme: 'auto',
      notifications: {
        enabled: true,
        sound: true,
        vibration: true,
        reminders: true,
        marketing: false,
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        crashReports: true,
        locationServices: false,
      },
      security: {
        biometricAuth: false,
        autoLock: true,
        lockTimeout: 300,
        siriIntegration: false,
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
      },
      data: {
        autoBackup: true,
        backupFrequency: 'weekly',
        exportFormat: 'json',
        retentionPeriod: 365,
      },
    };
  }
}

export const settingsService = new SettingsService();
