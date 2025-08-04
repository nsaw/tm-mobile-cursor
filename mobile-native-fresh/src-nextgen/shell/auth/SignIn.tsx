import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/ThemeProvider';
import { Button } from '../../components/ui/Button';
import { IconWrapper } from '../../infrastructure/IconWrapper';

export const SignIn: React.FC = () => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AutoRoleView role="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AutoRoleView role="content" style={styles.content}>
        <AutoRoleView role="header-section" style={styles.header}>
          <IconWrapper
            name="MaterialCommunityIcons"
            iconName="thought-bubble"
            size={64}
            color={theme.colors.primary}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to your account
          </Text>
        </AutoRoleView>

        <AutoRoleView role="form" style={styles.form}>
          <AutoRoleView role="input" style={styles.inputContainer}>
            <IconWrapper
              name="Ionicons"
              iconName="mail"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.outline }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </AutoRoleView>

          <AutoRoleView role="input" style={styles.inputContainer}>
            <IconWrapper
              name="Ionicons"
              iconName="lock-closed"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.colors.onSurface, borderColor: theme.colors.outline }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </AutoRoleView>

          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleSignIn}
            disabled={loading}
            style={styles.signInButton}
          />
        </AutoRoleView>
      </AutoRoleView>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  signInButton: {
    marginTop: 8,
  },
}); 