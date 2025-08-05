import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../../navigation/MainNavigator';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const theme = useTheme();

  const settingsOptions = [
    { title: 'Profile', route: 'Profile', icon: '👤' },
    { title: 'Premium', route: 'Premium', icon: '⭐' },
    { title: 'Security', route: 'Security', icon: '🔒' },
    { title: 'Theme', route: 'Theme', icon: '🎨' },
  ];

  return (
    <AutoRoleView role="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.route}
            onPress={() => navigation.navigate(option.route as keyof SettingsStackParamList)}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={`Navigate to ${option.title} settings`}
          >
            <AutoRoleView
              role="button"
              style={[styles.option, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            >
              <Text style={[styles.optionIcon, { color: theme.colors.primary }]}>{option.icon}</Text>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{option.title}</Text>
            </AutoRoleView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
});

// TODO: Fully implement after integration is unblocked 