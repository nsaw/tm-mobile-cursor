// App.tsx
import React, { useEffect } from 'react'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { LogBox } from 'react-native'
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
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ThemeProvider } from './src/theme/ThemeProvider'
import { AppNavigator } from './src/navigation/AppNavigator'
import { SessionHydrationGuard } from './src/components/ui/SessionHydrationGuard'
// import SiriShortcutsService from './src/services/SiriShortcutsService'

// Prevent the splash auto‐hiding before we're ready
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
})

// Enable ScrollView layout debugging in development
if (__DEV__) {
  (global as any).DEBUG_LAYOUT_PROPS = true;
  
  // Import and alias DebugScrollView for development
  try {
    const { DebugScrollView } = require('./src/components/devtools/DebugScrollView');
    const { ScrollView } = require('react-native');
    
    // Replace ScrollView with DebugScrollView in development
    (global as any).__DEV_SCROLLVIEW_ALIAS__ = {
      ScrollView: DebugScrollView,
      originalScrollView: ScrollView
    };
    console.log('🔍 DebugScrollView wrapper enabled successfully');
  } catch (error) {
    console.error('🔍 Failed to enable DebugScrollView wrapper:', error);
    // Continue without the wrapper if it fails
  }
}

// Configure error overlay to auto-dismiss text string errors
LogBox.ignoreLogs([
  'Text strings should be rendered within a <Text> component',
  'Warning: Text strings should be rendered within a <Text> component',
]);

// Disable LogBox to prevent error toasts
LogBox.uninstall();

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
        <SessionHydrationGuard>
          <AppNavigator />
        </SessionHydrationGuard>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
