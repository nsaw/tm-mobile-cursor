import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
declare const console: any;

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log('[HOME] Logout button pressed');
    logout();
  };

  const handleSearch = () => {
    console.log('[HOME] Search button pressed');
    // TODO: Implement search functionality
  };

  const handleBrowseContent = () => {
    console.log('[HOME] Browse Content button pressed');
    // TODO: Implement content browsing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Search" onPress={handleSearch} />
        <View style={styles.buttonSpacer} />
        <Button title="Browse Content" onPress={handleBrowseContent} />
        <View style={styles.buttonSpacer} />
        <Button title="Logout" onPress={handleLogout} color="#ff4444" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#181818',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E0E0E0',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 15,
  },
});

export default HomeScreen; 