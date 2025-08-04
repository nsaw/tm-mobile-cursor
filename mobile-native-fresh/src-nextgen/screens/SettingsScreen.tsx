import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AutoRoleView } from '../components/AutoRoleView';

export const SettingsScreen: React.FC = () => {
  return (
    <AutoRoleView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your app preferences</Text>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsScreen; 