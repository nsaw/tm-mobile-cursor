// App.tsx
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
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
import { AppNavigator } from './src/navigation/AppNavigator'
import { ThemeProvider } from './src/theme/ThemeProvider'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

// Prevent the splash auto‐hiding before we're ready
SplashScreen.preventAutoHideAsync()

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
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      })
    }
  }, [fontsLoaded])

  //Temp Log
  console.log('fontsLoaded:', fontsLoaded);

  // Don't render anything until fonts are ready
  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#181818' }}>
          <StatusBar style="light" />
          <AppNavigator />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
