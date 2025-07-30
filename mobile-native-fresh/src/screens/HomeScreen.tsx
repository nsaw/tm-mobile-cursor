import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
declare const console: any;

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Content: undefined;
};

type NavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    console.log('[HOME] Logout button pressed');
    logout();
  };

  const navigateToSearch = () => {
    console.log('[HOME] Navigating to Search');
    navigation.navigate('Search');
  };

  const navigateToContent = () => {
    console.log('[HOME] Navigating to Content');
    navigation.navigate('Content');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name}!</Text>
      <Text style={styles.subtitle}>What would you like to do?</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Search" onPress={navigateToSearch} />
        <View style={styles.buttonSpacer} />
        <Button title="Browse Content" onPress={navigateToContent} />
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
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 15,
  },
});

export default HomeScreen; 