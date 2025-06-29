// App.tsx
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { LogBox } from 'react-native'
import * as Linking from 'expo-linking'
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

import { AppNavigator } from './src/navigation/AppNavigator'
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider'
import DeepLinkService from './src/services/DeepLinkService'
import SiriShortcutsService from './src/services/SiriShortcutsService'

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

function AppContent() {
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaView>
  )
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_700Bold,
    Ubuntu_300Light,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  })

  // Initialize Siri Shortcuts
  useEffect(() => {
    const initializeSiriShortcuts = async () => {
      try {
        // Donate all shortcuts when app starts
        await SiriShortcutsService.getInstance().donateAllShortcuts();
        
        console.log('Siri shortcuts initialized successfully');
      } catch (error) {
        console.error('Error initializing Siri Shortcuts:', error);
      }
    };

    if (fontsLoaded) {
      initializeSiriShortcuts();
    }
  }, [fontsLoaded]);

  // Deep link handling
  useEffect(() => {
    const deepLinkService = DeepLinkService.getInstance();

    const handleInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          console.log('App opened with deep link:', initialURL);
          // Handle initial URL when app is opened from a deep link
          // Navigation will be handled once the app is fully loaded
          deepLinkService.handleDeepLink(initialURL);
        }
      } catch (error) {
        console.error('Error getting initial URL:', error);
      }
    };

    const handleURL = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      // Handle URL when app is already running
      deepLinkService.handleDeepLink(event.url);
    };

    // Set up URL event listeners
    const subscription = Linking.addEventListener('url', handleURL);

    // Handle initial URL if app was opened from a deep link
    handleInitialURL();

    return () => {
      subscription?.remove();
    };
  }, []);

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

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
