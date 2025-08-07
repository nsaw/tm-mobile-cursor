import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AutoRoleView } from '../../components/AutoRoleView';

const ThoughtmarkDetailScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <AutoRoleView componentRole="screen" style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Thoughtmark Detail
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Thoughtmark detail functionality coming soon
      </Text>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export { ThoughtmarkDetailScreen };
export default ThoughtmarkDetailScreen; 
