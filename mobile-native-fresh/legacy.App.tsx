// legacy.App.tsx - Simple legacy app entry point with navigation
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppRegistry, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_700Bold
} from '@expo-google-fonts/oswald';
import {
  Ubuntu_300Light,
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold
} from '@expo-google-fonts/ubuntu';

// Import the simplified SignInScreen (Firebase hooks disabled)
import { SignInScreen } from '@legacy/features/auth/screens';
// Import ThemeProvider to fix useTheme error
import { ThemeProvider } from '@legacy/theme/ThemeProvider';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function LegacyApp(): React.JSX.Element | null {
  const [fontsLoaded] = useFonts({
    'Oswald-Regular': Oswald_400Regular,
    'Oswald-Medium': Oswald_500Medium,
    'Oswald-Bold': Oswald_700Bold,
    'Ubuntu-Light': Ubuntu_300Light,
    'Ubuntu-Regular': Ubuntu_400Regular,
    'Ubuntu-Medium': Ubuntu_500Medium,
    'Ubuntu-Bold': Ubuntu_700Bold,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) { return null; }

  console.log('[LEGACY-APP] 🚀 Legacy app loaded successfully');
  console.log('[LEGACY-APP] Authentication state:', isAuthenticated);

  // Simple Legacy Main App Component
  const LegacyMainApp = () => {
    const handleLogout = () => {
      console.log('[LEGACY-APP] User logged out');
      setIsAuthenticated(false);
    };

    const handleSwitchToNextGen = () => {
      console.log('[LEGACY-APP] User requested switch to NextGen');
      // This would trigger the environment variable change
      // For now, just show instructions
      Alert.alert(
        'Switch to NextGen',
        'To switch to NextGen mode:\n\n1. Stop Expo server (Ctrl+C)\n2. Set EXPO_PUBLIC_USE_NEXTGEN=true\n3. Restart: npx expo start --ios --clear'
      );
    };

    return (
      <View style={styles.mainContainer}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📱 Legacy App</Text>
          <TouchableOpacity style={styles.switchButton} onPress={handleSwitchToNextGen}>
            <Text style={styles.switchButtonText}>🚀 NextGen</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to Legacy Thoughtmarks!</Text>
          <Text style={styles.descriptionText}>
            This is the legacy app version with limited functionality for comparison purposes.
          </Text>
          
          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Legacy Features:</Text>
            <Text style={styles.featureItem}>• Original UI design</Text>
            <Text style={styles.featureItem}>• Legacy authentication flow</Text>
            <Text style={styles.featureItem}>• Basic functionality</Text>
            <Text style={styles.featureItem}>• Comparison reference</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <ThemeProvider>
          {isAuthenticated ? (
            <LegacyMainApp />
          ) : (
            <SignInScreen onAuthenticationSuccess={() => {
              console.log('[LEGACY-APP] Authentication successful, advancing to main app');
              setIsAuthenticated(true);
            }} />
          )}
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  switchButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureList: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LegacyApp;
AppRegistry.registerComponent('auth', () => LegacyApp);
AppRegistry.registerComponent('main', () => LegacyApp);
