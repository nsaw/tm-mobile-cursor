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
import { AppNavigator } from './src/navigation/AppNavigator'

// Prevent the splash auto‐hiding before we’re ready
SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_700Bold,
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
if (!fontsLoaded) return null;


  // Don’t render anything until fonts are ready
  if (!fontsLoaded) {
    return null
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  )
}
