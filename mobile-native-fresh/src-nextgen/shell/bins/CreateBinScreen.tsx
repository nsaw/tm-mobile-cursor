import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../theme/ThemeProvider';

export const CreateBinScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <AutoRoleView role="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AutoRoleView role="header-section" style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Create Bin</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Create a new collection
        </Text>
      </AutoRoleView>
      
      <AutoRoleView role="content" style={styles.content}>
        <Text style={[styles.bodyText, { color: theme.colors.text }]}>
          Create bin form will appear here.
        </Text>
      </AutoRoleView>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 18,
    textAlign: 'center',
  },
}); 