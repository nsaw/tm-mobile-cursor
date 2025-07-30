// App.tsx
import './global/polyfills/registerTextDecoder';
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { LogBox, Linking } from 'react-native'
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
// import SiriShortcutsService from './src/services/SiriShortcutsService'

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
  const { tokens: designTokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: designTokens.colors.background }}>
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

  // Deep Link Handler
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      
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
      initializeSiriShortcuts().catch((error) => {
        console.error('Siri Shortcuts initialization failed:', error);
      });
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

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
