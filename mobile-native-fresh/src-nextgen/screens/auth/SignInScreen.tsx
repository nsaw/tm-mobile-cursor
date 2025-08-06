import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AutoRoleView } from '../../components/AutoRoleView';
import { useTheme } from '../../hooks/useTheme';
import { useAuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../theme/ThemeProvider';

type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const theme = useTheme();
  const { signIn, isAuthenticated, loading } = useAuthContext();
  const themeContext = React.useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Debug: Log authentication state
  React.useEffect(() => {
    console.log('🔐 SignInScreen - Auth State:', { isAuthenticated, loading });
  }, [isAuthenticated, loading]);

  const handleSignIn = async () => {
    try {
      console.log('🔐 Attempting sign in with:', email);
      await signIn(email, password);
      console.log('✅ Sign in completed');
    } catch (error) {
      console.error('❌ Sign in error:', error);
      Alert.alert('Sign In Error', 'Invalid email or password');
    }
  };

  const handleBypassLogin = async () => {
    try {
      console.log('🚀 Attempting bypass login');
      await signIn('test@example.com', 'password');
      console.log('✅ Bypass login completed');
    } catch (error) {
      console.error('❌ Bypass login error:', error);
      Alert.alert('Bypass Error', 'Failed to bypass login');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    navigation.navigate('PasswordReset');
  };

  return (
    <AutoRoleView componentRole="screen" style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Theme Toggle Button for Testing */}
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          onPress={themeContext?.toggleTheme}
          accessibilityRole="button"
          accessible={true}
          accessibilityLabel="Toggle theme button">
          <Text style={[styles.themeToggleText, { color: theme.colors.text }]}>
            {themeContext?.isDark ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </TouchableOpacity>

        {/* Debug Info */}
        <View style={[styles.debugInfo, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.debugText, { color: theme.colors.text }]}>
            Auth: {isAuthenticated ? '✅' : '❌'} | Loading: {loading ? '⏳' : '✅'}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Sign in to your Thoughtmarks account
        </Text>

        <View style={styles.form}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface, 
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityRole="text"
            accessible={true}
            accessibilityLabel="Email input field"
          />

          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface, 
              color: theme.colors.text,
              borderColor: theme.colors.border 
            }]}
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSignIn}
            disabled={loading}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.signInButtonText, { color: theme.colors.onPrimary }]}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Bypass Login Button for Testing */}
          <TouchableOpacity
            style={[styles.bypassButton, { backgroundColor: theme.colors.secondary, borderColor: theme.colors.border }]}
            onPress={handleBypassLogin}
            disabled={loading}
           accessibilityRole="button" accessible={true} accessibilityLabel="Bypass login button">
            <Text style={[styles.bypassButtonText, { color: theme.colors.onSurface }]}>
              🚀 Bypass Login (Test)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
           accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Don&apos;t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignUp} accessibilityRole="button" accessible={true} accessibilityLabel="Button">
            <Text style={[styles.signUpLink, { color: theme.colors.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AutoRoleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  debugInfo: {
    position: 'absolute',
    top: 50,
    left: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  debugText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  signInButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bypassButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
  },
  bypassButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// TODO: Implement full feature after navigation unblocked 