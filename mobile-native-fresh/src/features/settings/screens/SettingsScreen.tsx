import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../../theme/theme';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [showNavLabels, setShowNavLabels] = useState(true);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSiriDialog, setShowSiriDialog] = useState(false);
  const [siriTriggerPhrase, setSiriTriggerPhrase] = useState('add to Thoughtmarks');
  const [tempSiriPhrase, setTempSiriPhrase] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [aiNotifications, setAiNotifications] = useState(true);
  const [smartReminders, setSmartReminders] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (user?.isPremium || user?.isTestUser) {
      setAiNotifications(user?.aiNotifications !== undefined ? user.aiNotifications : true);
      setSmartReminders(user?.smartReminders !== undefined ? user.smartReminders : true);
    }
  }, [user]);

  // Load saved preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedNavLabels = await AsyncStorage.getItem('showNavLabels');
      const savedSiriPhrase = await AsyncStorage.getItem('siriTriggerPhrase');
      
      if (savedNavLabels !== null) {
        setShowNavLabels(savedNavLabels !== 'false');
      }
      if (savedSiriPhrase) {
        setSiriTriggerPhrase(savedSiriPhrase);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Save nav labels preference
  useEffect(() => {
    saveNavLabelsPreference();
  }, [showNavLabels]);

  const saveNavLabelsPreference = async () => {
    try {
      await AsyncStorage.setItem('showNavLabels', showNavLabels.toString());
    } catch (error) {
      console.error('Error saving nav labels preference:', error);
    }
  };

  // Save Siri phrase preference
  const handleSiriPhraseSave = () => {
    setSiriTriggerPhrase(tempSiriPhrase);
    AsyncStorage.setItem('siriTriggerPhrase', tempSiriPhrase);
    setShowSiriDialog(false);
    Alert.alert(
      'Siri Phrase Updated',
      `Your Siri trigger phrase is now: "Hey Siri, ${tempSiriPhrase}"`
    );
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logout();
      Alert.alert(
        'Signed out successfully',
        'You have been signed out of your account.'
      );
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert(
        'Error signing out',
        'There was a problem signing you out. Please try again.'
      );
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement account deletion API call
              Alert.alert(
                'Account deleted',
                'Your account has been successfully deleted.'
              );
              navigation.navigate('SignIn');
            } catch (error) {
              Alert.alert(
                'Error deleting account',
                'There was a problem deleting your account. Please try again.'
              );
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {},
    showArrow = true 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        <View style={styles.settingItemText}>
          <Text style={styles.settingItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingItemRight}>
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        )}
        {showArrow && !showSwitch && (
          <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </View>
          <Text style={styles.headerSubtitle}>Customize your Thoughtmarks experience</Text>
        </View>

        {/* Welcome Section */}
        <Card style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Ionicons name="brain" size={32} color={colors.primary} />
            <Text style={styles.welcomeTitle}>
              Welcome to Thoughtmarks{user ? `, ${user.firstName || user.displayName?.split(' ')[0] || user.email?.split('@')[0]}` : ''}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Your personal knowledge management system
            </Text>
          </View>
        </Card>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="person"
              title="Profile"
              subtitle="Manage your account information"
              onPress={() => navigation.navigate('Profile')}
            />
            <SettingItem
              icon="key"
              title="Security"
              subtitle="Password, 2FA, and security settings"
              onPress={() => navigation.navigate('Security')}
            />
            <SettingItem
              icon="crown"
              title="Premium"
              subtitle="Upgrade to unlock advanced features"
              onPress={() => navigation.navigate('Premium')}
            />
          </Card>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP SETTINGS</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="color-palette"
              title="Theme"
              subtitle="Light, dark, or auto"
              onPress={() => navigation.navigate('Theme')}
            />
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => setNotificationsExpanded(!notificationsExpanded)}
            />
            {notificationsExpanded && (
              <View style={styles.expandedSettings}>
                <SettingItem
                  icon="mail"
                  title="Marketing Emails"
                  showSwitch={true}
                  switchValue={marketingEmails}
                  onSwitchChange={setMarketingEmails}
                  showArrow={false}
                />
                <SettingItem
                  icon="sparkles"
                  title="AI Notifications"
                  showSwitch={true}
                  switchValue={aiNotifications}
                  onSwitchChange={setAiNotifications}
                  showArrow={false}
                />
                <SettingItem
                  icon="time"
                  title="Smart Reminders"
                  showSwitch={true}
                  switchValue={smartReminders}
                  onSwitchChange={setSmartReminders}
                  showArrow={false}
                />
              </View>
            )}
            <SettingItem
              icon="mic"
              title="Siri Integration"
              subtitle={`"Hey Siri, ${siriTriggerPhrase}"`}
              onPress={() => {
                setTempSiriPhrase(siriTriggerPhrase);
                setShowSiriDialog(true);
              }}
            />
            <SettingItem
              icon="download"
              title="Export Data"
              subtitle="Download your thoughtmarks"
              onPress={() => navigation.navigate('Export')}
            />
          </Card>
        </View>

        {/* Navigation Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NAVIGATION</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="list"
              title="Show Navigation Labels"
              subtitle="Display text labels in bottom navigation"
              showSwitch={true}
              switchValue={showNavLabels}
              onSwitchChange={setShowNavLabels}
              showArrow={false}
            />
          </Card>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT & LEGAL</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="help-circle"
              title="Help & FAQ"
              subtitle="Get help and find answers"
              onPress={() => navigation.navigate('Help')}
            />
            <SettingItem
              icon="document-text"
              title="Terms of Service"
              subtitle="Read our terms and conditions"
              onPress={() => navigation.navigate('Terms')}
            />
            <SettingItem
              icon="shield"
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => navigation.navigate('Privacy')}
            />
            <SettingItem
              icon="mail"
              title="Contact Support"
              subtitle="Get in touch with our team"
              onPress={() => navigation.navigate('Contact')}
            />
          </Card>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="log-out"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleSignOut}
            />
            <SettingItem
              icon="trash"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
            />
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP INFO</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="information-circle"
              title="Version"
              subtitle="1.0.0"
              showArrow={false}
            />
            <SettingItem
              icon="code-slash"
              title="Build"
              subtitle="2024.1.0"
              showArrow={false}
            />
          </Card>
        </View>
      </ScrollView>

      {/* Siri Dialog */}
      {showSiriDialog && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Customize Siri Phrase</Text>
            <Text style={styles.modalSubtitle}>
              Set a custom phrase for Siri to add thoughtmarks
            </Text>
            <TextInput
              style={styles.modalInput}
              value={tempSiriPhrase}
              onChangeText={setTempSiriPhrase}
              placeholder="Enter your Siri phrase"
              placeholderTextColor={colors.subtext}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSiriDialog(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSiriPhraseSave}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.heading.fontSize,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
  },
  welcomeCard: {
    marginBottom: spacing.xl,
  },
  welcomeContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  welcomeTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingItemTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.text,
  },
  settingItemSubtitle: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  settingItemRight: {
    alignItems: 'center',
  },
  expandedSettings: {
    paddingLeft: spacing.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: spacing.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.subheading.fontSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: typography.body.fontSize,
    color: colors.subtext,
    marginBottom: spacing.lg,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  modalButtonTextPrimary: {
    color: colors.background,
    fontWeight: '500',
  },
}); 