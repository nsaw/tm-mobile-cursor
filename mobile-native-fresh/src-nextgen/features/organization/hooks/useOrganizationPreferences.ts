import { useState, useEffect } from 'react';
import { OrganizationPreferences, DashboardLayout, ThemePreferences, NotificationSettings, PrivacySettings, AccessibilitySettings } from '../types/organization-preferences';
import { organizationPreferencesService } from '../services/organizationPreferencesService';
import { useAuth } from '../../auth/hooks/useAuth';

export const useOrganizationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<OrganizationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await organizationPreferencesService.getPreferences(user?.id);
      setPreferences(prefs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<OrganizationPreferences>) => {
    try {
      setLoading(true);
      const updatedPrefs = await organizationPreferencesService.updatePreferences(updates, user?.id);
      setPreferences(updatedPrefs);
      setError(null);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardLayout = async (layout: Partial<DashboardLayout>) => {
    try {
      const updatedPrefs = await organizationPreferencesService.updateDashboardLayout(layout, user?.id);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dashboard layout');
      throw err;
    }
  };

  const updateThemePreferences = async (theme: Partial<ThemePreferences>) => {
    try {
      const updatedPrefs = await organizationPreferencesService.updateThemePreferences(theme, user?.id);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update theme preferences');
      throw err;
    }
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    try {
      const updatedPrefs = await organizationPreferencesService.updateNotificationSettings(settings, user?.id);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update notification settings');
      throw err;
    }
  };

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    try {
      const updatedPrefs = await organizationPreferencesService.updatePrivacySettings(settings, user?.id);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update privacy settings');
      throw err;
    }
  };

  const updateAccessibilitySettings = async (settings: Partial<AccessibilitySettings>) => {
    try {
      const updatedPrefs = await organizationPreferencesService.updateAccessibilitySettings(settings, user?.id);
      setPreferences(updatedPrefs);
      return updatedPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update accessibility settings');
      throw err;
    }
  };

  const resetToDefaults = async () => {
    try {
      setLoading(true);
      const defaultPrefs = await organizationPreferencesService.resetToDefaults(user?.id);
      setPreferences(defaultPrefs);
      setError(null);
      return defaultPrefs;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    updateDashboardLayout,
    updateThemePreferences,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    resetToDefaults,
    refresh: loadPreferences,
  };
};
