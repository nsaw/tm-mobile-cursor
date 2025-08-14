import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsItem } from '../components/SettingsItem';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, loading } = useSettings();

  const settingsSections = [
    {
      title: 'Account',
      icon: 'person',
      items: [
        {
          title: 'Profile',
          subtitle: 'Manage your profile information',
          icon: 'person-circle',
          onPress: () => navigation.navigate('ProfileSettings' as never),
        },
        {
          title: 'Premium',
          subtitle: 'Manage your subscription',
          icon: 'diamond',
          onPress: () => navigation.navigate('PremiumSettings' as never),
        },
      ],
    },
    {
      title: 'Appearance',
      icon: 'color-palette',
      items: [
        {
          title: 'Theme',
          subtitle: settings?.theme === 'auto' ? 'Auto' : settings?.theme === 'dark' ? 'Dark' : 'Light',
          icon: 'moon',
          onPress: () => navigation.navigate('ThemeSettings' as never),
        },
        {
          title: 'Accessibility',
          subtitle: 'Font size, contrast, and more',
          icon: 'accessibility',
          onPress: () => navigation.navigate('AccessibilitySettings' as never),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-checkmark',
      items: [
        {
          title: 'Privacy',
          subtitle: 'Control your data sharing',
          icon: 'lock-closed',
          onPress: () => navigation.navigate('PrivacySettings' as never),
        },
        {
          title: 'Security',
          subtitle: 'Biometric auth and auto-lock',
          icon: 'finger-print',
          onPress: () => navigation.navigate('SecuritySettings' as never),
        },
      ],
    },
    {
      title: 'Data & Storage',
      icon: 'cloud',
      items: [
        {
          title: 'Backup & Sync',
          subtitle: 'Manage your data backup',
          icon: 'cloud-upload',
          onPress: () => navigation.navigate('BackupSettings' as never),
        },
        {
          title: 'Export Data',
          subtitle: 'Export your thoughtmarks',
          icon: 'download',
          onPress: () => navigation.navigate('ExportSettings' as never),
        },
      ],
    },
    {
      title: 'Support',
      icon: 'help-circle',
      items: [
        {
          title: 'Help & FAQ',
          subtitle: 'Get help and answers',
          icon: 'help-buoy',
          onPress: () => navigation.navigate('HelpSettings' as never),
        },
        {
          title: 'Contact Support',
          subtitle: 'Get in touch with us',
          icon: 'mail',
          onPress: () => navigation.navigate('ContactSettings' as never),
        },
        {
          title: 'Terms & Privacy',
          subtitle: 'Legal information',
          icon: 'document-text',
          onPress: () => navigation.navigate('TermsSettings' as never),
        },
      ],
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, index) => (
          <SettingsSection
            key={index}
            title={section.title}
            icon={section.icon}
          >
            {section.items.map((item, itemIndex) => (
              <SettingsItem
                key={itemIndex}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                onPress={item.onPress}
              />
            ))}
          </SettingsSection>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
