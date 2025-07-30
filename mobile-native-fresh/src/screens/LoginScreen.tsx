import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
declare const console: any;

const LoginScreen: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = () => {
    console.log('[LOGIN] Login button pressed');
    login();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Thoughtmarks</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
});

export default LoginScreen; 