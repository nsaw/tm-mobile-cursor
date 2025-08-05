import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AutoRoleView } from '../../components/AutoRoleView';

const SignInScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <AutoRoleView role="screen" style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Sign In Screen
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Sign in to your account
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

export default SignInScreen; 