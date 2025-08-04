import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../theme/ThemeProvider';
import { IconWrapper } from '../../infrastructure/IconWrapper';

export const SettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: 'account', action: () => {} },
        { label: 'Security', icon: 'shield', action: () => {} },
        { label: 'Privacy', icon: 'eye-off', action: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Notifications', icon: 'bell', action: () => {} },
        { label: 'Appearance', icon: 'palette', action: () => {} },
        { label: 'Language', icon: 'translate', action: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: 'help-circle', action: () => {} },
        { label: 'Contact Us', icon: 'mail', action: () => {} },
        { label: 'About', icon: 'info', action: () => {} },
      ]
    }
  ];

  return (
    <AutoRoleView role="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <AutoRoleView role="header-section" style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Manage your account and preferences
          </Text>
        </AutoRoleView>

        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex} variant="outlined" style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              {section.title}
            </Text>
            {section.items.map((item, itemIndex) => (
              <AutoRoleView
                key={itemIndex}
                role="button"
                style={styles.settingItem}
                onTouchEnd={() => item.action()}
              >
                <IconWrapper
                  name="Ionicons"
                  iconName={item.icon}
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={styles.itemIcon}
                />
                <Text style={[styles.itemLabel, { color: theme.colors.onSurface }]}>
                  {item.label}
                </Text>
                <IconWrapper
                  name="Ionicons"
                  iconName="chevron-forward"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
              </AutoRoleView>
            ))}
          </Card>
        ))}

        <Button
          title="Sign Out"
          onPress={signOut}
          variant="destructive"
          style={styles.signOutButton}
        />
      </ScrollView>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  sectionCard: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
  },
  signOutButton: {
    margin: 16,
    marginTop: 8,
  },
}); 