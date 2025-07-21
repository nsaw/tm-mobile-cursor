import { Text ,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Brain } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTheme } from '../../../theme/ThemeProvider';
import { AutoRoleView } from '../../../components/AutoRoleView';
// import SiriShortcutsService from '../../../services/SiriShortcutsService';

export const SettingsScreen: React.FC = () => {
  const { tokens, typography } = useTheme();
  const navigation = useNavigation<any>();
  const { user, isAuthenticated, signOut } = useAuth();
  
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
    // No longer set aiNotifications or smartReminders from user
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
      await signOut();
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

  const handleDonateShortcuts = async () => {
    // Siri shortcuts functionality removed due to React version conflicts
    Alert.alert('Siri Shortcuts', 'Siri shortcuts functionality is temporarily disabled.');
  };

  const handleClearShortcuts = async () => {
    // Siri shortcuts functionality removed due to React version conflicts
    Alert.alert('Siri Shortcuts', 'Siri shortcuts functionality is temporarily disabled.');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {},
    showArrow = true,
    tokens
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    showArrow?: boolean;
    tokens: any;
  }) => {
    const { tokens } = useTheme();

let iconElement = null;
    if (icon === 'crown') {
      iconElement = <MaterialCommunityIcons name="crown-outline" size={20} color={tokens.colors.accent ?? '#FFD700'} />;
    } else if (icon === 'brain') {
      iconElement = <Brain size={28} />;
    } else {
      iconElement = <Ionicons name={icon as any} size={20} color={tokens.colors.accent ?? '#000'} />;
    }
    return (
      <TouchableOpacity 
        style={styles.settingItem} 
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button" 
        accessible={true} 
        accessibilityLabel="Button"
      >
        <View style={styles.settingItemLeft}>
          {iconElement}
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
              trackColor={{ false: tokens.colors.border ?? '#ccc', true: tokens.colors.accent ?? '#000' }}
              thumbColor={tokens.colors.background ?? '#fff'}
            />
          )}
          {showArrow && !showSwitch && (
            <Ionicons name="chevron-forward" size={16} color={tokens.colors.textSecondary ?? '#666'} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: tokens.spacing.xl,
    },
    header: {
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: tokens.spacing.sm,
    },
    backButton: {
      marginRight: tokens.spacing.md,
    },
    headerTitle: {
      ...typography.title,
      color: tokens.colors.text,
    },
    headerSubtitle: {
      ...typography.body,
      color: tokens.colors.textSecondary,
    },
    section: {
      marginBottom: tokens.spacing.xxl,
    },
    sectionTitle: {
      ...typography.sectionTitle,
      color: tokens.colors.textSecondary,
      marginBottom: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      textTransform: 'uppercase',
    },
    sectionCard: {
      marginHorizontal: tokens.spacing.lg,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: tokens.spacing.md,
      paddingHorizontal: tokens.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border,
      minHeight: 44,
    },
    settingItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingItemText: {
      marginLeft: tokens.spacing.md,
      flex: 1,
    },
    settingItemTitle: {
      ...typography.body,
      color: tokens.colors.text,
      opacity: 0.85,
    },
    settingItemSubtitle: {
      ...typography.small,
      color: tokens.colors.textSecondary,
      marginTop: 2,
    },
    settingItemRight: {
      alignItems: 'center',
    },
    expandedSettings: {
      backgroundColor: tokens.colors.backgroundSecondary,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingText: {
      marginLeft: tokens.spacing.md,
      flex: 1,
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
      padding: tokens.spacing.lg,
    },
    modalContent: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.spacing.md,
      padding: tokens.spacing.lg,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: '600',
      color: tokens.colors.text,
      marginBottom: tokens.spacing.sm,
    },
    modalSubtitle: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.textSecondary,
      marginBottom: tokens.spacing.lg,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: tokens.colors.border,
      borderRadius: tokens.spacing.sm,
      padding: tokens.spacing.md,
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
      backgroundColor: tokens.colors.background,
      marginBottom: tokens.spacing.lg,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: tokens.spacing.md,
    },
    modalButton: {
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.md,
      borderRadius: tokens.spacing.sm,
    },
    modalButtonText: {
      fontSize: tokens.typography.fontSize.body,
      color: tokens.colors.text,
    },
    modalButtonPrimary: {
      backgroundColor: tokens.colors.accent,
    },
    modalButtonTextPrimary: {
      color: tokens.colors.background,
      fontWeight: '500',
    },
  });

  return (
    <AutoRoleView layoutRole="section" style={{ flex: 1, backgroundColor: tokens.colors.background ?? '#0D0D0F' }}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Button"
            >
              <Ionicons name="arrow-back" size={24} color={tokens.colors.text ?? '#000'} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </View>
          <Text style={styles.headerSubtitle}>Customize your Thoughtmarks experience</Text>
        </View>

        {/* Welcome Section */}
        <Card style={{ alignItems: 'center', paddingHorizontal: tokens.spacing.page, paddingVertical: tokens.spacing.lg, marginBottom: tokens.spacing.xxl }}>
          {(() => {
            const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

const { tokens } = useTheme();

return (
              <>
                {/* Brain icon in circle */}
                <View style={{
                  width: 48, height: 48, borderRadius: 24, marginBottom: tokens.spacing.md,
                  backgroundColor: `${tokens.colors.success ?? '#000'}80`, // 50% opacity
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Brain size={28} />
                </View>
                {/* Title */}
                <Text style={{
                  ...typography.sectionTitle,
                  color: tokens.colors.text,
                  textAlign: 'center',
                  marginBottom: tokens.spacing.sm,
                }}>
                  Welcome to Thoughtmarks{user ? `, ${user.firstName || user.displayName?.split(' ')[0] || user.email?.split('@')[0]}` : ''}
                </Text>
                {/* Subtitle */}
                <Text style={{
                  ...typography.body,
                  color: tokens.colors.textSecondary,
                  textAlign: 'center',
                  marginBottom: tokens.spacing.md,
                }}>
                  Capture fleeting thoughts without breaking your flow-- a quick reference for your brain! Use voice commands, quick notes, or AI-powered categorization to build your personal knowledge base effortlessly.
                </Text>
                {/* User Guide Button */}
                <Button
                  style={{
                    width: '100%',
                    minWidth: '50%',
                    backgroundColor: tokens.colors.accent,
                    paddingVertical: tokens.spacing.sm,
                    borderRadius: tokens.radius.md,
                  }}
                  onPress={() => navigation.navigate('HowTo')}
                >
                  <Text style={{
                    ...typography.buttonText,
                    color: tokens.colors.buttonText,
                    textAlign: 'center',
                    width: '100%',
                   }}>
                    User Guide
                  </Text>
                </Button>
              </>
            );
          })()}
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
              tokens={tokens}
            />
            <SettingItem
              icon="key"
              title="Security"
              subtitle="Password, 2FA, and security settings"
              onPress={() => navigation.navigate('Security')}
              tokens={tokens}
            />
            <SettingItem
              icon="crown"
              title="Premium"
              subtitle="Upgrade to unlock advanced features"
              onPress={() => navigation.navigate('Premium')}
              tokens={tokens}
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
              tokens={tokens}
            />
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={() => setNotificationsExpanded(!notificationsExpanded)}
              tokens={tokens}
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
                  tokens={tokens}
                />
                <SettingItem
                  icon="sparkles"
                  title="AI Notifications"
                  showSwitch={true}
                  switchValue={aiNotifications}
                  onSwitchChange={setAiNotifications}
                  showArrow={false}
                  tokens={tokens}
                />
                <SettingItem
                  icon="time"
                  title="Smart Reminders"
                  showSwitch={true}
                  switchValue={smartReminders}
                  onSwitchChange={setSmartReminders}
                  showArrow={false}
                  tokens={tokens}
                />
              </View>
            )}
            <SettingItem
              icon="mic"
              title="Voice Commands"
              subtitle="Set up Siri or Google Assistant"
              onPress={() => setShowSiriDialog(true)}
              tokens={tokens}
            />
            <SettingItem
              icon="cloud-upload"
              title="Export Data"
              subtitle="Download your data"
              onPress={() => navigation.navigate('Export')}
              tokens={tokens}
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
              tokens={tokens}
            />
          </Card>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT & LEGAL</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help or contact support"
              onPress={() => navigation.navigate('Help')}
              tokens={tokens}
            />
            <SettingItem
              icon="document-text"
              title="Terms of Service"
              subtitle="Read our terms"
              onPress={() => navigation.navigate('Terms')}
              tokens={tokens}
            />
            <SettingItem
              icon="shield-checkmark"
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() => navigation.navigate('Privacy')}
              tokens={tokens}
            />
            <SettingItem
              icon="mail"
              title="Contact Support"
              subtitle="Email or message us"
              onPress={() => navigation.navigate('Contact')}
              tokens={tokens}
            />
          </Card>
        </View>

        {/* Siri Shortcuts */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>SIRI SHORTCUTS</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="mic"
              title="Donate All Shortcuts"
              subtitle="Make all actions available to Siri"
              onPress={async () => {
                try {
                  await SiriShortcutsService.donateAllShortcuts();
                  Alert.alert(
                    'Shortcuts Donated',
                    'All Siri shortcuts have been donated successfully. You can now use Siri to perform actions in Thoughtmarks.'
                  );
                } catch (error) {
                  Alert.alert(
                    'Error',
                    'Failed to donate shortcuts. Please try again.'
                  );
                }
              }}
            />
            <SettingItem
              icon="trash-outline"
              title="Clear All Shortcuts"
              subtitle="Remove all Siri shortcuts"
              onPress={async () => {
                Alert.alert(
                  'Clear Shortcuts',
                  'Are you sure you want to clear all Siri shortcuts?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await SiriShortcutsService.clearAllShortcuts();
                          Alert.alert(
                            'Shortcuts Cleared',
                            'All Siri shortcuts have been cleared.'
                          );
                        } catch (error) {
                          Alert.alert(
                            'Error',
                            'Failed to clear shortcuts. Please try again.'
                          );
                        }
                      }
                    }
                  ]
                );
              }}
            />
          </Card>
        </View> */}

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>
          <Card style={styles.sectionCard}>
            <SettingItem
              icon="log-out"
              title="Sign Out"
              subtitle="Sign out of your account"
              onPress={handleSignOut}
              tokens={tokens}
            />
            <SettingItem
              icon="trash"
              title="Delete Account"
              subtitle="Permanently delete your account"
              onPress={handleDeleteAccount}
              tokens={tokens}
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
              tokens={tokens}
            />
            <SettingItem
              icon="code-slash"
              title="Build"
              subtitle="2024.1.0"
              showArrow={false}
              tokens={tokens}
            />
          </Card>
        </View>

        {/* Admin Section - Only show for admin users */}
        {(user?.email?.includes('admin') || user?.isAdmin) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('AdminDashboard')}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Button"
            >
              <View style={styles.settingLeft}>
                <Ionicons name="shield-outline" size={20} color={tokens.colors.accent ?? '#000'} />
                <Text style={styles.settingText}>Admin Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={tokens.colors.textSecondary ?? '#666'} />
            </TouchableOpacity>
          </View>
        )}
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
              placeholderTextColor={tokens.colors.textSecondary ?? '#666'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSiriDialog(false)}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel="Button"
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSiriPhraseSave}
                accessibilityRole="button" 
                accessible={true} 
                accessibilityLabel="Button"
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </AutoRoleView>
  );
}; 