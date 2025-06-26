// App.tsx
import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
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

function AppContent() {
  const { tokens } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokens.colors.background }}>
      <StatusBar 
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
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
  // useEffect(() => {
  //   const initializeSiriShortcuts = async () => {
  //     try {
  //       // Donate all shortcuts when app starts
  //       await SiriShortcutsService.donateAllShortcuts();
  //       
  //       // Set up listeners for shortcut invocations
  //       SiriShortcutsService.addListener('com.thoughtmarks.createThoughtmark', (userInfo) => {
  //         console.log('Siri Shortcut invoked: Create Thoughtmark', userInfo);
  //         // Navigate to create thoughtmark screen
  //         // This will be handled by the navigation system
  //       });
  //
  //       SiriShortcutsService.addListener('com.thoughtmarks.voiceRecord', (userInfo) => {
  //         console.log('Siri Shortcut invoked: Voice Record', userInfo);
  //         // Navigate to voice recording
  //         // This will be handled by the navigation system
  //       });
  //
  //       SiriShortcutsService.addListener('com.thoughtmarks.viewTasks', (userInfo) => {
  //         console.log('Siri Shortcut invoked: View Tasks', userInfo);
  //         // Navigate to tasks view
  //         // This will be handled by the navigation system
  //       });
  //
  //       SiriShortcutsService.addListener('com.thoughtmarks.search', (userInfo) => {
  //         console.log('Siri Shortcut invoked: Search', userInfo);
  //         // Navigate to search screen
  //         // This will be handled by the navigation system
  //       });
  //     } catch (error) {
  //       console.error('Error initializing Siri Shortcuts:', error);
  //     }
  //   };
  //
  //   if (fontsLoaded) {
  //     initializeSiriShortcuts();
  //   }
  // }, [fontsLoaded]);

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
