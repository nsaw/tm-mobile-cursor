import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, MessageSquare, Heart, Star, Users } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { FontWeight } from '../../theme/ThemeProvider';
import { Button } from '../../components/ui/Button';
import { AutoRoleView } from '../../components/AutoRoleView';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  newThoughtmarks: boolean;
  likesAndComments: boolean;
  mentions: boolean;
  followers: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

export const Notifications: React.FC = () => {
  const theme = useTheme();
  const { colors, spacing } = theme;
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    newThoughtmarks: true,
    likesAndComments: true,
    mentions: true,
    followers: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: spacing.xl,
    },
    header: {
      marginBottom: spacing.xl,
    },
    headerTitle: {
      fontSize: theme.fontSize.h1,
      fontWeight: theme.fontWeight.bold as FontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    headerSubtitle: {
      fontSize: theme.fontSize.body,
      color: theme.colors.textMuted,
      lineHeight: 20,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.fontSize.h2,
      fontWeight: theme.fontWeight.semibold as FontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingTitle: {
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.medium as FontWeight,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      fontSize: theme.fontSize.caption,
      color: theme.colors.textMuted,
      lineHeight: 16,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    switchContainer: {
      marginLeft: theme.spacing.sm,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xl,
    },
    saveButton: {
      flex: 1,
      marginRight: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
    },
    resetButton: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      backgroundColor: theme.colors.error,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSize.body,
      fontWeight: theme.fontWeight.semibold as FontWeight,
    },
    disabledText: {
      color: theme.colors.textMuted,
      fontStyle: 'italic',
    },
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    Alert.alert('Success', 'Notification settings updated successfully!');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              pushNotifications: true,
              emailNotifications: true,
              newThoughtmarks: true,
              likesAndComments: true,
              mentions: true,
              followers: true,
              weeklyDigest: false,
              marketingEmails: false,
            });
            Alert.alert('Reset Complete', 'Notification settings have been reset to default.');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    key: keyof NotificationSettings,
    title: string,
    description: string,
    icon: React.ReactNode,
    iconColor: string,
    disabled?: boolean
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.iconContainer}>
        <View><Text>{icon}</Text></View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, disabled && styles.disabledText]}>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          value={settings[key]}
          onValueChange={(value) => updateSetting(key, value)}
          disabled={disabled}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={settings[key] ? colors.background : colors.textMuted}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AutoRoleView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>
              Manage how you receive notifications and updates from Thoughtmarks.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Notifications</Text>
            
            {renderSettingItem(
              'pushNotifications',
              'Push Notifications',
              'Receive notifications on your device',
              <Bell size={20} color={colors.background} />,
              colors.accent
            )}
            
            {renderSettingItem(
              'emailNotifications',
              'Email Notifications',
              'Receive notifications via email',
              <MessageSquare size={20} color={colors.background} />,
              colors.accent
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Notifications</Text>
            
            {renderSettingItem(
              'newThoughtmarks',
              'New Thoughtmarks',
              'When someone you follow creates new thoughtmarks',
              <Star size={20} color={colors.background} />,
              colors.accent,
              !settings.pushNotifications && !settings.emailNotifications
            )}
            
            {renderSettingItem(
              'likesAndComments',
              'Likes & Comments',
              'When someone likes or comments on your thoughtmarks',
              <Heart size={20} color={colors.background} />,
              colors.accent,
              !settings.pushNotifications && !settings.emailNotifications
            )}
            
            {renderSettingItem(
              'mentions',
              'Mentions',
              'When someone mentions you in a thoughtmark or comment',
              <Users size={20} color={colors.background} />,
              colors.accent,
              !settings.pushNotifications && !settings.emailNotifications
            )}
            
            {renderSettingItem(
              'followers',
              'New Followers',
              'When someone starts following you',
              <Users size={20} color={colors.background} />,
              colors.accent,
              !settings.pushNotifications && !settings.emailNotifications
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Preferences</Text>
            
            {renderSettingItem(
              'weeklyDigest',
              'Weekly Digest',
              'Receive a weekly summary of your activity',
              <MessageSquare size={20} color={colors.background} />,
              colors.accent,
              !settings.emailNotifications
            )}
            
            {renderSettingItem(
              'marketingEmails',
              'Marketing Emails',
              'Receive updates about new features and promotions',
              <MessageSquare size={20} color={colors.background} />,
              colors.accent,
              !settings.emailNotifications
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button 
              title="Save Settings" 
              onPress={handleSave} 
              style={styles.saveButton}
              textStyle={styles.buttonText}
            />
            <Button 
              title="Reset to Default" 
              onPress={handleReset} 
              style={styles.resetButton}
              textStyle={styles.buttonText}
            />
          </View>
        </ScrollView>
      </AutoRoleView>
    </SafeAreaView>
  );
}; 