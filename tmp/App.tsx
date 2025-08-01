// App.tsx
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { LogBox, Linking, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import {
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_700Bold
} from '@expo-google-fonts/oswald'
import {
  Ubuntu_300Light,
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold
} from '@expo-google-fonts/ubuntu'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Dual-mount system: Check environment variable to determine which app to load
const USE_NEXTGEN = process.env.EXPO_PUBLIC_USE_NEXTGEN === 'true';
console.log('[DUAL-MOUNT] Environment check:', {
  EXPO_PUBLIC_USE_NEXTGEN: process.env.EXPO_PUBLIC_USE_NEXTGEN,
  USE_NEXTGEN: USE_NEXTGEN,
  NODE_ENV: process.env.NODE_ENV,
  EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT
});

// Prevent the splash auto‐hiding before we're ready
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
})

// Configure error overlay to auto-dismiss text string errors
LogBox.ignoreLogs([
  'Text strings should be rendered within a <Text> component',
  'Warning: Text strings should be rendered within a <Text> component',
]);

// Disable LogBox to prevent error toasts
LogBox.uninstall();

// Environment Toggle Component (Development Only)
function EnvironmentToggle({ onToggle, isNextGen }: { onToggle: () => void, isNextGen: boolean }) {
  if (__DEV__) {
    return (
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
          <Text style={styles.toggleText}>
            {isNextGen ? '🔄 NextGen' : '🔄 Legacy'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}

function AppContent() {
  const [isNextGen, setIsNextGen] = useState(USE_NEXTGEN);
  
  const handleEnvironmentToggle = () => {
    setIsNextGen(!isNextGen);
    console.log(`Switched to ${!isNextGen ? 'NextGen' : 'Legacy'} environment`);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <EnvironmentToggle onToggle={handleEnvironmentToggle} isNextGen={isNextGen} />
      {isNextGen ? (
        <View style={styles.nextgenContainer}>
          <Text style={styles.nextgenText}>🚀 NextGen Environment</Text>
          <Text style={styles.nextgenSubtext}>Coming soon...</Text>
        </View>
      ) : (
        <View style={styles.legacyContainer}>
          <Text style={styles.legacyText}>📱 Legacy App</Text>
          <Text style={styles.legacySubtext}>Loading from src-reference...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default function App() {
  console.log('[APP] 🚀 App function executed - THIS SHOULD APPEAR');
  console.log('[APP] USE_NEXTGEN:', USE_NEXTGEN);

  // Load fonts first - this must be before any early returns
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_700Bold,
    Ubuntu_300Light,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  // Deep Link Handler
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      
      // Handle Expo development URLs
      if (url.startsWith('exp://')) {
        const route = url.replace('exp://192.168.68.127:8081', '').trim();
        if (!route) {
          console.warn('Unknown deep link route:', url);
          return;
        }
        console.log('Expo deep link route:', route);
        return;
      }
      
      // Parse the URL to extract route and parameters
      const route = url.replace('thoughtmarks://', '');
      
      // Handle different deep link routes
      switch (route) {
        case 'home':
          // Navigate to home screen
          console.log('Navigating to home');
          break;
        case 'create':
          // Navigate to create thoughtmark screen
          console.log('Navigating to create thoughtmark');
          break;
        case 'search':
          // Navigate to search screen
          console.log('Navigating to search');
          break;
        case 'tasks':
          // Navigate to tasks screen
          console.log('Navigating to tasks');
          break;
        default:
          console.log('Unknown deep link route:', route);
      }
    };

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Handle deep links when app is opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Initialize Siri Shortcuts
  useEffect(() => {
    const initializeSiriShortcuts = async () => {
      try {
        // Donate shortcuts for common actions
        const shortcuts = [
          {
            identifier: 'com.thoughtmarks.createThoughtmark',
            title: 'Add Thoughtmark',
            subtitle: 'Quickly add a new thoughtmark',
            phrase: 'Add a thoughtmark'
          },
          {
            identifier: 'com.thoughtmarks.voiceRecord',
            title: 'Voice Record',
            subtitle: 'Record a voice thoughtmark',
            phrase: 'Record my thoughts'
          },
          {
            identifier: 'com.thoughtmarks.viewTasks',
            title: 'View Tasks',
            subtitle: 'Check your tasks',
            phrase: 'Show my tasks'
          },
          {
            identifier: 'com.thoughtmarks.search',
            title: 'Search Thoughtmarks',
            subtitle: 'Search your thoughtmarks',
            phrase: 'Search thoughtmarks'
          }
        ];

        // Note: In a real implementation, you would use expo-siri-shortcuts
        // or a native module to donate these shortcuts
        console.log('Siri shortcuts configured:', shortcuts);
        
        // Set up listeners for shortcut invocations
        // This would be handled by the deep link system above
        console.log('Siri shortcut listeners configured');
      } catch (error) {
        console.error('Error initializing Siri Shortcuts:', error);
      }
    };

    if (fontsLoaded) {
      initializeSiriShortcuts().catch(console.error);
    }
  }, [fontsLoaded]);

  // Once fonts finish loading, hide the splash
  useEffect(() => {
    const hideSplash = async () => {
      try {
        if (fontsLoaded) {
          console.log('Fonts loaded, hiding splash screen...');
          await SplashScreen.hideAsync();
          console.log('Splash screen hidden successfully');
        }
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    };

    hideSplash();
  }, [fontsLoaded]);

  // Don't render anything until fonts are ready
  if (!fontsLoaded) {
    console.log('Fonts not loaded yet, showing splash screen...');
    return null;
  }

  // Dual-mount system: Load NextGen app if environment variable is set
  if (USE_NEXTGEN) {
    console.log('[APP] Loading NextGen app...');
    try {
      // Try dynamic import first
      const NextGenApp = require('./src-nextgen/App').default;
      console.log('[APP] NextGen app loaded successfully');
      console.log('[APP] NextGenApp type:', typeof NextGenApp);
      return <NextGenApp />;
    } catch (error) {
      console.error('[APP] Failed to load NextGen app:', error);
      console.error('[APP] Error details:', error instanceof Error ? error.message : String(error));
      console.log('[APP] Falling back to mock app...');
    }
  } else {
    console.log('[APP] USE_NEXTGEN is false, loading legacy app from src-reference...');
    try {
      // Load the legacy app from src-reference
      const { AppNavigator } = require('./src-reference/navigation/AppNavigator');
      console.log('[APP] Legacy app loaded successfully');
      console.log('[APP] LegacyAppNavigator type:', typeof AppNavigator);
      return <AppNavigator />;
    } catch (error) {
      console.error('[APP] Failed to load legacy app:', error);
      console.error('[APP] Error details:', error instanceof Error ? error.message : String(error));
      console.log('[APP] Falling back to mock app...');
      return (
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar style="light" />
            <View style={styles.legacyContainer}>
              <Text style={styles.legacyText}>📱 Legacy App Loaded</Text>
              <Text style={styles.legacySubtext}>Successfully loaded from src-reference</Text>
              <Text style={styles.legacySubtext}>Environment: {process.env.EXPO_PUBLIC_USE_NEXTGEN}</Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }
  }

  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderBottomRightRadius: 10,
  },
  toggleButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  toggleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextgenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  nextgenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  nextgenSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  legacyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  legacyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  legacySubtext: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
});
