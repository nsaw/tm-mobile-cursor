import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useOrganizationPreferences } from '../hooks/useOrganizationPreferences';
import { PreferenceToggle } from '../components/PreferenceToggle';
import { Ionicons } from '@expo/vector-icons';

export const OrganizationValidationScreen: React.FC = () => {
  const {
    preferences,
    loading,
    error,
    updateDashboardLayout,
    updateThemePreferences,
    updateNotificationSettings,
    updatePrivacySettings,
    updateAccessibilitySettings,
    resetToDefaults,
  } = useOrganizationPreferences();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading organization preferences...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!preferences) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No preferences found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="settings" size={24} color="#007AFF" />
        <Text style={styles.title}>Organization System Validation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard Layout</Text>
        <PreferenceToggle
          title="Show Recent Thoughtmarks"
          value={preferences.dashboardLayout.showRecentThoughtmarks}
          onValueChange={(value) => updateDashboardLayout({ showRecentThoughtmarks: value })}
          icon="document-text"
        />
        <PreferenceToggle
          title="Show Tasks"
          value={preferences.dashboardLayout.showTasks}
          onValueChange={(value) => updateDashboardLayout({ showTasks: value })}
          icon="checkbox"
        />
        <PreferenceToggle
          title="Show Bins"
          value={preferences.dashboardLayout.showBins}
          onValueChange={(value) => updateDashboardLayout({ showBins: value })}
          icon="folder"
        />
        <PreferenceToggle
          title="Show Tags"
          value={preferences.dashboardLayout.showTags}
          onValueChange={(value) => updateDashboardLayout({ showTags: value })}
          icon="pricetag"
        />
        <PreferenceToggle
          title="Show Stats"
          value={preferences.dashboardLayout.showStats}
          onValueChange={(value) => updateDashboardLayout({ showStats: value })}
          icon="analytics"
        />
        <PreferenceToggle
          title="Compact Mode"
          value={preferences.dashboardLayout.compactMode}
          onValueChange={(value) => updateDashboardLayout({ compactMode: value })}
          icon="resize"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Preferences</Text>
        <PreferenceToggle
          title="Show Animations"
          value={preferences.themePreferences.showAnimations}
          onValueChange={(value) => updateThemePreferences({ showAnimations: value })}
          icon="play"
        />
        <PreferenceToggle
          title="High Contrast"
          value={preferences.themePreferences.highContrast}
          onValueChange={(value) => updateThemePreferences({ highContrast: value })}
          icon="contrast"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <PreferenceToggle
          title="Push Notifications"
          value={preferences.notificationSettings.pushNotifications}
          onValueChange={(value) => updateNotificationSettings({ pushNotifications: value })}
          icon="notifications"
        />
        <PreferenceToggle
          title="Email Notifications"
          value={preferences.notificationSettings.emailNotifications}
          onValueChange={(value) => updateNotificationSettings({ emailNotifications: value })}
          icon="mail"
        />
        <PreferenceToggle
          title="Task Reminders"
          value={preferences.notificationSettings.taskReminders}
          onValueChange={(value) => updateNotificationSettings({ taskReminders: value })}
          icon="alarm"
        />
        <PreferenceToggle
          title="AI Insights"
          value={preferences.notificationSettings.aiInsights}
          onValueChange={(value) => updateNotificationSettings({ aiInsights: value })}
          icon="bulb"
        />
        <PreferenceToggle
          title="Marketing Emails"
          value={preferences.notificationSettings.marketingEmails}
          onValueChange={(value) => updateNotificationSettings({ marketingEmails: value })}
          icon="megaphone"
        />
        <PreferenceToggle
          title="Quiet Hours"
          value={preferences.notificationSettings.quietHours.enabled}
          onValueChange={(value) => updateNotificationSettings({
            quietHours: { ...preferences.notificationSettings.quietHours, enabled: value }
          })}
          icon="moon"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <PreferenceToggle
          title="Data Sharing"
          value={preferences.privacySettings.dataSharing}
          onValueChange={(value) => updatePrivacySettings({ dataSharing: value })}
          icon="share"
        />
        <PreferenceToggle
          title="Analytics Enabled"
          value={preferences.privacySettings.analyticsEnabled}
          onValueChange={(value) => updatePrivacySettings({ analyticsEnabled: value })}
          icon="analytics"
        />
        <PreferenceToggle
          title="Crash Reporting"
          value={preferences.privacySettings.crashReporting}
          onValueChange={(value) => updatePrivacySettings({ crashReporting: value })}
          icon="warning"
        />
        <PreferenceToggle
          title="Location Services"
          value={preferences.privacySettings.locationServices}
          onValueChange={(value) => updatePrivacySettings({ locationServices: value })}
          icon="location"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessibility Settings</Text>
        <PreferenceToggle
          title="Screen Reader"
          value={preferences.accessibilitySettings.screenReader}
          onValueChange={(value) => updateAccessibilitySettings({ screenReader: value })}
          icon="eye"
        />
        <PreferenceToggle
          title="Large Text"
          value={preferences.accessibilitySettings.largeText}
          onValueChange={(value) => updateAccessibilitySettings({ largeText: value })}
          icon="text"
        />
        <PreferenceToggle
          title="Reduce Motion"
          value={preferences.accessibilitySettings.reduceMotion}
          onValueChange={(value) => updateAccessibilitySettings({ reduceMotion: value })}
          icon="pause"
        />
        <PreferenceToggle
          title="High Contrast"
          value={preferences.accessibilitySettings.highContrast}
          onValueChange={(value) => updateAccessibilitySettings({ highContrast: value })}
          icon="contrast"
        />
        <PreferenceToggle
          title="Voice Control"
          value={preferences.accessibilitySettings.voiceControl}
          onValueChange={(value) => updateAccessibilitySettings({ voiceControl: value })}
          icon="mic"
        />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
        <Ionicons name="refresh" size={20} color="#FF4444" />
        <Text style={styles.resetButtonText}>Reset to Defaults</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    color: '#1a1a1a',
  },
  section: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 50,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginLeft: 8,
  },
});
