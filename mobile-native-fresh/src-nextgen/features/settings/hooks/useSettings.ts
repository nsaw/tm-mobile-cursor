import { useState, useEffect } from 'react';
import { useAppStore } from '../../../state/store';
import { UserSettings, NotificationSettings, PrivacySettings, SecuritySettings, AccessibilitySettings, DataSettings } from '../types/settings';
import { settingsService } from '../services/settingsService';

export const useSettings = () => {
  const { user } = useAppStore();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [user?.id]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
      setError(null);
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const updatedSettings = await settingsService.updateUserSettings(updates);
      setSettings(updatedSettings);
      return { success: true };
    } catch (err) {
      setError('Failed to update settings');
      console.error('Error updating settings:', err);
      return { success: false, error: err };
    }
  };

  const resetToDefaults = async () => {
    try {
      const defaultSettings = await settingsService.resetToDefaults();
      setSettings(defaultSettings);
      return { success: true };
    } catch (err) {
      setError('Failed to reset settings');
      console.error('Error resetting settings:', err);
      return { success: false, error: err };
    }
  };

  const exportSettings = async () => {
    try {
      return await settingsService.exportSettings();
    } catch (err) {
      setError('Failed to export settings');
      console.error('Error exporting settings:', err);
      return { success: false, error: err };
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetToDefaults,
    exportSettings,
    refreshSettings: loadSettings,
  };
};
